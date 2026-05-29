import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
const ALLOWED_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm", "video/mpeg"];
const ALLOWED_EXTENSIONS = [".mp4", ".mov", ".avi", ".webm", ".mpeg", ".mpg"];

export async function POST(req: NextRequest) {
  // Vercel環境ではファイルシステムへの永続保存が不可
  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: "動画アップロードはローカル環境のみ対応しています。本番環境ではYouTube URLをご利用ください。" },
      { status: 501 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("video") as File | null;

  if (!file) {
    return NextResponse.json({ error: "ファイルがありません" }, { status: 400 });
  }

  // ファイルサイズチェック
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "ファイルサイズは200MB以下にしてください" }, { status: 400 });
  }

  // ファイル形式チェック
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: "MP4、MOV、AVI、WebM形式の動画ファイルを選択してください" },
      { status: 400 }
    );
  }

  // アップロードディレクトリを確認
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // ユニークなファイル名を生成
  const safeExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : ".mp4";
  const fileName = `${randomUUID()}${safeExt}`;
  const filePath = path.join(uploadDir, fileName);

  // ファイルを保存
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  const url = `/uploads/${fileName}`;
  return NextResponse.json({ url }, { status: 201 });
}
