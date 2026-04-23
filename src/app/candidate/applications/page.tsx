"use client";

import { useEffect, useMemo, useState } from "react";
import { applications, getJob } from "@/lib/mock/seed";
import { PIPELINE_STAGE_LABEL_JA } from "@/lib/mock/platform-dashboard-data";
import type { Application, ApplicationClosedReason, PipelineStage } from "@/lib/types";
import { Card } from "@/components/ui/Card";

const PAGE_SIZE = 3;

const STEP_LABEL = PIPELINE_STAGE_LABEL_JA;

const CLOSED_LABEL: Record<ApplicationClosedReason, string> = {
  rejected: "不採用",
  withdrawn: "取り下げ",
};

/** Chuỗi bước theo từng ứng tuyển: trực tiếp bỏ bước nguồn; tiến cử có thêm bước nguồn. */
function stepsForApp(a: Application) {
  const base: PipelineStage[] = [
    "screening",
    "interview",
    "offer",
    "visa",
    "onboarded",
  ];
  const keys = a.source === "referral" ? (["sourced", ...base] as const) : base;
  return keys.map((stage) => ({ stage, label: STEP_LABEL[stage] }));
}

function currentStepIndex(
  a: Application,
  steps: ReturnType<typeof stepsForApp>,
) {
  const i = steps.findIndex((s) => s.stage === a.stage);
  if (i >= 0) return i;
  return 0;
}

