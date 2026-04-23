import Link from "next/link";
import type { Candidate, Job } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { getJobPostingDetail } from "@/lib/mock/job-posting-details";

type JobPostingDetailViewProps = {
  job: Job;
  ownerName: string;
  mode: "agent" | "candidate";
  backHref: string;
  backLabel: string;
  suggestedCandidates?: Candidate[];
  /** Cột nội dung chính (trái) dính viewport khi màn hình 2 cột; mobile vẫn xếp cột này lên trên. */
  stickyPrimaryPanel?: boolean;
};

export function JobPostingDetailView({
  job,
  ownerName,
  mode,
  backHref,
  backLabel,
  suggestedCandidates = [],
  stickyPrimaryPanel = false,
}: JobPostingDetailViewProps) {
  const detail = getJobPostingDetail(job);

  return (
    <div className="app-page-body w-full min-w-0">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <section
          className={
            "order-1 min-w-0 space-y-4" +
            (stickyPrimaryPanel
              ? " xl:sticky xl:top-4 xl:self-start xl:max-h-[min(calc(100dvh-5rem),54rem)] xl:overflow-y-auto xl:pr-1"
              : "")
          }
        >
          <Card>
            <p className="text-sm text-zinc-500">
              <Link href={backHref} className="app-link">
                {backLabel}
              </Link>
            </p>
            <p className="mt-3 text-xs text-zinc-500">求人ID: {job.id.toUpperCase()}</p>
            <p className="mt-2 text-2xl font-semibold leading-snug text-app-primary">{job.title}</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              業種: {job.industry}
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">採用元: {ownerName}</p>
          </Card>

          <Card
            className={
              mode === "agent" ? "grid gap-3 md:grid-cols-2" : "grid gap-3 md:grid-cols-1"
            }
          >
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3 dark:border-zinc-800/80 dark:bg-zinc-900/40">
              <p className="text-xs uppercase tracking-wide text-zinc-500">クイック情報</p>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">月給: {job.salary}</p>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">JLPT: {job.requiredJlpt}</p>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">雇用形態: {detail.contractType}</p>
            </div>
            {mode === "agent" && (
              <div className="rounded-xl border border-red-200/80 bg-red-50/80 p-3 dark:border-red-500/30 dark:bg-red-950/30">
                <p className="text-xs uppercase tracking-wide text-red-700 dark:text-red-200">紹介手数料</p>
                <p className="mt-2 text-xl font-bold text-red-800 dark:text-red-100">{job.shareCommission}（年収ベース）</p>
                <p className="mt-1 text-xs text-red-700/90 dark:text-red-200/80">B2B紹介経路の応募に適用されます。</p>
              </div>
            )}
          </Card>

          <Card>
            <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800/80">
              <p className="text-xs text-zinc-500">
                更新: {detail.updatedAt} · 公開: {detail.publishedAt}
              </p>
            </div>
            <div className="space-y-4 pt-4">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">概要</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {detail.workSummary}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">応募条件</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
                  {detail.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">勤務地</h3>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{detail.workAddress}</p>
              </div>
            </div>
          </Card>
        </section>

        <aside className="order-2 min-w-0 space-y-3">
          <Card className="p-3" padding="p-3">
            {mode === "agent" ? (
              <div className="space-y-2">
                <button type="button" className="app-btn app-btn-primary w-full text-sm">
                  候補者を紹介
                </button>
                <button type="button" className="app-btn app-btn-secondary w-full text-sm">
                  URLをコピー
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button type="button" className="app-btn app-btn-primary w-full text-sm">
                  今すぐ応募
                </button>
                <button type="button" className="app-btn app-btn-secondary w-full text-sm">
                  保存
                </button>
                <button type="button" className="app-btn app-btn-secondary w-full text-sm">
                  JDを取得
                </button>
              </div>
            )}
          </Card>

          {mode === "agent" && (
            <Card className="p-3" padding="p-3">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">おすすめ候補者（AI）</h3>
              <ul className="mt-3 space-y-2">
                {suggestedCandidates.slice(0, 4).map((c) => (
                  <li key={c.id} className="rounded-lg border border-zinc-200/80 p-2 dark:border-zinc-700/80">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{c.name}</p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">JLPT {c.jlpt} · CQI {c.cqiScore}</p>
                    <button type="button" className="mt-2 w-full rounded-md bg-amber-400 px-2 py-1 text-[11px] font-semibold text-zinc-900">
                      すぐ紹介
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
