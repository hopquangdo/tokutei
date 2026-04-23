import { applications } from "@/lib/mock/seed";
import { ApplicationsClient } from "./ApplicationsClient";

export default function AgentApplications() {
  const total = applications.length;
  const open = applications.filter((a) => !a.closed).length;
  const closed = total - open;

  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">応募と紹介（登録支援機関）</h1>
      <div className="mb-5 rounded-2xl border border-(--app-border) bg-(--app-surface-elevated) p-4 shadow-(--app-shadow-sm) dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              登録支援機関オペレーション
            </p>
            <p className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
              応募と紹介の管理
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              応募元・対応中・終了件を1画面で把握します。
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-200">
            ライブ
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
            合計: <strong className="tabular-nums">{total}</strong>
          </span>
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-200">
            対応中: <strong className="tabular-nums">{open}</strong>
          </span>
          <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300">
            終了: <strong className="tabular-nums">{closed}</strong>
          </span>
        </div>
      </div>

      <ApplicationsClient />
    </div>
  );
}
