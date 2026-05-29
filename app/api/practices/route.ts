import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS, currentMonth, type PlanType } from "@/lib/plans";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q          = searchParams.get("q")?.trim() ?? "";
  const difficulty = searchParams.get("difficulty") ?? "";
  const ageGroup   = searchParams.get("ageGroup") ?? "";
  const skillsRaw  = searchParams.get("skills") ?? "";   // カンマ区切り
  const sort       = searchParams.get("sort") ?? "newest"; // "newest" | "popular"

  const selectedSkills = skillsRaw ? skillsRaw.split(",").map(s => s.trim()).filter(Boolean) : [];

  // where 条件を組み立て
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const andConditions: any[] = [];

  if (difficulty) andConditions.push({ difficulty });
  if (ageGroup)   andConditions.push({ ageGroup });

  // キーワード検索：タイトル OR 説明文
  if (q) {
    andConditions.push({
      OR: [
        { title:       { contains: q } },
        { description: { contains: q } },
      ],
    });
  }

  // スキル検索：選択スキルのうちどれか1つ以上含む
  if (selectedSkills.length > 0) {
    andConditions.push({
      OR: selectedSkills.map(s => ({ skills: { contains: `"${s}"` } })),
    });
  }

  const where = andConditions.length > 0 ? { AND: andConditions } : {};

  const orderBy =
    sort === "popular"
      ? { likes: { _count: "desc" as const } }
      : { createdAt: "desc" as const };

  const practices = await prisma.practice.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy,
  });

  return NextResponse.json(practices);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, difficulty, ageGroup, participants, duration, skills, videoUrl, youtubeUrl } = body;

  if (!title || !description || !difficulty || !ageGroup || !participants || !duration || !skills) {
    return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
  }

  const userId = (session.user as { id?: string }).id!;

  // プラン制限チェック
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
  const plan = (user?.plan ?? "free") as PlanType;
  const limit = PLAN_LIMITS[plan].postsPerMonth;

  if (limit !== null) {
    const month = currentMonth();
    const startOfMonth = new Date(`${month}-01T00:00:00.000Z`);
    const count = await prisma.practice.count({
      where: { authorId: userId, createdAt: { gte: startOfMonth } },
    });
    if (count >= limit) {
      return NextResponse.json(
        {
          error: `無料プランの今月の投稿上限（${limit}件）に達しました`,
          limitReached: true,
          plan,
          limit,
          count,
        },
        { status: 403 }
      );
    }
  }

  // 動画アップロード制限チェック
  if (videoUrl && !PLAN_LIMITS[plan].videoUpload) {
    return NextResponse.json(
      { error: "動画アップロードは有料プランのみ利用できます", limitReached: true, plan },
      { status: 403 }
    );
  }

  const practice = await prisma.practice.create({
    data: {
      title,
      description,
      difficulty,
      ageGroup,
      participants: Number(participants),
      duration: Number(duration),
      skills: JSON.stringify(skills),
      videoUrl: videoUrl || null,
      youtubeUrl: youtubeUrl || null,
      authorId: userId,
    },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(practice, { status: 201 });
}
