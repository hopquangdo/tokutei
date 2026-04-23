import Link from "next/link";
import { Card } from "@/components/ui/Card";

const steps = [
  {
    title: "ステップ1 — 抽出（AI OCR）",
    body: `在留カード: 12桁、在留資格、有効期限、住所。指定書: 所属機関、分野、交付日。CV: 突合のための職歴（OCR画面の案内に従いファイルをアップロード）。`,
  },
  {
    title: "ステップ2 — 真正照会（アプリ連携）",
    body: `入管の公式アプリを自動起動し、在留番号と有効期限を照会。ロック／不存在の場合は即不許可。照会後、AI OCR画面に「有効」が反映されます。`,
  },
  {
    title: "ステップ3 — 突合（ロジック）",
    body: `求人与指定書の分野を照合（不一致は警告表示）。在籍・退職、顔写真の突合（なりすまし疑い） — 詳細は別紙(2)。`,
  },
  {
    title: "ステップ4 — 登録支援機関向け結果表",
    body: `在留の状態、職種分野、信頼度%、緑/赤の表示。デモは候補者 → AI OCR で確認。`,
  },
] as const;

export default function VerificationDocsPage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">法務オート検証フロー（約60秒）</h1>
      <p className="sr-only">
        Willtec Tokutei の手順書。アップロード: CV ＋ 在留 ＋ 指定書（4段階）。実施場所: 候補者
        → AI OCR。
      </p>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s.title} className="list-none">
            <Card className="border-l-4 border-l-blue-500/50">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {i + 1}. {s.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {s.body}
              </p>
            </Card>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm">
        <Link
          className="font-medium text-blue-700 hover:underline dark:text-blue-400"
          href="/"
        >
          ← トップへ
        </Link>
        {" "}
        <Link
          className="app-link"
          href="/login?next=%2Fcandidate%2Focr"
        >
          候補者 → AI OCR
        </Link>
      </p>
    </div>
  );
}
