import { campaigns, socialLeads } from "@/lib/mock/seed";
import { Card } from "@/components/ui/Card";

export default function LeadsPage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">Truyền thông &amp; mạng xã hội — Lead</h1>
      <ul className="space-y-3">
        {socialLeads.map((l) => {
          const c = campaigns.find((x) => x.id === l.campaignId);
          return (
            <li key={l.id}>
              <Card className="border-amber-500/20 bg-amber-500/5">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {l.name}{" "}
                  <span className="ml-1 rounded-md bg-amber-500/20 px-1.5 py-0.5 text-xs font-normal">
                    nháp
                  </span>
                </p>
                <p className="text-xs text-zinc-500">
                  {c?.name} · {l.source} · {l.phone}
                </p>
                <p className="mt-2 text-xs font-medium text-amber-900 dark:text-amber-100">
                  Thông báo: Agent a1 — đang xử lý
                </p>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
