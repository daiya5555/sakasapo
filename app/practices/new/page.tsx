"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UsageData {
  plan: string;
  planLabel: string;
  posts: { count: number; limit: number | null; remaining: number | null };
  aiSearches: { count: number; limit: number | null; remaining: number | null };
  videoUpload: boolean;
}

const SKILL_OPTIONS = [
  "ドリブル", "パス", "トラップ", "シュート", "ヘディング",
  "リフティング", "フェイント", "ディフェンス", "ゴールキーパー",
  "ファーストタッチ", "体幹", "スピード", "持久力", "判断力",
];

export default function NewPracticePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "beginner",
    ageGroup: "小学低学年",
    participants: 2,
    duration: 30,
    youtubeUrl: "",
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [youtubeSearching, setYoutubeSearching] = useState(false);
  const [youtubeResult, setYoutubeResult] = useState<{
    mode?: string;
    searchUrl?: string;
    query?: string;
    message?: string;
  } | null>(null);

  // 使用状況
  const [usage, setUsage] = useState<UsageData | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/usage").then(r => r.json()).then(setUsage).catch(() => {});
    }
  }, [status]);

  // 動画アップロード用
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (status === "loading") return null;
  if (!session) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <p className="text-gray-600 mb-4">練習メニューを投稿するにはログインが必要です</p>
        <Link href="/auth" className="bg-wine-600 text-white px-6 py-2 rounded-lg hover:bg-wine-700 transition">
          ログインする
        </Link>
      </div>
    );
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const s = customSkill.trim();
    if (s && !selectedSkills.includes(s)) {
      setSelectedSkills((prev) => [...prev, s]);
      setCustomSkill("");
    }
  };

  // 動画ファイル選択
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 200MB制限チェック（クライアント側）
    if (file.size > 200 * 1024 * 1024) {
      setError("ファイルサイズは200MB以下にしてください");
      return;
    }

    setVideoFile(file);
    setUploadProgress("idle");

    // プレビューURL生成
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
    setError("");
  };

  const removeVideo = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setUploadProgress("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // AI + YouTube自動検索
  const handleYoutubeSearch = async () => {
    if (!form.title.trim()) {
      setError("先にタイトルを入力してください");
      return;
    }
    setYoutubeSearching(true);
    setYoutubeResult(null);
    setError("");
    try {
      const res = await fetch("/api/youtube-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, skills: selectedSkills }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.mode === "youtube_api" && data.url) {
        setForm((f) => ({ ...f, youtubeUrl: data.url }));
        setYoutubeResult({ mode: "youtube_api" });
      } else if (data.mode === "search_url") {
        setYoutubeResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "YouTube検索に失敗しました");
    } finally {
      setYoutubeSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) { setError("スキルを1つ以上選んでください"); return; }

    setSubmitting(true);
    setError("");

    try {
      // 動画ファイルがある場合は先にアップロード
      let uploadedVideoUrl: string | null = null;
      if (videoFile) {
        setUploading(true);
        setUploadProgress("uploading");

        const fd = new FormData();
        fd.append("video", videoFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) throw new Error(uploadData.error ?? "動画のアップロードに失敗しました");
        uploadedVideoUrl = uploadData.url;
        setUploadProgress("done");
        setUploading(false);
      }

      // 練習メニューを投稿
      const res = await fetch("/api/practices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          skills: selectedSkills,
          videoUrl: uploadedVideoUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/practices/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setUploadProgress("error");
      setUploading(false);
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/practices" className="text-wine-600 hover:underline text-sm mb-6 inline-block">
        ← 練習メニュー一覧へ
      </Link>
      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">練習メニューを投稿</h1>

      {/* 使用状況バナー */}
      {usage && usage.posts.limit !== null && (
        <div className={`mb-5 px-4 py-3 rounded-xl text-sm flex items-center justify-between border ${
          usage.posts.remaining === 0
            ? "bg-red-50 border-red-200 text-red-700"
            : usage.posts.remaining !== null && usage.posts.remaining <= 3
            ? "bg-gold-50 border-gold-200 text-gold-600"
            : "bg-gray-50 border-gray-200 text-gray-600"
        }`}>
          <span>
            {usage.posts.remaining === 0
              ? "⛔ 今月の投稿上限に達しました"
              : `📋 今月の残り投稿数：${usage.posts.remaining} / ${usage.posts.limit} 件`}
          </span>
          {usage.posts.remaining !== null && usage.posts.remaining <= 3 && (
            <span className="text-xs font-medium opacity-75">有料プランで無制限に</span>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="例：コーンを使ったドリブル練習"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            練習内容・説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="練習の手順や注意点、コツなどを詳しく書きましょう"
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            対象スキル <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {SKILL_OPTIONS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  selectedSkills.includes(skill)
                    ? "bg-wine-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
              placeholder="その他のスキルを追加..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            <button
              type="button"
              onClick={addCustomSkill}
              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200"
            >
              追加
            </button>
          </div>
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedSkills.map((s) => (
                <span key={s} className="bg-gold-100 text-gold-600 text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-gold-200">
                  {s}
                  <button type="button" onClick={() => toggleSkill(s)} className="hover:text-red-600">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Difficulty & Age */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">難易度</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <option value="beginner">初級</option>
              <option value="intermediate">中級</option>
              <option value="advanced">上級</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">対象年齢</label>
            <select
              value={form.ageGroup}
              onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <option value="幼児">幼児</option>
              <option value="小学低学年">小学低学年</option>
              <option value="小学高学年">小学高学年</option>
              <option value="中学生以上">中学生以上</option>
            </select>
          </div>
        </div>

        {/* Participants & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">最低人数（人）</label>
            <input
              type="number"
              min={1}
              max={20}
              value={form.participants}
              onChange={(e) => setForm({ ...form, participants: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">所要時間（分）</label>
            <input
              type="number"
              min={5}
              max={120}
              step={5}
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
        </div>

        {/* 自撮り動画アップロード */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            練習動画をアップロード（任意）
          </label>
          <p className="text-xs text-gray-400 mb-3">MP4・MOV・AVI・WebM形式、200MBまで</p>

          {usage && !usage.videoUpload ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-500">🔒 動画アップロードは有料プランのみ</p>
                <p className="text-xs text-gray-400 mt-0.5">スタンダード・コーチプランで利用できます</p>
              </div>
            </div>
          ) : !videoFile ? (
            <label
              htmlFor="video-upload"
              className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl py-8 px-4 cursor-pointer hover:border-wine-400 hover:bg-wine-50 transition group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition">🎥</div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-wine-600">
                クリックして動画を選択
              </p>
              <p className="text-xs text-gray-400 mt-1">または動画ファイルをドラッグ＆ドロップ</p>
              <input
                id="video-upload"
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/x-msvideo,video/webm,.mp4,.mov,.avi,.webm"
                onChange={handleVideoChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              {/* 動画プレビュー */}
              {videoPreviewUrl && (
                <video
                  src={videoPreviewUrl}
                  controls
                  className="w-full max-h-64 bg-black"
                  preload="metadata"
                />
              )}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">🎬</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{videoFile.name}</p>
                    <p className="text-xs text-gray-400">{formatFileSize(videoFile.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {uploadProgress === "uploading" && (
                    <span className="text-xs text-wine-600 animate-pulse">アップロード中...</span>
                  )}
                  {uploadProgress === "done" && (
                    <span className="text-xs text-green-600">✓ 完了</span>
                  )}
                  <button
                    type="button"
                    onClick={removeVideo}
                    disabled={uploading}
                    className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40 px-2 py-1 rounded hover:bg-red-50"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* YouTube URL + AI自動取得 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              YouTube URL（任意）
            </label>
            <button
              type="button"
              onClick={handleYoutubeSearch}
              disabled={youtubeSearching || !form.title.trim()}
              className="flex items-center gap-1.5 bg-wine-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-wine-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {youtubeSearching ? (
                <>
                  <span className="animate-spin">⚽</span> 検索中...
                </>
              ) : (
                <>🎬 AI自動取得</>
              )}
            </button>
          </div>
          <input
            type="url"
            value={form.youtubeUrl}
            onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
          />

          {youtubeResult?.mode === "youtube_api" && (
            <p className="text-xs text-green-600 mt-1">✓ YouTube動画を自動取得しました</p>
          )}

          {youtubeResult?.mode === "search_url" && (
            <div className="mt-2 p-3 bg-gold-50 rounded-lg border border-gold-200 text-xs">
              <p className="text-gray-600 mb-1">
                💡 <span className="font-medium">AIが生成した検索クエリ：</span>「{youtubeResult.query}」
              </p>
              <a
                href={youtubeResult.searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wine-600 hover:underline font-medium"
              >
                → YouTubeで動画を検索する ↗
              </a>
              <p className="text-gray-400 mt-1">
                ※ YouTube Data APIキーを.envに設定すると自動でURLが入力されます
              </p>
            </div>
          )}

          {!youtubeResult && (
            <p className="text-xs text-gray-400 mt-1">
              URLを直接貼るか「AI自動取得」でYouTubeから関連動画を検索できます
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full bg-wine-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-wine-700 transition disabled:opacity-50"
        >
          {uploading ? "動画をアップロード中..." : submitting ? "投稿中..." : "練習メニューを投稿する"}
        </button>
      </form>
    </div>
  );
}
