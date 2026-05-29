import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const practice = await prisma.practice.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      likes: true,
      comments: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { likes: true } },
    },
  });

  if (!practice) {
    return NextResponse.json({ error: "練習メニューが見つかりません" }, { status: 404 });
  }

  return NextResponse.json(practice);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const { id } = await params;
  const userId = (session.user as { id?: string }).id;
  const practice = await prisma.practice.findUnique({ where: { id } });

  if (!practice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (practice.authorId !== userId) return NextResponse.json({ error: "権限がありません" }, { status: 403 });

  await prisma.practice.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
