"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-wine-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80">
          <span className="text-2xl">⚽</span>
          <span>サカサポ</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/practices" className="hover:underline text-sm">
            練習メニュー一覧
          </Link>
          {session ? (
            <>
              <Link
                href="/practices/new"
                className="bg-gold-400 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-gold-500 transition"
              >
                + 投稿する
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm">{session.user?.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm hover:underline opacity-80"
                >
                  ログアウト
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/auth"
              className="bg-gold-400 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-gold-500 transition"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
