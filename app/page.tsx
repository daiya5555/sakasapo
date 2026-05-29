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

      {/* 特徴 */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: "👨‍👧", title: "親子で楽しく", desc: "2人からできる練習メニューが充実" },
          { icon: "🎬", title: "動画で確認",   desc: "YouTube動画付きの分かりやすい解説" },
          { icon: "🔍", title: "かんたん検索", desc: "スキル・難易度・年齢で絞り込める" },
        ].map(f => (
          <div key={f.title} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:border-gold-200 transition">
            <div className="text-3xl mb-2">{f.icon}</div>
            <div className="font-semibold text-sm text-[#1a1a1a] mb-1">{f.title}</div>
            <div className="text-xs text-gray-500">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
