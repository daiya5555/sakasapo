import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
          <footer className="bg-[#1a1a1a] text-white text-center py-4 text-sm mt-8">
            © 2025 サカサポ
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
