import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// WebSearch で収集したYouTube動画URLのマッピング
const youtubeMap: Record<string, string> = {
  "コーンジグザグドリブル":
    "https://www.youtube.com/watch?v=_U-WHhJ-Cv8",
  "壁を使ったインサイドパス練習":
    "https://www.youtube.com/watch?v=5q_WdW8Wzlw",
  "ワンバウンドリフティング（初心者向け）":
    "https://www.youtube.com/watch?v=09iwZKgdGgc",
  "対面インサイドパス＆シュート":
    "https://www.youtube.com/watch?v=5q_WdW8Wzlw",
  "コーンゲート通しドリブル":
    "https://www.youtube.com/watch?v=MBbwabEF35w",
  "リフティング連続チャレンジ":
    "https://www.youtube.com/watch?v=be8WmdV5oFI",
  "マーカーを使ったラダードリブル":
    "https://www.youtube.com/watch?v=V3YAd_UpeDw",
  "1対1ドリブル突破練習":
    "https://www.youtube.com/watch?v=UE13NYiZRgI",
  "インステップシュート強化":
    "https://www.youtube.com/watch?v=OerLvjicowc",
  "ダブルタッチドリブル練習":
    "https://www.youtube.com/watch?v=ntRjt0U7Las",
  "2人でできるリフティングパス":
    "https://www.youtube.com/watch?v=3H0uYtCcX0g",
  "幼児向けボールタッチ遊び":
    "https://www.youtube.com/watch?v=i6r-iZYL6yY",
  "鬼ごっこドリブル":
    "https://www.youtube.com/watch?v=J9QNQkQfAm0",
  "ターンドリブル＆シュート":
    "https://www.youtube.com/watch?v=1JoClvV2CAw",
  "ヘディング基礎練習":
    "https://www.youtube.com/watch?v=mQIJcNx4CHA",
};

async function main() {
  console.log("YouTube URLを更新中...");
  let updated = 0;

  for (const [title, url] of Object.entries(youtubeMap)) {
    const result = await prisma.practice.updateMany({
      where: { title },
      data: { youtubeUrl: url },
    });
    if (result.count > 0) {
      console.log(`✓ ${title}`);
      updated++;
    } else {
      console.log(`スキップ（見つからず）: ${title}`);
    }
  }

  console.log(`\n完了！${updated}件にYouTube URLを追加しました。`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
