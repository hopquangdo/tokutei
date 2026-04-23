"use client";

import { useMemo, useState } from "react";
import {
  applications,
  getAgent,
  getCandidate,
  getJob,
} from "@/lib/mock/seed";
import { PIPELINE_STAGE_LABEL_VI } from "@/lib/mock/platform-dashboard-data";
import type { PipelineStage } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { TableShell } from "@/components/ui/TableShell";

const tab: { id: "direct" | "referral"; label: string; desc: string }[] = [
  { id: "direct", label: "Ứng tuyển trực tiếp", desc: "Ứng viên nộp vào tin của bạn" },
  { id: "referral", label: "Tiến cử từ đối tác", desc: "Hồ sơ giới thiệu qua B2B" },
];

function stageVi(stage: string) {
  return PIPELINE_STAGE_LABEL_VI[stage as PipelineStage] ?? stage;
}

export function ApplicationsClient() {
  const [t, setT] = useState<"direct" | "referral">("direct");
  const [q, setQ] = useState("");

  const bySource = useMemo(
    () => applications.filter((a) => (t === "direct" ? a.source === "direct" : a.source === "referral")),
    [t],
  );

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return bySource;
    return bySource.filter((a) => {
      const j = getJob(a.jobId);
      const c = getCandidate(a.candidateId);
      if (!j || !c) return false;
      const agentName = a.fromAgentId
        ? (getAgent(a.fromAgentId)?.name ?? a.fromAgentId)
        : "";
      return (
        c.name.toLowerCase().includes(s) ||
        j.title.toLowerCase().includes(s) ||
        agentName.toLowerCase().includes(s) ||
        stageVi(a.stage).toLowerCase().includes(s)
      );
    });
  }, [bySource, q]);

  const stats = useMemo(() => {
    const open = bySource.filter((a) => !a.closed).length;
    const closed = bySource.filter((a) => a.closed).length;
    return { total: bySource.length, open, closed };
  }, [bySource]);

  return (
    <div className="w-full min-w-0 space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card
          className="border-l-4 border-l-[var(--app-primary)]"
          padding="p-4"
        >
          <p className="text-xs font-medium text-[var(--app-text-muted)]">Tổng theo nguồn</p>
          <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
            {stats.total}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--app-text-subtle)]">
            {t === "direct" ? "Ứng tuyển trực tiếp" : "Tiến cử từ đối tác"}
          </p>
        </Card>
        <Card padding="p-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Đang xử lý</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-200">
            {stats.open}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">Chưa từ chối / rút</p>
        </Card>
        <Card padding="p-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Đã đóng</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-500 dark:text-zinc-400">
            {stats.closed}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">Từ chối hoặc ứng viên rút</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0" padding="p-0">
        <div className="border-b border-[var(--app-border)] bg-zinc-50/80 dark:bg-zinc-900/50">
          <div className="px-4 py-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Gợi ý:</span> với nguồn tiến
              cử, chỉ hồ sơ đủ 在留 + 指定書 hợp lệ mới nên tiến cử.
            </p>
            <div
              className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
            >
              <div
                className="inline-flex w-full max-w-md gap-0.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-1 dark:border-zinc-700/80 dark:bg-zinc-900/40 sm:w-auto"
                role="tablist"
                aria-label="Nguồn ứng tuyển"
              >
                {tab.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    role="tab"
                    aria-selected={t === x.id}
                    onClick={() => {
                      setT(x.id);
                      setQ("");
                    }}
                    className={
                      t === x.id
                        ? "h-10 min-w-[12.5rem] flex-1 rounded-lg bg-[var(--app-primary)] px-4 py-1 text-left text-sm font-medium text-white shadow-sm sm:min-w-[13rem]"
                        : "h-10 min-w-[12.5rem] flex-1 rounded-lg px-4 py-1 text-left text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 sm:min-w-[13rem]"
                    }
                  >
                    <span className="block leading-tight">{x.label}</span>
                    <span
                      className={
                        t === x.id
                          ? "mt-0.5 block text-[10px] font-normal leading-tight text-white/90"
                          : "mt-0.5 block text-[10px] font-normal leading-tight text-zinc-500 dark:text-zinc-500"
                      }
                    >
                      {x.desc}
                    </span>
                  </button>
                ))}
              </div>
              <div className="w-full max-w-sm shrink-0 sm:max-w-xs">
                <label className="sr-only" htmlFor="applications-search">
                  Tìm ứng viên, job hoặc giai đoạn
                </label>
                <input
                  id="applications-search"
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm ứng viên, tên job, giai đoạn…"
                  className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-elevated)] px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-offset-2 ring-offset-[var(--app-surface)] placeholder:text-zinc-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-0">
          <TableShell>
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-zinc-200/90 bg-zinc-50/90 text-xs font-medium text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-900/50">
                <tr>
                  <th className="p-3 pl-4">Ứng viên</th>
                  <th className="p-3">Job</th>
                  {t === "referral" && <th className="p-3">Từ Agent</th>}
                  <th className="p-3 pr-4">Giai đoạn</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={t === "referral" ? 4 : 3}
                      className="p-8 text-center text-sm text-zinc-500"
                    >
                      {bySource.length === 0
                        ? "Không có bản ghi cho nguồn này."
                        : "Không có kết quả. Thử từ khóa khác."}
                    </td>
                  </tr>
                ) : (
                  rows.map((a) => {
                    const j = getJob(a.jobId);
                    const c = getCandidate(a.candidateId);
                    if (!j || !c) return null;
                    return (
                      <tr
                        key={a.id}
                        className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60"
                      >
                        <td className="p-3 pl-4">
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">{c.name}</span>
                          <p className="text-xs text-zinc-500">
                            {c.legalOk ? "OK pháp lý" : "Cần xử lý hồ sơ"}
                          </p>
                        </td>
                        <td className="max-w-[min(40vw,16rem)] p-3 text-xs leading-snug text-zinc-700 dark:text-zinc-300">
                          {j.title}
                        </td>
                        {t === "referral" && (
                          <td className="p-3 text-xs text-zinc-700 dark:text-zinc-300">
                            {a.fromAgentId
                              ? (getAgent(a.fromAgentId)?.name ?? a.fromAgentId)
                              : "—"}
                          </td>
                        )}
                        <td className="p-3 pr-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--app-primary-subtle)] px-2.5 py-0.5 text-xs font-medium text-blue-900 dark:text-blue-100">
                              {stageVi(a.stage)}
                            </span>
                            {a.closed && (
                              <span
                                className={
                                  "rounded-md px-1.5 py-0.5 text-[11px] font-medium " +
                                  (a.closed === "rejected"
                                    ? "bg-rose-500/10 text-rose-800 dark:text-rose-200"
                                    : "bg-amber-500/10 text-amber-800 dark:text-amber-200")
                                }
                              >
                                {a.closed === "rejected" ? "Từ chối" : "Rút hồ sơ"}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </TableShell>
        </div>
        {rows.length > 0 && (
          <p className="border-t border-[var(--app-border)] px-4 py-2 text-center text-xs text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-500">
            Hiển thị {rows.length} / {bySource.length} bản ghi{q.trim() ? " (sau lọc)" : ""}
          </p>
        )}
      </Card>
    </div>
  );
}
