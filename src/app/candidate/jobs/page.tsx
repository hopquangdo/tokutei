import { Suspense } from "react";
import { jobs } from "@/lib/mock/seed";
import { JobsPageClient } from "./JobsPageClient";

function JobsPageFallback() {
  return (
    <div
      className="animate-pulse rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] p-6 text-sm text-zinc-500 dark:border-zinc-800/80"
      role="status"
    >
      一覧を読み込み中…
    </div>
  );
}

export default function JobsPage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <Suspense fallback={<JobsPageFallback />}>
        <JobsPageClient initialJobs={jobs} />
      </Suspense>
    </div>
  );
}
