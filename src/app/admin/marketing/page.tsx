import { campaigns } from "@/lib/mock/seed";
import { Card } from "@/components/ui/Card";

export default function MarketingPage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">Marketing — tổng quan</h1>
      <ul className="space-y-3">
        {campaigns.map((c) => (
          <li key={c.id}>
            <Card>
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {c.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {c.platform} · {c.status}
                  </p>
                </div>
                <div className="text-left text-sm sm:text-right">
                  <p>Chi: {c.spendJpy.toLocaleString("ja-JP")} 円</p>
                  <p className="text-xs text-zinc-500">
                    Leads: {c.leads} — CV: {c.conversion}%
                  </p>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
