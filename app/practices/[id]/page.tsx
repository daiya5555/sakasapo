"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import YouTubeEmbed from "@/components/YouTubeEmbed";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null };
}

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
  authorId: string;
  author: { id: string; name: string | null };
  likes: { id: string; userId: string }[];
  comments: Comment[];
  _count: { likes: number };
  createdAt: string;
}

const difficultyLabels: Record<string, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

export default function PracticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [practice, setPractice] = useState<Practice | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [commenting, setCommenting] = useState(false);

  const userId = (session?.user as { id?: string })?.id;

  useEffect(() => {
    fetch(`/api/practices/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setPractice(data);
        setLikeCount(data._count?.likes ?? 0);
        if (userId) setLiked(data.likes?.some((l: { userId: string }) => l.userId === userId));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id, userId]);

  const handleLike = async () => {
    if (!session) { router.push("/auth"); return; }
    const res = await fetch(`/api/practices/${params.id}/like`, { method: "POST" });
    const data = await res.json();
    setLiked(data.liked);
    setLikeCount((c) => data.liked ? c + 1 : c - 1);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { router.push("/auth"); return; }
    if (!comment.trim()) return;
    setCommenting(true);
    const res = await fetch(`/api/practices/${params.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment }),
    });
    if (res.ok) {
      const newComment = await res.json();
      setPractice((p) => p ? { ...p, comments: [newComment, ...p.comments] } : p);
      setComment("");
    }
    setCommenting(false);
  };

  const handleDelete = async () => {
    if (!confirm("このメニューを削除しますか？")) return;
    await fetch(`/api/practices/${params.id}`, { method: "DELETE" });
    router.push("/practices");
  };

  if (loading) return (
    <div className="text-center py-20 text-gray-400">
      <div className="text-4xl animate-spin inline-block">⚽</div>
    </div>
  );

  if (!practice) return (
    <div className="text-center py-20">
      <p className="text-gray-500">練習メニューが見つかりません</p>
      <Link href="/practices" className="text-green-600 hover:underline mt-2 block">一覧に戻る</Link>
    </div>
  );

  const skills = (() => {
    try { return JSON.parse(practice.skills); } catch { return [practice.skills]; }
  })();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/practices" className="text-wine-600 hover:underline text-sm mb-6 inline-block">
        ← 練習メニュー一覧へ
      </Link>

      <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{practice.title}</h1>
          <span className="bg-gold-100 text-gold-600 text-sm px-3 py-1 rounded-full font-medium shrink-0 border border-gold-200">
            {difficultyLabels[practice.difficulty] ?? practice.difficulty}
          </span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 border-b pb-4">
          <span>👥 {practice.participants}人〜</span>
          <span>⏱ {practice.duration}分</span>
          <span>🎯 {practice.ageGroup}</span>
          <span className="ml-auto">投稿者: {practice.author.name ?? "匿名"}</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Array.isArray(skills) && skills.map((skill: string) => (
            <span key={skill} className="bg-gold-50 text-gold-600 text-sm px-3 py-1 rounded-full border border-gold-200">
              {skill}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="text-gray-700 whitespace-pre-wrap mb-6 leading-relaxed">
          {practice.description}
        </div>

        {/* 自撮り動画 */}
        {practice.videoUrl && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">🎥 練習動画</h3>
            <video
              src={practice.videoUrl}
              controls
              className="w-full rounded-xl bg-black max-h-80"
              preload="metadata"
            />
          </div>
        )}

        {/* YouTube */}
        {practice.youtubeUrl && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">🎬 参考動画（YouTube）</h3>
            <YouTubeEmbed url={practice.youtubeUrl} />
            <a
              href={practice.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-600 hover:underline mt-2 inline-block"
            >
              YouTubeで見る →
            </a>
          </div>
        )}

        {/* Like */}
        <div className="flex items-center gap-4 border-t pt-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
              liked
                ? "bg-red-100 text-red-600 border border-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {liked ? "❤️" : "🤍"} {likeCount} いいね
          </button>

          {userId === practice.authorId && (
            <button
              onClick={handleDelete}
              className="ml-auto text-sm text-red-500 hover:text-red-700"
            >
              削除
            </button>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="font-bold text-gray-800 text-lg mb-4">💬 コメント ({practice.comments.length})</h2>

        {session ? (
          <form onSubmit={handleComment} className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="コメントを書く..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 mb-2 resize-none"
            />
            <button
              type="submit"
              disabled={commenting || !comment.trim()}
              className="bg-wine-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-wine-700 transition disabled:opacity-50"
            >
              {commenting ? "送信中..." : "コメントする"}
            </button>
          </form>
        ) : (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
            <Link href="/auth" className="text-wine-600 hover:underline">ログイン</Link>するとコメントできます
          </div>
        )}

        <div className="space-y-4">
          {practice.comments.map((c) => (
            <div key={c.id} className="border-b pb-4 last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-gray-800">{c.user.name ?? "匿名"}</span>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
              <p className="text-sm text-gray-700">{c.content}</p>
            </div>
          ))}
          {practice.comments.length === 0 && (
            <p className="text-gray-400 text-sm">まだコメントはありません</p>
          )}
        </div>
      </div>
    </div>
  );
}
