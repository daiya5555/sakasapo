import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { plan, planName, name, email, message } = await req.json();

    if (!plan || !name || !email) {
      return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
    }

    // DBに申し込み情報を保存
    await prisma.planInquiry.create({
      data: { plan, planName, name, email, message: message || "" },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
