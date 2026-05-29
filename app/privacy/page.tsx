import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー | サカサポ",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-wine-600 hover:underline text-sm mb-6 inline-block">
        ← トップへ戻る
      </Link>

      <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">プライバシーポリシー</h1>
      <p className="text-sm text-gray-400 mb-10">最終更新日：2025年6月1日</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">1. はじめに</h2>
          <p>
            サカサポ（以下「本サービス」）は、ユーザーの個人情報の取り扱いについて、
            個人情報の保護に関する法律（個人情報保護法）を遵守し、本プライバシーポリシーに従って適切に管理します。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">2. 収集する情報</h2>
          <p className="mb-3">本サービスでは、以下の情報を収集します。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-medium">Googleアカウント情報：</span>お名前、メールアドレス、プロフィール画像URL（Googleログイン時に取得）</li>
            <li><span className="font-medium">投稿コンテンツ：</span>練習メニューのタイトル・説明・動画・画像等、ユーザーが投稿した情報</li>
            <li><span className="font-medium">利用情報：</span>いいね・コメント・投稿日時等の行動履歴</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">3. 利用目的</h2>
          <p className="mb-3">収集した情報は以下の目的に使用します。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>ユーザー認証・アカウント管理</li>
            <li>練習メニューの投稿・表示・検索機能の提供</li>
            <li>サービスの改善・分析</li>
            <li>不正利用の検知・防止</li>
            <li>重要なお知らせの送信</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">4. 第三者への提供</h2>
          <p className="mb-3">
            本サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>ユーザー本人の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命・身体・財産の保護のために必要な場合</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">5. 利用する外部サービス</h2>
          <p className="mb-3">本サービスは以下の外部サービスを利用しています。各サービスのプライバシーポリシーもご確認ください。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium">Google OAuth：</span>
              ログイン認証に使用。
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-wine-600 hover:underline ml-1">Googleプライバシーポリシー</a>
            </li>
            <li>
              <span className="font-medium">YouTube：</span>
              練習動画の参照に使用。
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-wine-600 hover:underline ml-1">YouTubeプライバシーポリシー</a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">6. Cookieの利用</h2>
          <p>
            本サービスはログイン状態の維持のためにCookieを使用します。
            ブラウザの設定によりCookieを無効にすることができますが、その場合一部機能が利用できなくなります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">7. 個人情報の管理・保管</h2>
          <p>
            収集した個人情報は、適切なアクセス制御・暗号化等のセキュリティ対策を講じたサーバーで管理します。
            不正アクセス・紛失・改ざん・漏洩の防止に努めますが、完全な安全性を保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">8. 開示・訂正・削除の請求</h2>
          <p>
            ユーザーは自身の個人情報の開示・訂正・削除を請求できます。
            アカウントの削除は、ログイン後の設定画面から行うか、下記お問い合わせ先までご連絡ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">9. プライバシーポリシーの変更</h2>
          <p>
            本ポリシーは必要に応じて改定することがあります。
            重要な変更がある場合はサービス内でお知らせします。
            継続してサービスを利用された場合、改定後のポリシーに同意したものとみなします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">10. お問い合わせ</h2>
          <p>
            個人情報の取り扱いに関するお問い合わせは、サービス内のお問い合わせフォームよりご連絡ください。
          </p>
        </section>

      </div>
    </div>
  );
}
