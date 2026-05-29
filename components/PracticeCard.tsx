"use client";

import Link from "next/link";

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

const difficultyColors: Record<string, string> = {
  beginner: "bg-gold-100 text-gold-600",
  intermediate: "bg-wine-100 text-wine-700",
  advanced: "bg-wine-600 text-white",
};

const difficultyLabels: Record<string, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

export default function PracticeCard({ practice }: { practice: Practice }) {
  const skills = (() => {
    try { return JSON.parse(practice.skills); } catch { return [practice.skills]; }
  })();

  return (
    <Link href={`/practices/${practice.id}`}>
      <div className="bg-white rounded-xl shadow hover:shadow-md transition p-5 border border-gray-100 h-full flex flex-col hover:border-gold-200">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-[#1a1a1a] text-lg leading-snug">{practice.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${difficultyColors[practice.difficulty] ?? "bg-gray-100 text-gray-700"}`}>
            {difficultyLabels[practice.difficulty] ?? practice.difficulty}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">{practice.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {Array.isArray(skills) && skills.slice(0, 4).map((skill: string) => (
            <span key={skill} className="bg-gold-50 text-gold-600 text-xs px-2 py-0.5 rounded-full border border-gold-200">
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-3">
          <span>👥 {practice.participants}人〜</span>
          <span>⏱ {practice.duration}分</span>
          <span>🎯 {practice.ageGroup}</span>
          {(practice.youtubeUrl || practice.videoUrl) && <span>🎬 動画あり</span>}
          <div className="ml-auto flex gap-3">
            <span>❤️ {practice._count.likes}</span>
            <span>💬 {practice._count.comments}</span>
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-400">
          投稿者: {practice.author.name ?? "匿名"}
        </div>
      </div>
    </Link>
  );
}
