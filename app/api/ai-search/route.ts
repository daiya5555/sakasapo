import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS, currentMonth, type PlanType } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  if (!query?.trim()) {
    return NextResponse.json({ error: "検索キーワードを入力してください" }, { status: 400 });
  }

  // APIキーチェック
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI機能を使うには ANTHROPIC_API_KEY を .env に設定してください" },
      { status: 503 }
    );
  }

  // ログインユーザーのプラン制限チェック
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, aiSearchCount: true, aiSearchMonth: true },
    });

    const plan = (user?.plan ?? "free") as PlanType;
    const aiLimit = PLAN_LIMITS[plan].aiSearchesPerMonth;

    if (aiLimit !== null) {
      const month = currentMonth();
      const currentCount = user?.aiSearchMonth === month ? (user?.aiSearchCount ?? 0) : 0;

      if (currentCount >= aiLimit) {
        return NextResponse.json(
          {
            error: `今月のAI提案の利用回数（${aiLimit}回）に達しました`,
            limitReached: true,
            plan,
            limit: aiLimit,
            count: currentCount,
          },
          { status: 403 }
        );
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          aiSearchCount: currentCount + 1,
          aiSearchMonth: month,
        },
      });
    }
  }

  const practices = await prisma.practice.findMany({
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { likes: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  if (practices.length === 0) {
    return NextResponse.json({ suggestions: [], message: "まだ練習メニューが投稿されていません。" });
  }

  const practiceList = practices
    .map((p) => {
      const skills = (() => { try { return JSON.parse(p.skills); } catch { return [p.skills]; } })();
      return `ID: ${p.id}
タイトル: ${p.title}
説明: ${p.description}
難易度: ${p.difficulty}
対象年齢: ${p.ageGroup}
最低人数: ${p.participants}人
所要時間: ${p.duration}分
スキル: ${Array.isArray(skills) ? skills.join(", ") : skills}
いいね数: ${p._count.likes}`;
    })
    .join("\n\n---\n\n");

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      system: `あなたはサカサポ（親子サッカー練習アプリ）の専門家AIアシスタントです。
ユーザーが身につけたいサッカースキルや目標を入力すると、投稿された練習メニューの中から最適なものを3〜5件選び、なぜおすすめなのかを日本語で説明します。
回答はJSON形式で返してください。形式: {"suggestions": [{"id": "...", "reason": "...おすすめの理由..."}], "advice": "全体的なアドバイス"}`,
      messages: [
        {
          role: "user",
          content: `身につけたいこと・目標: ${query}\n\n利用可能な練習メニュー一覧:\n${practiceList}`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    let parsed: { suggestions: { id: string; reason: string }[]; advice: string };
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { suggestions: [], advice: text };
    } catch {
      parsed = { suggestions: [], advice: text };
    }

    const enriched = parsed.suggestions.map((s) => {
      const practice = practices.find((p) => p.id === s.id);
      return { ...s, practice };
    }).filter((s) => s.practice);

    return NextResponse.json({ suggestions: enriched, advice: parsed.advice });

  } catch (err) {
    console.error("[ai-search] Anthropic API error:", err);
    const message = err instanceof Error ? err.message : "不明なエラー";
    return NextResponse.json(
      { error: `AI提案に失敗しました: ${message}` },
      { status: 500 }
    );
  }
}
