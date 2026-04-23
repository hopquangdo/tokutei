import Link from "next/link";
import { getAgent, jobs } from "@/lib/mock/seed";
import { Card } from "@/components/ui/Card";

export default function MarketplacePage() {
  const others = jobs.filter((j) => j.ownerAgentId !== "a1");

  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">B2B Marketplace (Agent)</h1>

      {others.length === 0 ? (
        <Card className="border-dashed">
          <p className="text-sm text-zinc-500">Chưa có tin từ tổ chức khác.</p>
        </Card>
      ) : (
        <ul className="space-y-4">
          {others.map((j) => {
            const a = getAgent(j.ownerAgentId);
            return (
              <li key={j.id}>
                <Card className="overflow-hidden border-l-4 border-l-amber-500/90 p-0" padding="p-0">
                  <div className="grid gap-4 p-4 lg:grid-cols-[1fr_14rem]">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span className="font-mono">ID: {j.id.toUpperCase()}</span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
                          B2B Marketplace
                        </span>
                      </div>
                      <p className="mt-2 text-lg font-semibold leading-snug text-app-primary">
                        {j.title}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Đăng bởi: {a?.name ?? "—"} · {j.city} · {j.industry}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-1 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300">
                          Lương: {j.salary}
                        </span>
                        <span className="rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-1 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300">
                          JLPT: {j.requiredJlpt}
                        </span>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col gap-2 border-t border-zinc-100 pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0 dark:border-zinc-800/80">
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                        Hoa hồng: {j.shareCommission}
                      </p>
                      <p className="text-xs text-zinc-500">Sẵn sàng cho luồng tiến cử ứng viên</p>
                      <Link
                        href={`/agent/marketplace/${j.id}`}
                        className="app-btn app-btn-primary mt-auto w-full text-center text-sm"
                      >
                        Xem chi tiết &amp; tiến cử
                      </Link>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
