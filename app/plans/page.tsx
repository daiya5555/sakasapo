"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const PLANS = [
  {
    id: "free",
    name: "無料プラン",
    price: "¥0",
    period: "/月",
    icon: "⚽",
    color: "border-gray-200",
    headerColor: "bg-gray-50",
    buttonColor: "bg-gray-200 text-gray-600 cursor-default",
    popular: false,
    features: [
      { label: "練習メニュー投稿", value: "月10件まで", ok: true },
      { label: "動画アップロード", value: "1GBまで", ok: true },
      { label: "いいね・コメント", value: "無制限", ok: true },
      { label: "メニュー検索・閲覧", value: "無制限", ok: true },
      { label: "投稿数無制限", value: "－", ok: false },
      { label: "大容量動画保存", value: "－", ok: false },
      { label: "コーチ向け管理機能", value: "－", ok: false },
      { label: "チーム管理", value: "－", ok: false },
    ],
    description: "個人の練習記録・共有に最適なプランです。まずは無料でサカサポを体験してください。",
  },
  {
    id: "standard",
    name: "スタンダード",
    price: "¥500",
    period: "/月",
    icon: "🏆",
    color: "border-wine-600",
    headerColor: "bg-wine-600",
    buttonColor: "bg-wine-600 text-white hover:bg-wine-700",
    popular: true,
    features: [
      { label: "練習メニュー投稿", value: "無制限", ok: true },
      { label: "動画アップロード", value: "5GBまで", ok: true },
      { label: "いいね・コメント", value: "無制限", ok: true },
      { label: "メニュー検索・閲覧", value: "無制限", ok: true },
      { label: "投稿数無制限", value: "✓", ok: true },
      { label: "大容量動画保存", value: "5GB", ok: true },
      { label: "コーチ向け管理機能", value: "－", ok: false },
      { label: "チーム管理", value: "－", ok: false },
    ],
    description: "たくさん練習メニューを投稿したい方・動画をフル活用したい方におすすめのプランです。",
  },
  {
    id: "coach",
    name: "コーチプラン",
    price: "¥1,500",
    period: "/月",
    icon: "👨‍🏫",
    color: "border-gold-400",
    headerColor: "bg-[#1a1a1a]",
    buttonColor: "bg-[#1a1a1a] text-white hover:bg-gray-800",
    popular: false,
    features: [
      { label: "練習メニュー投稿", value: "無制限", ok: true },
      { label: "動画アップロード", value: "20GBまで", ok: true },
      { label: "いいね・コメント", value: "無制限", ok: true },
      { label: "メニュー検索・閲覧", value: "無制限", ok: true },
      { label: "投稿数無制限", value: "✓", ok: true },
      { label: "大容量動画保存", value: "20GB", ok: true },
      { label: "コーチ向け管理機能", value: "✓", ok: true },
      { label: "チーム管理", value: "✓（近日公開）", ok: true },
    ],
    description: "チームの指導者・コーチ向けプランです。大容量の動画保存と管理機能でチーム指導をサポートします。",
  },
];

export default function PlansPage() {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleApply = (plan: typeof PLANS[0]) => {
    setSelectedPlan(plan);
    setShowForm(true);
    setDone(false);
    setError("");
    setForm({
      name: (session?.user?.name ?? ""),
      email: (session?.user?.email ?? ""),
      message: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) { setError("名前とメールアドレスを入力してください"); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/plan-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan?.id, planName: selectedPlan?.name, ...form }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("送信に失敗しました。しばらくしてから再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-3">プランを選ぶ</h1>
        <p className="text-gray-500">サカサポをもっと活用したい方へ。あなたに合ったプランをお選びください。</p>
      </div>

      {/* プランカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border-2 ${plan.color} shadow-sm overflow-hidden flex flex-col relative`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-400 text-white text-xs font-bold px-4 py-1 rounded-full z-10">
                人気No.1
              </div>
            )}

            {/* ヘッダー */}
            <div className={`${plan.headerColor} px-6 py-5 ${plan.popular ? "text-white" : "text-[#1a1a1a]"}`}>
              <div className="text-3xl mb-2">{plan.icon}</div>
              <div className="font-bold text-lg">{plan.name}</div>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className={`text-sm ${plan.popular ? "opacity-70" : "text-gray-400"}`}>{plan.period}</span>
              </div>
            </div>

            {/* 説明 */}
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-sm text-gray-500">{plan.description}</p>
            </div>

            {/* 機能一覧 */}
            <div className="px-6 py-4 flex-1">
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-center justify-between text-sm">
                    <span className={f.ok ? "text-gray-700" : "text-gray-300"}>{f.label}</span>
                    <span className={`font-medium ${f.ok ? "text-wine-600" : "text-gray-300"}`}>{f.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ボタン */}
            <div className="px-6 pb-6">
              {plan.id === "free" ? (
                <Link
                  href="/practices"
                  className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  無料ではじめる
                </Link>
              ) : (
                <button
                  onClick={() => handleApply(plan)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${plan.buttonColor}`}
                >
                  このプランに申し込む
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-bold text-lg text-[#1a1a1a] mb-4">よくある質問</h2>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-800 mb-1">Q. いつでも解約できますか？</p>
            <p>はい、いつでも解約できます。解約後は次の請求日から無料プランに切り替わります。</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Q. 支払い方法は？</p>
            <p>クレジットカード（Visa・Mastercard・JCB）に対応予定です。</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Q. 無料プランから途中でアップグレードできますか？</p>
            <p>はい、いつでもアップグレード可能です。差額は日割り計算で調整されます。</p>
          </div>
        </div>
      </div>

      {/* 申し込みモーダル */}
      {showForm && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            {done ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">申し込みを受け付けました！</h3>
                <p className="text-gray-500 text-sm mb-6">
                  ご登録のメールアドレスに確認メールをお送りします。<br />
                  担当者より2〜3営業日以内にご連絡いたします。
                </p>
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-wine-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-wine-700 transition"
                >
                  閉じる
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-[#1a1a1a]">
                    {selectedPlan.name}に申し込む
                  </h3>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-5 flex items-center gap-3">
                  <span className="text-2xl">{selectedPlan.icon}</span>
                  <div>
                    <div className="font-bold text-[#1a1a1a]">{selectedPlan.name}</div>
                    <div className="text-wine-600 font-bold">{selectedPlan.price}<span className="text-gray-400 text-xs font-normal">{selectedPlan.period}</span></div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">お名前 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="山田 太郎"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-wine-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="example@email.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-wine-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">備考（任意）</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="ご質問・ご要望があればお書きください"
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-wine-400 resize-none"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <p className="text-xs text-gray-400">
                    ※ 現在、有料プランは申し込み受付中です。お申し込み後、担当者よりご連絡いたします。
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-wine-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-wine-700 transition disabled:opacity-50"
                  >
                    {submitting ? "送信中..." : "申し込みを送信する"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
