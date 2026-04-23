import { applications, getAgent, getCandidate, getJob, jobs } from "@/lib/mock/seed";
import { getCandidateHomeKpis } from "@/lib/mock/platform-dashboard-data";
import { Card } from "@/components/ui/Card";
import {
  CandidateEngagementBarChart,
  CandidateJobIndustryChart,
  CandidateOfferRejectLineChart,
  CandidatePipelineBarChart,
} from "./CandidateDashboardCharts";

const CANDIDATE_ID = "c1";
const JOBS_HOME_PREVIEW = 5;

const upcomingInterviews = [
  {
    id: "iv1",
    jobTitle: "特定技能 建設 — 鉄筋工",
    when: "28/04/2026, 10:00 – 11:00",
    place: "オンライン（Zoom）",
    note: "在留カードと指定書の原本を必ず持参。",
  },
  {
    id: "iv2",
    jobTitle: "再面接 — HR分野確認",
    when: "05/05/2026, 14:00",
    place: "東京（事務所）",
    note: "指定書の写りを鮮明に更新ください。",
  },
] as const;

const stageLabel: Record<string, string> = {
  screening: "書類選考",
  interview: "面接",
  visa: "在留・ビザ",
  offer: "内定",
  onboarded: "入社手続き",
  sourced: "紹介元",
};

function profileCompletePct(cand: ReturnType<typeof getCandidate>) {
  if (!cand) return 0;
  const base = Math.min(100, Math.round(cand.cqiScore * 0.85 + (cand.legalOk ? 10 : 0)));
  return base;
}

export default function CandidateDashboard() {
  const mine = applications.filter((a) => a.candidateId === CANDIDATE_ID);
  const kpi = getCandidateHomeKpis(applications, CANDIDATE_ID);
  const cand = getCandidate(CANDIDATE_ID);
  const profilePct = profileCompletePct(cand);
  const jobsPreview = jobs.slice(0, JOBS_HOME_PREVIEW);

  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">候補者ダッシュボード</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        {(
          [
            {
              k: "区分アカウント",
              v: "1",
              sub: "候補者向け",
            },
            { k: "面接実施", v: String(kpi.interviewCount), sub: "応募ベース" },
            {
              k: "内定 / 入社手続き",
              v: String(kpi.offerOrOnboard),
              sub: "内定〜入社手続き段階",
            },
          ] as const
        ).map((x) => (
          <Card
            key={x.k}
            className="border-l-4 border-l-[var(--app-primary)]"
            padding="p-4"
          >
            <p className="text-xs font-medium text-[var(--app-text-muted)]">{x.k}</p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
              {x.v}
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--app-text-subtle)]">{x.sub}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">プロフィール完成度</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{profilePct}%</p>
          <p className="mt-0.5 text-xs text-blue-800 dark:text-blue-200/90">
            {cand?.legalOk ? "在留等: 問題なし" : "要補足: 指定書の鮮明な画像"}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">応募件数</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {kpi.applicationCount}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">現在の履歴に基づく</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">登録支援機関から</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">1</p>
          <p className="mt-0.5 text-xs text-zinc-500">履歴書の更新推奨</p>
        </Card>
      </div>

      <div className="mt-6 grid min-h-0 w-full min-w-0 gap-4 lg:grid-cols-2 lg:items-stretch">
        <div className="min-h-0 min-w-0">
          <CandidateJobIndustryChart className="h-full min-h-[280px]" />
        </div>
        <Card className="flex h-full min-h-[280px] min-w-0 flex-col" padding="p-0">
          <div className="shrink-0 border-b border-zinc-100 p-4 dark:border-zinc-800/80">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              募集中の求人
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              {jobsPreview.length} / {jobs.length} 件
            </p>
          </div>
          <ul className="min-h-0 flex-1 divide-y divide-zinc-100 overflow-y-auto overscroll-y-contain px-4 dark:divide-zinc-800/80">
            {jobsPreview.map((j) => {
              const owner = getAgent(j.ownerAgentId);
              return (
                <li
                  key={j.id}
                  className="flex flex-col gap-1 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{j.title}</p>
                    <p className="text-xs text-zinc-500">
                      {j.industry} · {j.city} · JLPT {j.requiredJlpt} · {j.salary}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-zinc-500">{owner?.name ?? "—"}</p>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid min-h-0 w-full min-w-0 gap-4 lg:grid-cols-2 lg:items-stretch">
        <Card className="flex h-full min-h-[260px] min-w-0 flex-col" padding="p-0">
          <div className="shrink-0 p-4 pb-3">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              応募状況
            </h2>
            <p className="text-xs text-zinc-500">提出済みの応募</p>
          </div>
          <ul className="min-h-0 max-h-[min(40vh,22rem)] flex-1 divide-y divide-zinc-100 overflow-y-auto overscroll-y-contain px-4 dark:divide-zinc-800/80">
            {mine.map((a) => {
              const j = getJob(a.jobId);
              if (!j) return null;
              return (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0"
                >
                  <span className="min-w-0 text-sm leading-snug">{j.title}</span>
                  <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">
                    {stageLabel[a.stage] ?? a.stage}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card className="flex h-full min-h-[260px] min-w-0 flex-col" padding="p-0">
          <div className="shrink-0 p-4 pb-3">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">面接予定</h2>
            <p className="text-xs text-zinc-500">直近の予定とメモ</p>
          </div>
          <ul className="min-h-0 max-h-[min(40vh,22rem)] flex-1 space-y-3 overflow-y-auto overscroll-y-contain px-4 pb-4">
            {upcomingInterviews.map((iv) => (
              <li
                key={iv.id}
                className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 text-sm dark:border-zinc-800/80 dark:bg-zinc-800/40"
              >
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{iv.jobTitle}</p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {iv.when} — {iv.place}
                </p>
                <p className="mt-1.5 text-xs text-zinc-500">{iv.note}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 min-h-0 w-full min-w-0">
        <CandidateOfferRejectLineChart className="flex h-full min-h-[280px] flex-col" />
      </div>

      <div className="mt-6 grid min-h-0 w-full min-w-0 gap-4 lg:grid-cols-2 lg:items-stretch">
        <div className="min-h-0 min-w-0">
          <CandidateEngagementBarChart />
        </div>
        <div className="min-h-0 min-w-0">
          <CandidatePipelineBarChart className="h-full" />
        </div>
      </div>
    </div>
  );
}
