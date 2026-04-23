import { masterIndustries, masterVisa } from "@/lib/mock/seed";
import { Card } from "@/components/ui/Card";

export default function MasterDataPage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">Master: Ngành nghề &amp; tư cách lưu trú</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Ngành nghề
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {masterIndustries.map((i) => (
              <li key={i.code}>
                {i.labelJa}{" "}
                <span className="text-zinc-500">({i.labelVi})</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Tư cách lưu trú
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {masterVisa.map((v) => (
              <li key={v.code}>{v.label}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
