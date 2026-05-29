import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "サカサポ",
  description: "親子でできる少人数サッカー練習メニューの投稿・検索サービス",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-[#1a1a1a] text-white text-center py-6 text-sm mt-8">
            <div className="flex justify-center gap-6 mb-2">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">プライバシーポリシー</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">利用規約</Link>
            </div>
            <p className="text-gray-500">© 2025 サカサポ</p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
