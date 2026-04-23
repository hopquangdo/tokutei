import { JdParseClient } from "./JdParseClient";
import { getAgent, jobs } from "@/lib/mock/seed";
import { TableShell } from "@/components/ui/TableShell";

export default function AgentJobsPage() {
  const myJobs = jobs.filter((j) => j.ownerAgentId === "a1");

  return (
    <div className="app-page-body w-full min-w-0 space-y-10">
      <h1 className="sr-only">Job &amp; AI JD</h1>

      <section className="min-w-0" aria-labelledby="section-jd-workflow">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h2
            id="section-jd-workflow"
            className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
          >
            1. Tạo &amp; xuất bản nội dung
          </h2>
          <span className="text-xs text-zinc-500">Trên: upload · Dưới: chỉnh sửa &amp; đăng</span>
        </div>
        <JdParseClient />
      </section>

      <section className="min-w-0" aria-labelledby="section-job-list">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="section-job-list"
              className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
            >
              2. Tin tuyển đang mở
            </h2>
            <p className="text-xs text-zinc-500">
              {myJobs.length} vị trí — liên kết Ứng tuyển &amp; B2B
            </p>
          </div>
        </div>

        {myJobs.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700/60 dark:bg-zinc-900/20"
            role="status"
          >
            Chưa có tin. Hoàn tất bước tải &amp; phân tích JD để tạo bản ghi hiển thị tại đây.
          </div>
        ) : (
          <TableShell>
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-zinc-200/90 bg-zinc-50/90 text-xs font-medium text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-3 py-2.5">Vị trí</th>
                  <th className="px-3 py-2.5">分野</th>
                  <th className="px-3 py-2.5">Khu vực</th>
                  <th className="px-3 py-2.5">Lương</th>
                  <th className="px-3 py-2.5">JLPT</th>
                  <th className="px-3 py-2.5">B2B</th>
                </tr>
              </thead>
              <tbody>
                {myJobs.map((j) => {
                  const a = getAgent(j.ownerAgentId);
                  return (
                    <tr
                      key={j.id}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60"
                    >
                      <td className="px-3 py-3 align-top">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">{j.title}</p>
                        <p className="mt-0.5 text-[11px] text-zinc-500">{a?.name}</p>
                      </td>
                      <td className="px-3 py-3 text-zinc-700 dark:text-zinc-200">{j.industry}</td>
                      <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">{j.city}</td>
                      <td className="px-3 py-3 text-xs text-zinc-600 dark:text-zinc-400">{j.salary}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-zinc-800 dark:text-zinc-200">
                          {j.requiredJlpt}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-semibold text-blue-800 dark:text-blue-200">
                          {j.shareCommission}
                        </span>
                        <p className="text-[10px] text-zinc-500">tiến cử</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableShell>
        )}
      </section>
    </div>
  );
}
