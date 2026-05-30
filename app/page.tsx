"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const QUICK_SKILLS = ["ドリブル", "パス", "シュート", "トラップ", "リフティング", "フェイント", "ディフェンス", "体幹"];

export default function HomePage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim())              params.set("q", q.trim());
    if (selectedSkills.length) params.set("skills", selectedSkills.join(","));
    router.push(`/practices?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">

      {/* Hero */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">⚽</div>
        <h1 className="text-4xl font-bold text-[#1a1a1a] mb-3">サカサポ</h1>
        <p className="text-base text-gray-600 max-w-xl mx-auto">
          親子でできる少人数サッカー練習メニューを投稿・共有・発見しよう
        </p>
      </div>

      {/* 検索ボックス */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="メニュー名・説明文で検索..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            <button
              type="submit"
              className="bg-wine-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-wine-700 transition whitespace-nowrap"
            >
              検索
            </button>
          </div>

          {/* クイックスキル選択 */}
          <div>
            <p className="text-xs text-gray-400 mb-2">スキルで絞り込む（複数選択可）</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SKILLS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                    selectedSkills.includes(skill)
                      ? "bg-wine-600 text-white border-wine-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-wine-400 hover:text-wine-600"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {(q || selectedSkills.length > 0) && (
            <p className="text-xs text-gray-400">
              {[q && `「${q}」`, selectedSkills.length > 0 && `スキル: ${selectedSkills.join("・")}`]
                .filter(Boolean).join("　")} で検索します
            </p>
          )}
        </form>
      </div>

      {/* CTAリンク */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <Link
          href="/practices"
          className="bg-wine-600 text-white rounded-xl p-5 text-center hover:bg-wine-700 transition"
        >
          <div className="text-3xl mb-2">📋</div>
          <div className="font-bold">練習メニュー一覧</div>
          <div className="text-xs opacity-80 mt-1">すべてのメニューを見る</div>
        </Link>
        <Link
          href="/practices/new"
          className="bg-white border-2 border-wine-600 text-wine-600 rounded-xl p-5 text-center hover:bg-wine-50 transition"
        >
          <div className="text-3xl mb-2">✏️</div>
          <div className="font-bold">練習メニューを投稿</div>
          <div className="text-xs opacity-70 mt-1">あなたの練習を共有する</div>
        </Link>
      </div>

      {/* 有料プラン */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-center text-[#1a1a1a] mb-4">プランを選ぶ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 無料 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col">
            <div className="text-center mb-4">
              <div className="text-2xl mb-1">⚽</div>
              <div className="font-bold text-lg">無料プラン</div>
              <div className="text-2xl font-bold mt-1">¥0<span className="text-sm font-normal text-gray-400">/月</span></div>
            </div>
            <ul className="text-sm text-gray-600 space-y-2 flex-1">
              <li>✅ 練習メニュー投稿（月10件）</li>
              <li>✅ 動画アップロード（1GBまで）</li>
              <li>✅ いいね・コメント</li>
              <li className="text-gray-300">❌ 投稿無制限</li>
            </ul>
            <Link href="/plans" className="mt-4 block text-center text-sm text-gray-500 hover:text-wine-600 underline">詳しく見る</Link>
          </div>
          {/* スタンダード */}
          <div className="bg-wine-600 text-white rounded-xl border border-wine-600 p-5 shadow-md relative flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-400 text-white text-xs font-bold px-3 py-1 rounded-full">人気</div>
            <div className="text-center mb-4">
              <div className="text-2xl mb-1">🏆</div>
              <div className="font-bold text-lg">スタンダード</div>
              <div className="text-2xl font-bold mt-1">¥500<span className="text-sm font-normal opacity-70">/月</span></div>
            </div>
            <ul className="text-sm space-y-2 flex-1">
              <li>✅ 練習メニュー投稿（無制限）</li>
              <li>✅ 動画アップロード（5GBまで）</li>
              <li>✅ いいね・コメント</li>
              <li>✅ 優先サポート</li>
            </ul>
            <Link href="/plans" className="mt-4 block text-center text-sm text-white/80 hover:text-white underline">詳しく見る・申し込む</Link>
          </div>
          {/* コーチ */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col">
            <div className="text-center mb-4">
              <div className="text-2xl mb-1">👨‍🏫</div>
              <div className="font-bold text-lg">コーチプラン</div>
              <div className="text-2xl font-bold mt-1">¥1,500<span className="text-sm font-normal text-gray-400">/月</span></div>
            </div>
            <ul className="text-sm text-gray-600 space-y-2 flex-1">
              <li>✅ 練習メニュー投稿（無制限）</li>
              <li>✅ 動画アップロード（20GBまで）</li>
              <li>✅ いいね・コメント</li>
              <li>✅ コーチ向け管理機能</li>
            </ul>
            <Link href="/plans" className="mt-4 block text-center text-sm text-gray-500 hover:text-wine-600 underline">詳しく見る・申し込む</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
