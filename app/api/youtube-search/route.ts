import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// YouTube Data API v3 を使った検索
async function searchYouTube(query: string): Promise<string | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "3");
  url.searchParams.set("relevanceLanguage", "ja");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const data = await res.json();
  const videoId = data.items?.[0]?.id?.videoId;
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
}

// YouTube API キーがない場合はClaudeに適切な検索クエリを生成してもらう
async function generateSearchQuery(title: string, skills: string[]): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 200,
    system: "あなたはサッカー指導の専門家です。練習メニューの名前とスキルを受け取り、YouTube検索に最適な日本語クエリを1行で出力してください。クエリのみ出力し、説明は不要です。",
    messages: [
      {
        role: "user",
        content: `練習名: ${title}\nスキル: ${skills.join(", ")}`,
      },
    ],
  });
  const text = message.content[0].type === "text" ? message.content[0].text.trim() : title;
  return text;
}

export async function POST(req: NextRequest) {
  const { title, skills } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "タイトルが必要です" }, { status: 400 });
  }

  try {
    const skillArray = Array.isArray(skills) ? skills : [];

    // 1. まずYouTube Data APIを試す
    let youtubeUrl: string | null = null;
    const baseQuery = `サッカー 練習 ${title} 小学生`;
    youtubeUrl = await searchYouTube(baseQuery);

    // 2. YouTube APIがない場合 → AIに検索クエリを生成してもらい、それをURLとして案内
    if (!youtubeUrl) {
      const aiQuery = await generateSearchQuery(title, skillArray);
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(aiQuery)}`;
      return NextResponse.json({
        url: null,
        searchUrl,
        query: aiQuery,
        mode: "search_url",
        message: "YouTube API キーが設定されていないため、検索URLを生成しました",
      });
    }

    return NextResponse.json({ url: youtubeUrl, mode: "youtube_api" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "検索に失敗しました" }, { status: 500 });
  }
}
