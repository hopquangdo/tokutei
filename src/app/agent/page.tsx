import { applications, jobs } from "@/lib/mock/seed";
import { getAgentHomeKpis } from "@/lib/mock/platform-dashboard-data";
import {
  CandidateEngagementBarChart,
  CandidateJobIndustryChart,
  CandidateOfferRejectLineChart,
  CandidatePipelineBarChart,
} from "@/app/candidate/CandidateDashboardCharts";
import { Card } from "@/components/ui/Card";

const AGENT_ID = "a1";

export default function AgentDashboard() {
  const kpi = getAgentHomeKpis(applications, jobs, AGENT_ID);

  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">登録支援機関ダッシュボード</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        {(
          [
            {
              k: "公開中求人",
              v: String(kpi.openJobs),
              sub: "自組織の求人（a1）",
            },
            {
              k: "自社求人への応募",
              v: String(kpi.applicationsCount),
              sub: "掲載した求人へ届いた件数",
            },
            {
              k: "B2Bパートナー数",
              v: String(kpi.b2bPartnerAgents),
              sub: "B2Bマーケットに掲載する他機関数",
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

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Card>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">オープン中（パイプライン）</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{kpi.openPipeline}</p>
          <p className="mt-0.5 text-xs text-zinc-500">終了・不採用・取り下げ前</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">B2Bマーケット</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">ON</p>
          <p className="mt-0.5 text-xs text-zinc-500">プランに応じた紹介・手数料</p>
        </Card>
      </div>

      <div className="mt-6 grid min-h-0 w-full min-w-0 gap-4 lg:grid-cols-2 lg:items-stretch">
        <div className="min-h-0 min-w-0">
          <CandidateJobIndustryChart className="h-full min-h-[280px]" />
        </div>
        <div className="min-h-0 min-w-0">
          <CandidateOfferRejectLineChart className="flex h-full min-h-[280px] flex-col" />
        </div>
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
