"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Job } from "@/lib/types";
import { getAgent } from "@/lib/mock/seed";

/** 各求人の補足説明（シード上に重ねる） */
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
      "現場での鉄筋組立・据付を指示通りに行い、安全に配慮。日勤・夜勤の交代あり。",
    requirements: [
      "JLPT N4以上",
      "特定技能1号（建設）",
      "体力に自信があり建設経験者を優遇。",
    ],
    updatedAt: "18/04/2026",
    publishedAt: "10/04/2026",
  },
  j2: {
    workSummary:
      "食品ラインの製造、品質チェック、衛生管理。低温度の工場内作業。",
    requirements: [
      "JLPT N5以上（基礎的な会話）",
      "立ち仕事に耐えられる方",
    ],
    updatedAt: "20/04/2026",
    publishedAt: "12/04/2026",
  },
  j3: {
    workSummary:
      "有料老人ホームでの高齢者ケア、生活支援、健康観察、手順に沿った記録。",
    requirements: [
      "JLPT N3以上",
      "介護志向の方 — 資格保持者歓迎",
    ],
    updatedAt: "21/04/2026",
    publishedAt: "15/04/2026",
  },
};

const defaultExtra = (j: Job) => ({
  workSummary: `${j.industry}分野の業務（${j.city}エリア想定のサンプル）。`,
  requirements: [
    `JLPT: ${j.requiredJlpt} 以上`,
    "在留資格の適合はご自身でご確認ください。",
  ],
  updatedAt: "22/04/2026",
  publishedAt: "01/04/2026",
});

const LOCATIONS = ["すべて", "Tokyo", "Saitama", "Chiba", "Kanagawa"] as const;
const INDUSTRIES = ["すべて", "建設", "食料品製造", "介護", "外食", "その他"] as const;

type JobsPageClientProps = {
  initialJobs: Job[];
};

export function JobsPageClient({ initialJobs }: JobsPageClientProps) {
  const searchParams = useSearchParams();
  const jobIdFromQuery = searchParams.get("jobId");
  const [focusFlashId, setFocusFlashId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState<(typeof LOCATIONS)[number]>("すべて");
  const [industry, setIndustry] = useState<(typeof INDUSTRIES)[number]>("すべて");
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
      if (location !== "すべて" && j.city !== location) return false;
      if (industry !== "すべて" && j.industry !== industry) return false;
      if (newGrad && j.requiredJlpt !== "N5") return false;
      if (noExp) {
        if (!["N5", "N4"].includes(j.requiredJlpt)) return false;
      }
      if (remote && j.industry === "建設") return false;
      return true;
    });
  }, [initialJobs, keyword, location, industry, noExp, newGrad, remote]);

  /** /candidate/applications? からの遷移で該当求人をスクロール＆一時ハイライト */
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
    setLocation("すべて");
    setIndustry("すべて");
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
      {/* 左: フィルタ（デスクトップでsticky） */}
      <aside className="min-w-0 lg:sticky lg:top-4 lg:max-h-[min(calc(100dvh-5rem),52rem)] lg:overflow-y-auto lg:self-start">
        <div
          className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] p-4 shadow-[var(--app-shadow-sm)] dark:border-zinc-800/80 dark:bg-zinc-900/50"
        >
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">フィルタ</h2>
          <div className="mt-3 space-y-3">
            <div>
              <label className="app-label" htmlFor="job-kw">
                キーワード
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
                勤務地
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
                業種
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
              <span className="app-label">月額（円）</span>
              <div className="mt-1 flex items-center gap-2">
                <input
                  value={salaryFrom}
                  onChange={(e) => setSalaryFrom(e.target.value)}
                  className="app-input min-w-0 flex-1"
                  inputMode="numeric"
                  placeholder="下限"
                />
                <span className="text-zinc-400">—</span>
                <input
                  value={salaryTo}
                  onChange={(e) => setSalaryTo(e.target.value)}
                  className="app-input min-w-0 flex-1"
                  inputMode="numeric"
                  placeholder="上限"
                />
              </div>
            </div>
            <div className="space-y-2 border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">クイック条件</p>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
                <input
                  type="checkbox"
                  checked={noExp}
                  onChange={(e) => setNoExp(e.target.checked)}
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500/30"
                />
                JLPT低めを優先
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
                <input
                  type="checkbox"
                  checked={newGrad}
                  onChange={(e) => setNewGrad(e.target.checked)}
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500/30"
                />
                N5のみ
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
                <input
                  type="checkbox"
                  checked={remote}
                  onChange={(e) => setRemote(e.target.checked)}
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500/30"
                />
                建設現場を除く（軽作業向けのヒント）
              </label>
            </div>
            <div className="flex flex-col gap-2 border-t border-zinc-100 pt-3 sm:flex-row sm:items-center dark:border-zinc-800/80">
              <button type="button" onClick={resetFilters} className="text-left text-sm text-zinc-500 underline-offset-2 hover:text-[var(--app-primary)] hover:underline">
                条件をクリア
              </button>
              <p className="text-xs text-zinc-500 sm:ml-auto">
                表示 <strong className="text-zinc-800 dark:text-zinc-200">{filtered.length}</strong> / {initialJobs.length} 件
              </p>
            </div>
            <button type="button" className="app-btn app-btn-primary w-full" onClick={() => {}}>
              この条件で検索
            </button>
          </div>
        </div>
      </aside>

      {/* 右: 一覧 */}
      <div className="min-w-0">
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
                        ジョブシェア選考
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
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">仕事内容</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                          {extra.workSummary}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">応募条件</p>
                        <ul className="mt-1.5 list-inside list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                          {extra.requirements.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-zinc-500">
                        <span>更新: {extra.updatedAt}</span>
                        <span>掲載: {extra.publishedAt}</span>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col gap-3 border-t border-zinc-100 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 dark:border-zinc-800/80">
                      <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        <p>
                          <span className="text-zinc-400">月給</span> — {j.salary}
                        </p>
                        <p>
                          <span className="text-zinc-400">勤務地</span> — {j.city}
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
                          詳細を見る
                        </Link>
                        <button
                          type="button"
                          className="app-btn app-btn-secondary w-full text-sm"
                          title="お気に入りに保存"
                        >
                          ♡ 保存
                        </button>
                        <button
                          type="button"
                          className="app-btn app-btn-primary w-full text-sm"
                          title="候補者を紹介"
                        >
                          候補者を紹介
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
            該当する求人がありません。条件やキーワードを変えてください。
          </p>
        )}
      </div>
    </div>
  );
}
