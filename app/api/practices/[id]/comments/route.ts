import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const { id } = await params;
  const { content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "コメントを入力してください" }, { status: 400 });
  }

  const userId = (session.user as { id?: string }).id!;
  const comment = await prisma.comment.create({
    data: { content, userId, practiceId: id },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
}
