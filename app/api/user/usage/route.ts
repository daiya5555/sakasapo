import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS, currentMonth, type PlanType } from "@/lib/plans";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id!;
  const month = currentMonth();

  const [user, postCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, aiSearchCount: true, aiSearchMonth: true },
    }),
    prisma.practice.count({
      where: {
        authorId: userId,
        createdAt: { gte: new Date(`${month}-01T00:00:00.000Z`) },
      },
    }),
  ]);

  const plan = (user?.plan ?? "free") as PlanType;
  const limits = PLAN_LIMITS[plan];

  const aiCount = user?.aiSearchMonth === month ? (user?.aiSearchCount ?? 0) : 0;

  return NextResponse.json({
    plan,
    planLabel: limits.label,
    posts: {
      count: postCount,
      limit: limits.postsPerMonth,
      remaining: limits.postsPerMonth !== null ? Math.max(0, limits.postsPerMonth - postCount) : null,
    },
    aiSearches: {
      count: aiCount,
      limit: limits.aiSearchesPerMonth,
      remaining: limits.aiSearchesPerMonth !== null ? Math.max(0, limits.aiSearchesPerMonth - aiCount) : null,
    },
    videoUpload: limits.videoUpload,
  });
}
