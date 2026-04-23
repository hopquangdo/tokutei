import {
  CandidatePipelineBarChart,
  PlatformDashboardCharts,
} from "@/app/candidate/CandidateDashboardCharts";
import { agents, socialLeads } from "@/lib/mock/seed";
import { Card } from "@/components/ui/Card";
import { CardStat } from "@/components/ui/Card";

export default function AdminHome() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">Điều phối Willtec</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardStat
            label="Agent hoạt động"
            value={String(agents.filter((a) => a.verified).length)}
          />
        </Card>
        <Card>
          <CardStat
            label="Lead mạng (nháp)"
            value={String(socialLeads.length)}
          />
        </Card>
        <Card>
          <CardStat label="Cần gán staff" value="2" />
        </Card>
      </div>

      <div className="mt-6 w-full min-w-0">
        <PlatformDashboardCharts />
        <div className="mt-4 w-full min-w-0">
          <CandidatePipelineBarChart />
        </div>
      </div>
    </div>
  );
}
