"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TooltipContentProps, TooltipValueType } from "recharts";
import { applications, jobs } from "@/lib/mock/seed";
import {
  getPlatformDashboardSnapshot,
  barJobEngagementByMonth,
  offerVsRejectByMonth,
  pieChartFills,
} from "@/lib/mock/platform-dashboard-data";

const OFFER_STROKE = "var(--app-primary)";
const REJECT_STROKE = "var(--app-chart-compare)";

import type { IndustrySlice } from "@/lib/mock/platform-dashboard-data";

type SliceRow = IndustrySlice;

function ChartCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function IndustryTooltip(
  props: TooltipContentProps<TooltipValueType, string | number>
) {
  const { active, payload } = props;
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload as SliceRow | undefined;
  if (!row) return null;
  return (
    <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-elevated)] px-3 py-2 text-sm shadow-md dark:border-zinc-700 dark:bg-zinc-800">
      <p className="font-medium text-zinc-900 dark:text-zinc-100">
        {row.name}
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{row.desc}</p>
      <p
        className="text-sm font-semibold"
        style={{ color: "var(--app-primary)" }}
      >
        {row.value}%
      </p>
    </div>
  );
}

function OfferRejectTooltip(
  props: TooltipContentProps<TooltipValueType, string | number>
) {
  const { active, label, payload } = props;
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-elevated)] px-3 py-2 text-xs shadow-md dark:border-zinc-700 dark:bg-zinc-800">
      <p className="mb-1 font-medium text-zinc-800 dark:text-zinc-200">
        {label}
      </p>
      {payload.map((e) => (
        <p
          key={String(e.dataKey)}
          className="flex items-center gap-2"
          style={{ color: e.color }}
        >
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ background: e.color }}
          />
          {e.name}: <strong>{e.value}</strong>
        </p>
      ))}
    </div>
  );
}

function BarEngagementTooltip(
  props: TooltipContentProps<TooltipValueType, string | number>
) {
  return <OfferRejectTooltip {...props} />;
}