function ApplicationProcessStepper({ application: a }: { application: Application }) {
  const steps = stepsForApp(a);
  const idx = currentStepIndex(a, steps);
  /** Hoàn tất: chỉ khi còn mở và đã tới bước cuối (không tính hồ sơ đã đóng). */
  const isSuccess = !a.closed && a.stage === "onboarded";

  if (isSuccess) {
    return (
      <div
        className="w-full min-w-0"
        role="list"
        aria-label="状態: 入社手続きまで完了"
      >
        <div className="flex w-full min-w-0 items-center sm:px-0">
          {steps.map((step, i) => (
            <div
              key={step.stage}
              role="listitem"
              className="flex min-w-0 flex-1 items-center last:flex-[0_0_auto]"
            >
              {i > 0 && (
                <div
                  className="h-0.5 min-w-0 flex-1 rounded-full bg-emerald-500 dark:bg-emerald-600"
                  aria-hidden
                />
              )}
              <div
                className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white shadow-sm tabular-nums dark:bg-emerald-500"
                title={step.label}
              >
                ✓
              </div>
              {i < steps.length - 1 && (
                <div
                  className="h-0.5 min-w-0 flex-1 rounded-full bg-emerald-500 dark:bg-emerald-600"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
        <p className="mt-2.5 text-center text-xs font-medium text-emerald-800 dark:text-emerald-200">
          全段階（入社手続き）を完了 — ここまでが追跡の最終です
        </p>
      </div>
    );
  }

  if (a.closed) {
    const failKind = a.closed;
    const failStepName = steps[idx]?.label ?? "—";
    return (
      <div
        className="w-full min-w-0"
        role="list"
        aria-label={`応募終了: ${CLOSED_LABEL[failKind]}（${failStepName}）`}
      >
        <p className="mb-2 text-center text-[11px] text-zinc-500 dark:text-zinc-500">
          <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
            <span>
              <span className="text-emerald-600 dark:text-emerald-400">✓</span> 通過
            </span>
            <span aria-hidden>
              ·
            </span>
            <span>
              {failKind === "rejected" ? (
                <>
                  <span className="text-rose-600 dark:text-rose-400">✕</span> 不採用
                </>
              ) : (
                <>
                  <span className="text-amber-600 dark:text-amber-400">⏷</span> 取下
                </>
              )}{" "}
              段階 <strong className="text-zinc-700 dark:text-zinc-200">{failStepName}</strong>
            </span>
            <span aria-hidden>
              ·
            </span>
            <span>
              残り: <span className="text-zinc-400">未到達</span>
            </span>
          </span>
        </p>
        <div className="flex w-full min-w-0 items-center sm:px-0">
          {steps.map((step, i) => {
            const isDone = i < idx;
            const isFailed = i === idx;
            return (
              <div
                key={step.stage}
                role="listitem"
                className="flex min-w-0 flex-1 items-center last:flex-[0_0_auto]"
                aria-current={isFailed ? "step" : undefined}
              >
                {i > 0 && (
                  <div
                    className={
                      "h-0.5 min-w-0 flex-1 rounded-full " +
                      (idx > i - 1
                        ? "bg-emerald-500 dark:bg-emerald-600"
                        : "bg-zinc-200 dark:bg-zinc-700")
                    }
                    aria-hidden
                  />
                )}
                <div
                  className={[
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-colors",
                    isDone && "bg-emerald-600 text-white shadow-sm dark:bg-emerald-500",
                    isFailed &&
                      failKind === "rejected" &&
                      "bg-rose-600 text-white ring-2 ring-rose-300 ring-offset-2 ring-offset-(--app-surface-elevated) dark:ring-rose-700 dark:ring-offset-zinc-900",
                    isFailed &&
                      failKind === "withdrawn" &&
                      "bg-amber-500 text-white ring-2 ring-amber-200 ring-offset-2 ring-offset-(--app-surface-elevated) dark:ring-amber-700 dark:ring-offset-zinc-900",
                    i > idx &&
                      "border border-dashed border-zinc-300 bg-zinc-50/80 text-zinc-400 dark:border-zinc-600 dark:bg-zinc-900/50 dark:text-zinc-500",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  title={
                    isFailed
                      ? failKind === "rejected"
                        ? `${step.label} — ここで不採用`
                        : `${step.label} — ここで取り下げ`
                      : isDone
                        ? `${step.label} — 完了`
                        : `${step.label} — 未到達`
                  }
                >
                  {isDone ? "✓" : isFailed ? (failKind === "withdrawn" ? "⏷" : "✕") : "·"}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={
                      "h-0.5 min-w-0 flex-1 rounded-full " +
                      (i < idx
                        ? "bg-emerald-500 dark:bg-emerald-600"
                        : i === idx
                          ? failKind === "withdrawn"
                            ? "bg-amber-200/90 dark:bg-amber-900/40"
                            : "bg-rose-200/90 dark:bg-rose-900/50"
                          : "bg-zinc-200 dark:bg-zinc-700")
                    }
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-2.5 flex w-full min-w-0 sm:px-0">
          {steps.map((step, i) => {
            const isFailed = i === idx;
            return (
              <div
                key={`${step.stage}-label`}
                className="min-w-0 flex-1 text-center last:max-w-none"
              >
                <p
                  className={
                    "line-clamp-2 px-0.5 text-[10px] leading-tight sm:text-xs " +
                    (isFailed
                      ? failKind === "rejected"
                        ? "font-semibold text-rose-800 dark:text-rose-200"
                        : "font-semibold text-amber-900 dark:text-amber-200"
                      : "text-zinc-500 dark:text-zinc-400")
                  }
                >
                  {step.label}
                </p>
                {isFailed && (
                  <p
                    className={
                      "mt-0.5 text-[9px] font-bold uppercase leading-none " +
                      (failKind === "rejected"
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-amber-700 dark:text-amber-300")
                    }
                  >
                    {failKind === "rejected" ? "不採用" : "取下"}
                  </p>
                )}
                {i > idx && !isFailed && (
                  <p className="mt-0.5 text-[9px] text-zinc-400 dark:text-zinc-600">
                    未到達
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <p
          className={
            "mt-2.5 text-center text-xs " +
            (failKind === "rejected"
              ? "text-rose-800 dark:text-rose-200/90"
              : "text-amber-900 dark:text-amber-100")
          }
        >
          <span className="block font-medium">終了段階: {failStepName}</span>
          <span className="mt-1 block text-[11px] font-normal opacity-90">
            {a.closedNote ?? (failKind === "rejected" ? "採用側の判断により" : "—")}
          </span>
        </p>
      </div>
    );
  }

  // Đang xử lý
  return (
    <div
      className="w-full min-w-0"
      role="list"
      aria-label="応募の進行状況"
    >
      <div className="flex w-full min-w-0 items-center sm:px-0">
        {steps.map((step, i) => {
          const isDone = i < idx;
          const isCurrent = i === idx;
          return (
            <div
              key={step.stage}
              role="listitem"
              className="flex min-w-0 flex-1 items-center last:flex-[0_0_auto]"
              aria-current={isCurrent ? "step" : undefined}
            >
              {i > 0 && (
                <div
                  className={
                    "h-0.5 min-w-0 flex-1 rounded-full transition-colors " +
                    (idx > i - 1
                      ? "bg-emerald-500 dark:bg-emerald-600"
                      : "bg-zinc-200 dark:bg-zinc-700")
                  }
                  aria-hidden
                />
              )}
              <div
                className={[
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-colors",
                  isDone && "bg-emerald-600 text-white shadow-sm dark:bg-emerald-500",
                  isCurrent &&
                    "bg-sky-100 text-sky-900 ring-2 ring-sky-500 ring-offset-2 ring-offset-(--app-surface-elevated) dark:bg-sky-950/60 dark:text-sky-100 dark:ring-sky-400 dark:ring-offset-zinc-900",
                  !isDone && !isCurrent && "border border-zinc-300 bg-zinc-50 text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400",
                ]
                  .filter(Boolean)
                  .join(" ")}
                title={
                  isDone
                    ? `${step.label} — 完了`
                    : isCurrent
                      ? `${step.label} — 対応中`
                      : `${step.label} — 未到達`
                }
              >
                {isDone ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={
                    "h-0.5 min-w-0 flex-1 rounded-full transition-colors " +
                    (idx > i
                      ? "bg-emerald-500 dark:bg-emerald-600"
                      : "bg-zinc-200 dark:bg-zinc-700")
                  }
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2.5 flex w-full min-w-0 sm:px-0">
        {steps.map((step, i) => {
          const isCurrent = i === idx;
          return (
            <div
              key={`${step.stage}-label`}
              className="min-w-0 flex-1 text-center last:max-w-none"
            >
              <p
                className={
                  "line-clamp-2 px-0.5 text-[10px] leading-tight sm:text-xs " +
                  (isCurrent
                    ? "font-semibold text-sky-800 dark:text-sky-200"
                    : "text-zinc-500 dark:text-zinc-400")
                }
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Đã đóng lên trước (để dễ thấy từ chối / rút trên thanh bước), sau đó mới theo ngày mới nhất. */
function sortAppsForDisplay(apps: Application[]) {
  return [...apps].sort((a, b) => {
    const rank = (x: Application) => (x.closed ? 0 : 1);
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    return b.createdAt.localeCompare(a.createdAt);
  });
}

function closedStyle(closed: ApplicationClosedReason | undefined) {
  if (closed === "rejected")
    return "bg-rose-500/10 text-rose-800 dark:text-rose-200";
  if (closed === "withdrawn")
    return "bg-amber-500/10 text-amber-900 dark:text-amber-100";
  return "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200";
}

export default function MyApplications() {
  const mine = useMemo(
    () =>
      sortAppsForDisplay(
        applications.filter((a) => a.candidateId === "c1"),
      ),
    [],
  );
  const total = mine.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const [page, setPage] = useState(1);
  const currentPage = Math.min(Math.max(1, page), totalPages);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, total);
  const pageItems = useMemo(
    () => mine.slice(pageStart, pageStart + PAGE_SIZE),
    [mine, pageStart],
  );

  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">応募と進捗</h1>
      {mine.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          応募はまだありません。
        </p>
      ) : (
        <>
          <p
            className="mb-4 text-sm text-zinc-500 dark:text-zinc-400"
            aria-live="polite"
          >
            {pageStart + 1}–{pageEnd} / {total} 件を表示
          </p>
          <ul className="space-y-4 sm:space-y-5">
            {pageItems.map((a) => {
              const j = getJob(a.jobId);
              if (!j) return null;
              const steps = stepsForApp(a);
              const pos = currentStepIndex(a, steps) + 1;
              return (
                <li key={a.id}>
                  <Card
                    className={
                      a.closed
                        ? a.closed === "rejected"
                          ? "border-l-4 border-l-rose-500/90"
                          : "border-l-4 border-l-amber-500/90"
                        : undefined
                    }
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
                            {j.title}
                          </h2>
                          {a.stage === "onboarded" && !a.closed && (
                            <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">
                              完了
                            </span>
                          )}
                          {a.closed && (
                            <span
                              className={
                                "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium " +
                                closedStyle(a.closed)
                              }
                            >
                              {CLOSED_LABEL[a.closed]}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>
                            {a.source === "direct" ? "直接応募" : "紹介"}
                          </span>
                          <span className="text-zinc-300 dark:text-zinc-600" aria-hidden>
                            ·
                          </span>
                          <span>
                            提出:{" "}
                            <time dateTime={a.createdAt}>
                              {new Date(a.createdAt + "T12:00:00").toLocaleDateString(
                                "ja-JP",
                              )}
                            </time>
                          </span>
                          <span className="text-zinc-300 dark:text-zinc-600" aria-hidden>
                            ·
                          </span>
                          <span>
                            {j.city} · {j.industry}
                          </span>
                        </p>
                      </div>
                      <p className="shrink-0 text-xs text-zinc-500 dark:text-zinc-500">
                        {a.closed
                          ? `終了段階: ${pos}/${steps.length}`
                          : `段階 ${pos}/${steps.length}`}
                      </p>
                    </div>
                    <div className="mt-4 border-t border-(--app-border) pt-4 dark:border-zinc-800/80">
                      <ApplicationProcessStepper application={a} />
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
          {totalPages > 1 && (
            <nav
              className="mt-6 flex flex-col items-stretch gap-3 border-t border-(--app-border) pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/80"
              aria-label="応募のページ送り"
            >
              <p className="text-center text-sm text-zinc-500 sm:text-left dark:text-zinc-400">
                {currentPage} / {totalPages} ページ
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="app-btn app-btn-secondary app-btn-sm min-w-28 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  前へ
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-primary app-btn-sm min-w-28 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  次へ
                </button>
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
