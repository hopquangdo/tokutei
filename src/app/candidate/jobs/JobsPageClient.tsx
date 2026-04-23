"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Job } from "@/lib/types";
import { getAgent } from "@/lib/mock/seed";

/** Mô tả bổ sung theo từng job — bổ sung trên dữ liệu gốc. */
const JOB_EXTRAS: Record<
  string,
  {
    workSummary: string;
    requirements: string[];
    updatedAt: string;
    publishedAt: string;
  }
> = {
  j1: {
    workSummary:
      "Làm việc tại công trường, lắp dựng cốt thép theo hướng dẫn, tuân thủ an toàn. Ca ngày / có ca đêm.",
    requirements: [
      "JLPT N4 trở lên",
      "Tư cách 特定技能1号 — ngành 建設",
      "Chịu khó, có kinh nghiệm xây dựng được ưu tiên.",
    ],
    updatedAt: "18/04/2026",
    publishedAt: "10/04/2026",
  },
  j2: {
    workSummary:
      "Sản xuất thực phẩm theo dây chuyền, kiểm tra chất lượng, vệ sinh công tác. Môi trường nhà máy lạnh.",
    requirements: [
      "JLPT N5 trở lên (giao tiếp cơ bản)",
      "Sức khỏe tốt, đứng làm nhiều giờ",
    ],
    updatedAt: "20/04/2026",
    publishedAt: "12/04/2026",
  },
  j3: {
    workSummary:
      "Chăm sóc người cao tuổi tại 有料老人ホーム, hỗ trợ sinh hoạt, theo dõi sức khỏe, ghi chép theo quy trình.",
    requirements: [
      "JLPT N3 trở lên",
      "Có định hướng 介護 — ưu tiên có chứng chỉ",
    ],
    updatedAt: "21/04/2026",
    publishedAt: "15/04/2026",
  },
};

const defaultExtra = (j: Job) => ({
  workSummary: `Nội dung công việc theo ngành ${j.industry} tại khu vực ${j.city} (mô tả mẫu).`,
  requirements: [
    `JLPT: ${j.requiredJlpt} trở lên`,
    "Hợp pháp tư cách lưu trú (ứng viên tự rà soát).",
  ],
  updatedAt: "22/04/2026",
  publishedAt: "01/04/2026",
});

const LOCATIONS = ["Tất cả", "Tokyo", "Saitama", "Chiba", "Kanagawa"] as const;
const INDUSTRIES = ["Tất cả", "建設", "食料品製造", "介護", "外食", "その他"] as const;

type JobsPageClientProps = {
  initialJobs: Job[];
};