function JobIndustryPieCard({ className = "" }: { className?: string }) {
  const { industry: industryDistribution } = getPlatformDashboardSnapshot(
    applications,
    jobs
  );
  return (
    <ChartCard className={`min-w-0 ${className}`.trim()}>
      <>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Phân bổ job theo ngành (分野)
          </h3>
        </div>
        <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
          Từ danh sách việc đang mở — đồng bộ với khu Agent &amp; Admin
        </p>
        <div className="h-[300px] w-full min-h-[280px] min-w-0 sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={260}>
            <PieChart>
              <Pie
                data={industryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={90}
                paddingAngle={1}
                label={({ name, value }) => `${name} ${value}%`}
                labelLine={{ stroke: "#a1a1aa" }}
              >
                {industryDistribution.map((row, i) => (
                  <Cell
                    key={row.name + i}
                    fill={pieChartFills[i % pieChartFills.length]!}
                    stroke="var(--app-surface-elevated)"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={IndustryTooltip} />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                formatter={(value) => (
                  <span className="text-zinc-600 dark:text-zinc-300">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    </ChartCard>
  );
}

/** Chỉ biểu đồ tròn phân bổ ngành (dùng cạnh “Việc đang tuyển” trên tổng quan ứng viên). */
export function CandidateJobIndustryChart({ className = "" }: { className?: string }) {
  return <JobIndustryPieCard className={className} />;
}

function OfferRejectLineCard({ className = "" }: { className?: string }) {
  return (
    <ChartCard className={`min-w-0 ${className}`.trim()}>
      <>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Đơn được Offer &amp; bị từ chối
          </h3>
          <span
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-[var(--app-border)] bg-zinc-50 px-2.5 py-1 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
            title="Bộ lọc"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M3 4h18l-7 8v6l-4-2v-4L3 4z" />
            </svg>
            Bộ lọc
          </span>
        </div>
        <div className="mb-2 flex flex-wrap gap-4 text-[11px] text-zinc-600 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-0.5 w-4 rounded-sm"
              style={{ background: OFFER_STROKE }}
            />
            Được Offer (chờ PV / đã vào công ty)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-0.5 w-4 rounded-sm"
              style={{ background: REJECT_STROKE }}
            />
            Bị từ chối (trượt / từ chối / hủy)
          </span>
        </div>
        <div className="h-[300px] w-full min-h-[280px] min-w-0 sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={260}>
            <LineChart
              data={[...offerVsRejectByMonth]}
              margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={OfferRejectTooltip} />
              <Line
                type="monotone"
                dataKey="offer"
                name="Offer"
                stroke={OFFER_STROKE}
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--app-primary)", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="reject"
                name="Từ chối"
                stroke={REJECT_STROKE}
                strokeWidth={2}
                dot={{ r: 2.5, fill: "var(--app-chart-compare)", strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </>
    </ChartCard>
  );
}

function JobEngagementBarCard() {
  return (
    <ChartCard className="w-full">
      <>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Tương tác việc (hệ thống): xem gợi ý &amp; lưu tin
        </h3>
        <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
          Số lượt xem tin gợi ý / lưu theo tháng — cột kép
        </p>
        <div className="h-[280px] w-full min-h-[240px] min-w-0">
          <ResponsiveContainer width="100%" height="100%" minHeight={220}>
            <BarChart
              data={[...barJobEngagementByMonth]}
              margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-zinc-200/80 dark:stroke-zinc-700/60"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={BarEngagementTooltip} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="viewed"
                name="Xem gợi ý (JD)"
                fill="var(--app-chart-2)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="saved"
                name="Lưu tin"
                fill="var(--app-chart-4)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    </ChartCard>
  );
}

/** Cột pipeline — đồng bộ dữ liệu nền tảng (cùng snapshot với Agent/Admin). */
export function CandidatePipelineBarChart({ className }: { className?: string }) {
  const { pipelineBar } = getPlatformDashboardSnapshot(applications, jobs);
  return (
    <ChartCard
      className={`flex h-full min-h-[280px] w-full min-w-0 flex-col ${className ?? ""}`}
    >
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Ứng tuyển theo bước pipeline
      </h3>
      <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        Tổng hợp từ toàn bộ hồ sơ ứng tuyển — thống nhất 3 khu
      </p>
      <div className="min-h-0 w-full flex-1">
        <div className="h-full min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <BarChart
              data={pipelineBar}
              margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-zinc-200/80 dark:stroke-zinc-700/60"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
                interval={0}
                height={36}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={OfferRejectTooltip} />
              <Bar
                dataKey="count"
                name="Số lượng"
                fill="var(--app-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartCard>
  );
}

/** Chỉ biểu đồ line Offer / từ chối (xếp cùng hàng “Theo dõi ứng tuyển” trên tổng quan). */
export function CandidateOfferRejectLineChart({ className = "" }: { className?: string }) {
  return <OfferRejectLineCard className={className} />;
}

/** Tương tác xem gợi ý & lưu tin (cột kép) — tách khỏi line Offer/Reject. */
export function CandidateEngagementBarChart() {
  return <JobEngagementBarCard />;
}

/** Tương tác: line Offer/Reject + bar engagement (dùng Agent/Admin; tổng quan ứng viên có thể tách từng phần). */
export function CandidateLineAndEngagementCharts() {
  return (
    <div className="mt-6 w-full min-w-0 space-y-4">
      <OfferRejectLineCard />
      <JobEngagementBarCard />
    </div>
  );
}

export function CandidateDashboardCharts() {
  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <JobIndustryPieCard />
        <OfferRejectLineCard />
      </div>
      <JobEngagementBarCard />
    </div>
  );
}

/** Cùng component — dùng chung Ở Agent / Admin (đồng bộ dữ liệu & biểu đồ). */
export { CandidateDashboardCharts as PlatformDashboardCharts };
