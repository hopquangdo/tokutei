/**
 * Dữ liệu dashboard nền tảng: đồng bộ Ứng viên / Agent / Admin.
 * Biểu đồ pipeline + phân bổ ngành tính từ applications & jobs (seed);
 * chuỗi tháng (offer/engagement) là chỉ số tổng hợp nội bộ.
 */
import type { Application, Job, PipelineStage } from "@/lib/types";

export type IndustrySlice = {
  name: string;
  desc: string;
  value: number;
};

export const offerVsRejectByMonth = [
  { month: "T9/25", offer: 1, reject: 0 },
  { month: "T10/25", offer: 2, reject: 1 },
  { month: "T11/25", offer: 1, reject: 1 },
  { month: "T12/25", offer: 3, reject: 0 },
  { month: "T1/26", offer: 2, reject: 2 },
  { month: "T2/26", offer: 4, reject: 1 },
] as const;

export const barJobEngagementByMonth = [
  { month: "T9/25", viewed: 14, saved: 5 },
  { month: "T10/25", viewed: 22, saved: 8 },
  { month: "T11/25", viewed: 18, saved: 6 },
  { month: "T12/25", viewed: 26, saved: 11 },
  { month: "T1/26", viewed: 20, saved: 9 },
  { month: "T2/26", viewed: 31, saved: 14 },
] as const;

export const pieChartFills = [
  "var(--app-chart-1)",
  "var(--app-chart-2)",
  "var(--app-chart-3)",
  "var(--app-chart-4)",
  "var(--app-chart-5)",
] as const;

const pipelineOrder: PipelineStage[] = [
  "screening",
  "interview",
  "offer",
  "visa",
  "onboarded",
  "sourced",
];

/** Nhãn giai đoạn pipeline — dùng chung Agent / ứng viên / bảng. */
export const PIPELINE_STAGE_LABEL_VI: Record<PipelineStage, string> = {
  screening: "Sàng lọc",
  interview: "Phỏng vấn",
  offer: "Trúng tuyển",
  visa: "Visa",
  onboarded: "Onboard",
  sourced: "Nguồn",
};

const pipelineStepLabel = PIPELINE_STAGE_LABEL_VI;

/** Cột pipeline — đếm theo từng ứng tuyển (chỉ đơn còn mở, trừ đã đóng). */
export function buildPipelineBarFromApplications(apps: Application[]) {
  const open = apps.filter((a) => !a.closed);
  return pipelineOrder.map((stage) => ({
    name: pipelineStepLabel[stage],
    count: open.filter((a) => a.stage === stage).length,
  }));
}

/**
 * Pie: phân bổ job theo 分野 (từ danh sách job đang mở).
 * value = % theo số lượng job theo từng industry.
 */
export function buildIndustryDistributionFromJobs(jobs: Job[]): IndustrySlice[] {
  if (jobs.length === 0) {
    return [
      { name: "—", desc: "Chưa có job", value: 100 },
    ];
  }
  const counts = new Map<string, number>();
  for (const j of jobs) {
    counts.set(j.industry, (counts.get(j.industry) ?? 0) + 1);
  }
  const total = jobs.length;
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const raw = entries.map(([, n]) => Math.floor((n / total) * 100));
  let s = raw.reduce((a, b) => a + b, 0);
  if (raw.length > 0 && s < 100) {
    raw[raw.length - 1]! += 100 - s;
  }
  return entries.map(([industry], i) => ({
    name: industry,
    desc: "Việc làm đang đăng tải",
    value: raw[i]!,
  }));
}

export type PlatformDashboardSnapshot = {
  pipelineBar: ReturnType<typeof buildPipelineBarFromApplications>;
  industry: IndustrySlice[];
  offerVsReject: typeof offerVsRejectByMonth;
  jobEngagement: typeof barJobEngagementByMonth;
};

/** Một nguồn cho cả 3 khu: cùng applications + jobs từ seed. */
export function getPlatformDashboardSnapshot(
  apps: Application[],
  allJobs: Job[]
): PlatformDashboardSnapshot {
  return {
    pipelineBar: buildPipelineBarFromApplications(apps),
    industry: buildIndustryDistributionFromJobs(allJobs),
    offerVsReject: offerVsRejectByMonth,
    jobEngagement: barJobEngagementByMonth,
  };
}

/** KPI hàng trên tổng quan ứng viên (theo ứng tuyển của một candidate). */
export function getCandidateHomeKpis(apps: Application[], candidateId: string) {
  const mine = apps.filter((a) => a.candidateId === candidateId);
  const interviewCount = mine.filter((a) => a.stage === "interview").length;
  const offerOrOnboard = mine.filter(
    (a) => a.stage === "offer" || a.stage === "onboarded"
  ).length;
  return {
    applicationCount: mine.length,
    interviewCount,
    offerOrOnboard,
  };
}

/** KPI tổng quan Agent: job của tổ chức & ứng tuyển vào các job đó. */
export function getAgentHomeKpis(
  apps: Application[],
  allJobs: Job[],
  agentId: string
) {
  const myJobs = allJobs.filter((j) => j.ownerAgentId === agentId);
  const myJobIds = new Set(myJobs.map((j) => j.id));
  const applicationsOnMyJobs = apps.filter((a) => myJobIds.has(a.jobId));
  const openPipeline = applicationsOnMyJobs.filter((a) => !a.closed).length;
  const partnerAgentCount = new Set(
    allJobs.filter((j) => j.ownerAgentId !== agentId).map((j) => j.ownerAgentId)
  ).size;

  return {
    openJobs: myJobs.length,
    applicationsCount: applicationsOnMyJobs.length,
    openPipeline,
    b2bPartnerAgents: partnerAgentCount,
  };
}