export function JobsPageClient({ initialJobs }: JobsPageClientProps) {
  const searchParams = useSearchParams();
  const jobIdFromQuery = searchParams.get("jobId");
  const [focusFlashId, setFocusFlashId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState<(typeof LOCATIONS)[number]>("Tất cả");
  const [industry, setIndustry] = useState<(typeof INDUSTRIES)[number]>("Tất cả");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [noExp, setNoExp] = useState(false);
  const [newGrad, setNewGrad] = useState(false);
  const [remote, setRemote] = useState(false);

  const filtered = useMemo(() => {
    return initialJobs.filter((j) => {
      const kw = keyword.trim().toLowerCase();
      if (kw) {
        const blob = `${j.title} ${j.industry} ${j.city} ${j.salary}`.toLowerCase();
        if (!blob.includes(kw)) return false;
      }
      if (location !== "Tất cả" && j.city !== location) return false;
      if (industry !== "Tất cả" && j.industry !== industry) return false;
      if (newGrad && j.requiredJlpt !== "N5") return false;
      if (noExp) {
        if (!["N5", "N4"].includes(j.requiredJlpt)) return false;
      }
      if (remote && j.industry === "建設") return false;
      return true;
    });
  }, [initialJobs, keyword, location, industry, noExp, newGrad, remote]);

  /** Từ /candidate/applications? → mở đúng tin (scroll + highlight ngắn). */
  useEffect(() => {
    if (!jobIdFromQuery) {
      setFocusFlashId(null);
      return;
    }
    const visible = filtered.some((j) => j.id === jobIdFromQuery);
    if (!visible) {
      setFocusFlashId(null);
      return;
    }
    setFocusFlashId(jobIdFromQuery);
    const scrollT = window.setTimeout(() => {
      document
        .getElementById(`job-${jobIdFromQuery}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    const clearFlash = window.setTimeout(() => setFocusFlashId(null), 3500);
    return () => {
      clearTimeout(scrollT);
      clearTimeout(clearFlash);
    };
  }, [jobIdFromQuery, filtered]);

  const resetFilters = useCallback(() => {
    setKeyword("");
    setLocation("Tất cả");
    setIndustry("Tất cả");
    setSalaryFrom("");
    setSalaryTo("");
    setNoExp(false);
    setNewGrad(false);
    setRemote(false);
  }, []);

  const selectShell =
    "app-input w-full py-2 text-sm text-zinc-900 dark:text-zinc-100";

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-6 lg:grid-cols-[17rem_1fr] lg:items-start xl:grid-cols-[19rem_1fr]">
      {/* Cột trái: bộ lọc — sticky trên desktop */}
      <aside className="min-w-0 lg:sticky lg:top-4 lg:max-h-[min(calc(100dvh-5rem),52rem)] lg:overflow-y-auto lg:self-start">
        <div
          className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] p-4 shadow-[var(--app-shadow-sm)] dark:border-zinc-800/80 dark:bg-zinc-900/50"
        >
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Bộ lọc</h2>
          <div className="mt-3 space-y-3">
            <div>
              <label className="app-label" htmlFor="job-kw">
                Từ khóa
              </label>
              <input
                id="job-kw"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="app-input"
                placeholder="職種, 会社, 勤務地…"
              />
            </div>
            <div>
              <label className="app-label" htmlFor="job-loc">
                Khu vực
              </label>
              <select
                id="job-loc"
                value={location}
                onChange={(e) => setLocation(e.target.value as (typeof LOCATIONS)[number])}
                className={selectShell}
              >
                {LOCATIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="app-label" htmlFor="job-ind">
                Ngành nghề
              </label>
              <select
                id="job-ind"
                value={industry}
                onChange={(e) => setIndustry(e.target.value as (typeof INDUSTRIES)[number])}
                className={selectShell}
              >
                {INDUSTRIES.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="app-label">Mức lương (円/月)</span>
              <div className="mt-1 flex items-center gap-2">
                <input
                  value={salaryFrom}
                  onChange={(e) => setSalaryFrom(e.target.value)}
                  className="app-input min-w-0 flex-1"
                  inputMode="numeric"
                  placeholder="Từ"
                />
                <span className="text-zinc-400">—</span>
                <input
                  value={salaryTo}
                  onChange={(e) => setSalaryTo(e.target.value)}
                  className="app-input min-w-0 flex-1"
                  inputMode="numeric"
                  placeholder="Đến"
                />
              </div>
            </div>
            <div className="space-y-2 border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Điều kiện nhanh</p>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
                <input
                  type="checkbox"
                  checked={noExp}
                  onChange={(e) => setNoExp(e.target.checked)}
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500/30"
                />
                Ưu tiên JLPT thấp
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
                <input
                  type="checkbox"
                  checked={newGrad}
                  onChange={(e) => setNewGrad(e.target.checked)}
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500/30"
                />
                Chỉ N5
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
                <input
                  type="checkbox"
                  checked={remote}
                  onChange={(e) => setRemote(e.target.checked)}
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500/30"
                />
                Loại trừ công trường 建設 (gợi ý môi trường nhẹ hơn)
              </label>
            </div>
            <div className="flex flex-col gap-2 border-t border-zinc-100 pt-3 sm:flex-row sm:items-center dark:border-zinc-800/80">
              <button type="button" onClick={resetFilters} className="text-left text-sm text-zinc-500 underline-offset-2 hover:text-[var(--app-primary)] hover:underline">
                Xóa điều kiện
              </button>
              <p className="text-xs text-zinc-500 sm:ml-auto">
                Hiển thị <strong className="text-zinc-800 dark:text-zinc-200">{filtered.length}</strong> / {initialJobs.length} tin
              </p>
            </div>
            <button type="button" className="app-btn app-btn-primary w-full" onClick={() => {}}>
              Tìm kiếm
            </button>
          </div>
        </div>
      </aside>

      {/* Cột phải: thanh công cụ + danh sách */}
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-zinc-400" aria-hidden>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--app-border)] bg-zinc-50/80 text-xs dark:border-zinc-700 dark:bg-zinc-800/50" title="Lịch sử xem tin">
              ◷
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--app-border)] bg-zinc-50/80 text-xs dark:border-zinc-700 dark:bg-zinc-800/50" title="Đã lưu">
              ♡
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-blue-600 dark:border-zinc-600 dark:bg-zinc-800/80" title="Dạng danh sách">
              ☰
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-zinc-500">
            <span className="text-xs">Trang</span>
            <span className="inline-flex min-w-[1.75rem] items-center justify-center rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:border-blue-500/30 dark:bg-blue-950/50 dark:text-blue-200">
              1
            </span>
          </div>
        </div>

        <ul className="space-y-4">
          {filtered.map((j) => {
            const owner = getAgent(j.ownerAgentId);
            const extra = JOB_EXTRAS[j.id] ?? defaultExtra(j);
            return (
              <li id={`job-${j.id}`} key={j.id} className="scroll-mt-4">
                <article
                  className={
                    "overflow-hidden rounded-2xl border bg-[var(--app-surface-elevated)] shadow-[var(--app-shadow-card)] dark:border-zinc-800/80 dark:bg-zinc-900/50 " +
                    (focusFlashId === j.id
                      ? "border-sky-500 ring-2 ring-sky-400/50 ring-offset-2 ring-offset-[var(--app-surface)] dark:ring-sky-500/50 dark:ring-offset-zinc-950"
                      : "border-[var(--app-border)]")
                  }
                >
                  <div className="border-b border-zinc-100/90 px-4 py-3 dark:border-zinc-800/80">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span className="font-mono text-zinc-600 dark:text-zinc-400">ID: {j.id.toUpperCase()}</span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200">
                        JobShare Selection
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-base font-semibold leading-snug text-[var(--app-primary)]">
                      <Link href={`/candidate/jobs/${j.id}`} className="hover:underline">
                        {j.title}
                      </Link>
                    </h3>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-zinc-500">
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">{j.industry}</span>
                      <span>·</span>
                      <span>🏢 {owner?.name ?? "—"}</span>
                    </p>
                  </div>

                  <div className="grid gap-4 p-4 lg:grid-cols-[1fr_13rem] lg:gap-5">
                    <div className="min-w-0 space-y-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Nội dung công việc</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                          {extra.workSummary}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Điều kiện ứng tuyển</p>
                        <ul className="mt-1.5 list-inside list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                          {extra.requirements.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-zinc-500">
                        <span>Cập nhật: {extra.updatedAt}</span>
                        <span>Đăng tải: {extra.publishedAt}</span>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col gap-3 border-t border-zinc-100 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 dark:border-zinc-800/80">
                      <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        <p>
                          <span className="text-zinc-400">Lương tháng</span> — {j.salary}
                        </p>
                        <p>
                          <span className="text-zinc-400">Làm việc tại</span> — {j.city}
                        </p>
                        <p>
                          <span className="text-zinc-400">JLPT</span> — {j.requiredJlpt}〜
                        </p>
                      </div>
                      <div className="mt-auto flex flex-col gap-2 sm:flex-row lg:flex-col">
                        <Link
                          href={`/candidate/jobs/${j.id}`}
                          className="app-btn app-btn-secondary w-full text-center text-sm"
                        >
                          Xem chi tiết
                        </Link>
                        <button
                          type="button"
                          className="app-btn app-btn-secondary w-full text-sm"
                          title="Lưu tin ưa thích"
                        >
                          ♡ Lưu
                        </button>
                        <button
                          type="button"
                          className="app-btn app-btn-primary w-full text-sm"
                          title="Tiến cử ứng viên"
                        >
                          Tiến cử ứng viên
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/30">
            Không có tin phù hợp. Thử xóa bộ lọc hoặc từ khóa khác.
          </p>
        )}
      </div>
    </div>
  );
}
