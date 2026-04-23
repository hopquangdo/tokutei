import Link from "next/link";
import { Card } from "@/components/ui/Card";

const cards = [
  {
    href: "/login?next=%2Fcandidate",
    title: "候補者向けサイト",
    desc: "候補者向け：登録、AI OCR、CVビルダー、応募、登録支援機関とのメッセージ。",
  },
  {
    href: "/login?next=%2Fagent",
    title: "登録支援機関向けサイト",
    desc: "求人・候補者管理、パイプライン、B2Bマーケットプレイス、チャット、紹介。",
  },
] as const;

const roadmap = [
  "書類のデジタル化、在留・指定書のOCR、AI履歴書支援、特定技能向け社内求人検索。",
  "B2Bマーケットプレイス、候補者ハブ、登録支援機関間チャット、パイプラインと紹介の追跡。",
  "マーケティング・リード、JLPT / CQI・履歴書に基づくマッチング。",
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="app-page-shell w-full min-w-0 flex-1 py-10 sm:py-14">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] p-6 shadow-[var(--app-shadow-card)] sm:p-10 dark:border-zinc-800/80">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-90 blur-3xl"
            style={{ background: "color-mix(in srgb, var(--app-primary) 16%, transparent)" }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full opacity-60 blur-2xl"
            style={{ background: "color-mix(in srgb, var(--app-accent) 12%, transparent)" }}
            aria-hidden
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--app-primary)]">
            ウィルテック · 特定技能プラットフォーム
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            特定技能 採用プラットフォーム
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
            役割（候補者・登録支援機関）ごとに区分し、権限を明確に — 特定技能の応募・採用を一つの流れで。
          </p>
        </div>

        <ul className="mt-8 space-y-3 sm:mt-10">
          {roadmap.map((r) => (
            <li
              key={r}
              className="flex gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)]/80 px-4 py-3 text-sm text-[var(--app-text-muted)] shadow-[var(--app-shadow-sm)] dark:border-zinc-800/80 dark:bg-zinc-900/30"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--app-primary)" }}
              />
              <span className="leading-relaxed">{r}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="group block">
              <Card
                className="h-full transition group-hover:border-blue-200 group-hover:shadow-md dark:group-hover:border-blue-500/25"
                padding="p-4 sm:p-5"
              >
                <h2 className="text-base font-semibold text-zinc-900 group-hover:text-[var(--app-primary)] dark:text-zinc-50 dark:group-hover:text-blue-300">
                  {c.title}
                </h2>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--app-text-muted)]">
                  {c.desc}
                </p>
                <span className="mt-4 inline-flex items-center text-xs font-semibold text-[var(--app-primary)] group-hover:underline">
                  はじめる
                  <span className="ml-1" aria-hidden>
                    →
                  </span>
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
