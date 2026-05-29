"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import PracticeCard from "@/components/PracticeCard";

interface Practice {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  ageGroup: string;
  participants: number;
  duration: number;
  skills: string;
  youtubeUrl?: string | null;
  videoUrl?: string | null;
  author: { id: string; name: string | null };
  _count: { likes: number; comments: number };
  createdAt: string;
}

const SKILL_CATEGORIES = [
  { label: "ボールテクニック", skills: ["ドリブル", "トラップ", "リフティング", "ファーストタッチ"] },
  { label: "シュート・パス",   skills: ["シュート", "パス", "フェイント"] },
  { label: "フィジカル",       skills: ["体幹", "スピード", "持久力", "ヘディング"] },
  { label: "戦術・その他",     skills: ["ディフェンス", "ゴールキーパー", "判断力"] },
];
const ALL_SKILLS = SKILL_CATEGORIES.flatMap(c => c.skills);

const DIFFICULTIES = [
  { value: "", label: "すべて" },
  { value: "beginner",     label: "初級" },
  { value: "intermediate", label: "中級" },
  { value: "advanced",     label: "上級" },
];

const AGE_GROUPS = [
  { value: "", label: "すべて" },
  { value: "幼児",       label: "幼児" },
  { value: "小学低学年", label: "小学低学年" },
  { value: "小学高学年", label: "小学高学年" },
  { value: "中学生以上", label: "中学生以上" },
];

const SORT_OPTIONS = [
  { value: "newest",  label: "新着順" },
  { value: "popular", label: "人気順" },
];

function PracticesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [practices, setPractices]         = useState<Practice[]>([]);
  const [loading, setLoading]             = useState(true);
  const [q, setQ]                         = useState(searchParams.get("q") ?? "");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    searchParams.get("skills") ? searchParams.get("skills")!.split(",") : []
  );
  const [difficulty, setDifficulty]       = useState(searchParams.get("difficulty") ?? "");
  const [ageGroup, setAgeGroup]           = useState(searchParams.get("ageGroup") ?? "");
  const [sort, setSort]                   = useState(searchParams.get("sort") ?? "newest");
  const [inputValue, setInputValue]       = useState(searchParams.get("q") ?? "");

  const fetchPractices = useCallback(() => {
    const params = new URLSearchParams();
    if (q)                      params.set("q", q);
    if (selectedSkills.length)  params.set("skills", selectedSkills.join(","));
    if (difficulty)             params.set("difficulty", difficulty);
    if (ageGroup)               params.set("ageGroup", ageGroup);
    if (sort !== "newest")      params.set("sort", sort);

    setLoading(true);
    fetch(`/api/practices?${params.toString()}`)
      .then(r => r.json())
      .then(data => { setPractices(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [q, selectedSkills, difficulty, ageGroup, sort]);

  useEffect(() => { fetchPractices(); }, [fetchPractices]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(inputValue);
  };

  const clearAll = () => {
    setQ(""); setInputValue(""); setSelectedSkills([]);
    setDifficulty(""); setAgeGroup(""); setSort("newest");
  };

  const hasFilter = q || selectedSkills.length > 0 || difficulty || ageGroup || sort !== "newest";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">練習メニューを探す</h1>
        {hasFilter && (
          <button onClick={clearAll} className="text-sm text-wine-600 hover:underline">
            ✕ フィルターをリセット
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 space-y-5">

        {/* キーワード検索 */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="メニュー名・説明文を検索..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
          <button
            type="submit"
            className="bg-wine-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-wine-700 transition"
          >
            検索
          </button>
        </form>

        {/* スキルカテゴリー */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">
            スキルで絞り込む
          </p>
          <div className="space-y-2">
            {SKILL_CATEGORIES.map(cat => (
              <div key={cat.label} className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-gray-400 w-24 shrink-0">{cat.label}</span>
                {cat.skills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition border ${
                      selectedSkills.includes(skill)
                        ? "bg-wine-600 text-white border-wine-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-wine-400 hover:text-wine-600"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            ))}
          </div>
          {selectedSkills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selectedSkills.map(s => (
                <span key={s} className="flex items-center gap-1 bg-wine-50 text-wine-700 text-xs px-2 py-1 rounded-full border border-wine-200">
                  {s}
                  <button onClick={() => toggleSkill(s)} className="hover:text-red-600 ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 難易度・年齢・並び順 */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">難易度</span>
            <div className="flex gap-1">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                    difficulty === d.value
                      ? "bg-gold-400 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">対象年齢</span>
            <div className="flex gap-1">
              {AGE_GROUPS.map(a => (
                <button
                  key={a.value}
                  onClick={() => setAgeGroup(a.value)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                    ageGroup === a.value
                      ? "bg-gold-400 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-semibold text-gray-500">並び順</span>
            <div className="flex gap-1">
              {SORT_OPTIONS.map(s => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                    sort === s.value
                      ? "bg-[#1a1a1a] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 件数表示 */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          {hasFilter
            ? <><span className="font-semibold text-[#1a1a1a]">{practices.length}件</span> ヒット</>
            : <><span className="font-semibold text-[#1a1a1a]">{practices.length}件</span> の練習メニュー</>
          }
        </p>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3 animate-spin inline-block">⚽</div>
          <p>読み込み中...</p>
        </div>
      ) : practices.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium">条件に合う練習メニューが見つかりませんでした</p>
          <button onClick={clearAll} className="mt-3 text-sm text-wine-600 hover:underline">
            フィルターをリセットする
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {practices.map(p => <PracticeCard key={p.id} practice={p} />)}
        </div>
      )}
    </div>
  );
}

export default function PracticesPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-16 text-gray-400">
        <div className="text-4xl animate-spin inline-block">⚽</div>
      </div>
    }>
      <PracticesContent />
    </Suspense>
  );
}
