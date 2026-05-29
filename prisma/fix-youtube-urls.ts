import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 検証後の修正済みURLマッピング
// 動画タイトルを確認済み（YouTubeページから取得）
const corrections: Record<string, { url: string; videoTitle: string; reason: string }> = {
  // ✗ 完全にズレ → 修正
  "ダブルタッチドリブル練習": {
    url: "https://www.youtube.com/watch?v=-j_p8kD2EkI",
    videoTitle: "サッカー初心者でも使える!!簡単で抜けるダブルタッチフェイント５つ教えます！",
    reason: "ダブルタッチ専門動画に変更",
  },
  // ✗ 壁パスと同じURL（重複） → 別の動画に変更
  "対面インサイドパス＆シュート": {
    url: "https://www.youtube.com/watch?v=t40NUtfJn-Y",
    videoTitle: "今のうちにやっておきたいパス＆トラップ練習法５選！",
    reason: "パス＆トラップ専門動画に変更（重複解消）",
  },
  // △ 汎用ドリブルになっていた → マーカー専門動画に変更
  "マーカーを使ったラダードリブル": {
    url: "https://www.youtube.com/watch?v=4ayqXc0p0pk",
    videoTitle: "【サッカー ドリブル】マーカーを使ったドリブル練習 初心者にもオススメ！",
    reason: "マーカーを使ったドリブル練習の専門動画に変更",
  },
  // △ 幼児ではなく小学生向けだった → 幼児専門動画に変更
  "幼児向けボールタッチ遊び": {
    url: "https://www.youtube.com/watch?v=I8Pc85F40ys",
    videoTitle: "【幼児サッカー】幼児向けボールタッチ５選【サッカー練習】",
    reason: "幼児専門のボールタッチ動画に変更",
  },
  // △ ヘディング専門ではなかった → ヘディング専門に変更
  "ヘディング基礎練習": {
    url: "https://www.youtube.com/watch?v=ryLQZvkErmY",
    videoTitle: "ヘディングが強くなりたい小学生達のヘディング練習",
    reason: "ヘディング練習専門動画に変更",
  },
  // △ ターン要素が不明瞭 → ターン専門動画に変更
  "ターンドリブル＆シュート": {
    url: "https://www.youtube.com/watch?v=9uCb2GSTWCg",
    videoTitle: "ターンとスペースの理解をテーマに取り組むトレーニング【ジュニアサッカー練習メニュー】",
    reason: "ターン専門のトレーニング動画に変更",
  },
};

async function main() {
  console.log("YouTube URLを修正中...\n");

  for (const [title, { url, videoTitle, reason }] of Object.entries(corrections)) {
    const result = await prisma.practice.updateMany({
      where: { title },
      data: { youtubeUrl: url },
    });

    if (result.count > 0) {
      console.log(`✓ ${title}`);
      console.log(`  → ${videoTitle}`);
      console.log(`  理由: ${reason}\n`);
    } else {
      console.log(`スキップ（見つからず）: ${title}\n`);
    }
  }

  // 修正後の全件確認
  const all = await prisma.practice.findMany({
    select: { title: true, youtubeUrl: true },
    orderBy: { createdAt: "asc" },
  });

  console.log("=== 全件のYouTube URL確認 ===");
  for (const p of all) {
    const status = p.youtubeUrl ? "✓ あり" : "✗ なし";
    console.log(`${status} | ${p.title}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
