"use client";

import { useMemo, useState } from "react";
import type { Candidate } from "@/lib/types";
import { getAgent } from "@/lib/mock/seed";
import { Card } from "@/components/ui/Card";

type Props = { initial: Candidate[] };

export function AgentCandidatesClient({ initial: mine }: Props) {
  const [q, setQ] = useState("");

  const stats = useMemo(() => {
    const legalOk = mine.filter((c) => c.legalOk).length;
    return {
      total: mine.length,
      legalOk,
      needDoc: mine.length - legalOk,
    };
  }, [mine]);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return mine;
    return mine.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        String(c.jlpt).toLowerCase().includes(s) ||
        String(c.cqiScore).includes(s),
    );
  }, [mine, q]);

  return (
    <div className="w-full min-w-0 space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card
          className="border-l-4 border-l-[var(--app-primary)]"
          padding="p-4"
        >
          <p className="text-xs font-medium text-[var(--app-text-muted)]">Ứng viên quản lý</p>
          <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
            {stats.total}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--app-text-subtle)]">Kho nội bộ (theo dữ liệu mẫu)</p>
        </Card>
        <Card padding="p-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Pháp lý OK (bước 1)</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-800 dark:text-emerald-200">
            {stats.legalOk}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">Hoàn tất rà soát hồ sơ cơ bản</p>
        </Card>
        <Card padding="p-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Cần bổ sung tài liệu</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-amber-800 dark:text-amber-200">
            {stats.needDoc}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">Theo dõi và cập nhật</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0" padding="p-0">
        <div className="border-b border-[var(--app-border)] bg-zinc-50/80 px-4 py-3 dark:bg-zinc-900/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Danh sách ứng viên</h2>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                JLPT, pháp lý và điểm CQI tổng hợp
              </p>
            </div>
            <div className="flex w-full max-w-sm shrink-0 flex-col gap-1 sm:max-w-xs">
              <label className="sr-only" htmlFor="candidates-search">
                Tìm theo tên, JLPT hoặc CQI
              </label>
              <input
                id="candidates-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm theo tên, JLPT, CQI…"
                className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-elevated)] px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-offset-2 ring-offset-[var(--app-surface)] placeholder:text-zinc-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-100"
              />
            </div>
          </div>
        </div>

        <div
          className="overflow-x-auto [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-slate-50/90 dark:[&_tbody_tr:hover]:bg-zinc-800/50"
          role="region"
          aria-label="Bảng ứng viên"
        >
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-zinc-200/90 bg-zinc-50/90 text-xs font-medium text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-900/50">
              <tr>
                <th className="p-3 pl-4">Tên</th>
                <th className="p-3">JLPT</th>
                <th className="p-3">Pháp lý</th>
                <th className="p-3 pr-4 text-right">CQI</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm text-zinc-500">
                    {mine.length === 0
                      ? "Chưa có ứng viên trong kho."
                      : "Không tìm thấy ứng viên phù hợp. Thử từ khóa khác."}
                  </td>
                </tr>
              ) : (
                rows.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60"
                  >
                    <td className="p-3 pl-4">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{c.name}</span>
                      <p className="text-xs text-zinc-500">
                        {getAgent(c.agentId)?.name ?? "—"}
                      </p>
                    </td>
                    <td className="p-3 tabular-nums text-zinc-800 dark:text-zinc-200">{c.jlpt}</td>
                    <td className="p-3 text-sm">
                      {c.legalOk ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                          Đủ bước 1
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
                          Cần bổ sung
                        </span>
                      )}
                    </td>
                    <td className="p-3 pr-4 text-right tabular-nums font-medium text-zinc-800 dark:text-zinc-200">
                      {c.cqiScore}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {rows.length > 0 && (
          <p className="border-t border-[var(--app-border)] px-4 py-2 text-center text-xs text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-500">
            Hiển thị {rows.length} / {mine.length} mục
          </p>
        )}
      </Card>
    </div>
  );
}
