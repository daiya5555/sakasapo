import Link from "next/link";

export const metadata = {
  title: "利用規約 | サカサポ",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-wine-600 hover:underline text-sm mb-6 inline-block">
        ← トップへ戻る
      </Link>

      <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">利用規約</h1>
      <p className="text-sm text-gray-400 mb-10">最終更新日：2025年6月1日</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">第1条（本規約への同意）</h2>
          <p>
            本利用規約（以下「本規約」）は、サカサポ（以下「本サービス」）の利用条件を定めるものです。
            ユーザーは本規約に同意した上で本サービスを利用するものとし、利用を開始した時点で同意したとみなします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">第2条（サービス内容）</h2>
          <p>
            本サービスは、親子でできるサッカーの練習メニューを投稿・共有・検索できるウェブサービスです。
            ユーザーは練習メニューの閲覧・投稿・コメント・いいねなどの機能を利用できます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">第3条（アカウント）</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>本サービスへの登録にはGoogleアカウントが必要です。</li>
            <li>アカウントの管理はユーザー自身の責任で行うものとします。</li>
            <li>1人のユーザーが複数アカウントを作成することはできません。</li>
            <li>アカウントの譲渡・売買・貸し借りは禁止します。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">第4条（投稿コンテンツ）</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>投稿した練習メニュー・コメント・動画等のコンテンツの著作権はユーザーに帰属します。</li>
            <li>ユーザーは本サービスに対して、投稿コンテンツを表示・配信するための非独占的なライセンスを許諾するものとします。</li>
            <li>他者の著作権・肖像権・プライバシーを侵害するコンテンツの投稿は禁止します。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">第5条（禁止事項）</h2>
          <p className="mb-3">ユーザーは以下の行為を行ってはなりません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>法令または本規約に違反する行為</li>
            <li>他のユーザーや第三者を誹謗・中傷・差別する行為</li>
            <li>虚偽の情報を投稿する行為</li>
            <li>スパム・宣伝・勧誘目的の投稿</li>
            <li>有害なプログラムや不正アクセスを試みる行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>未成年者に有害なコンテンツの投稿</li>
            <li>その他、運営が不適切と判断した行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">第6条（安全への注意）</h2>
          <p>
            本サービスに掲載される練習メニューを実施する際は、体調・場所・道具の安全を十分に確認してください。
            練習中の怪我・事故について、本サービスは一切の責任を負いません。
            特に幼児・子どもが参加する練習は、必ず保護者が同伴・監督のもとで行ってください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">第7条（免責事項）</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>本サービスに掲載されるコンテンツの正確性・完全性について保証しません。</li>
            <li>本サービスの利用によって生じた損害について、運営は責任を負いません。</li>
            <li>システム障害・メンテナンス等によるサービス停止についても同様です。</li>
            <li>外部リンク（YouTube等）の内容について責任を負いません。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">第8条（サービスの変更・終了）</h2>
          <p>
            運営は事前の通知なくサービスの内容を変更・追加・終了することができます。
            これによりユーザーに損害が生じても、運営は責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">第9条（利用規約の変更）</h2>
          <p>
            運営は必要に応じて本規約を変更することができます。
            変更後もサービスを継続して利用した場合、変更後の規約に同意したものとみなします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">第10条（準拠法・管轄裁判所）</h2>
          <p>
            本規約は日本法を準拠法とし、本サービスに関する紛争は日本の裁判所を専属的合意管轄とします。
          </p>
        </section>

      </div>
    </div>
  );
}
