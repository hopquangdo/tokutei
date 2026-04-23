import { agents } from "@/lib/mock/seed";
import { TableShell } from "@/components/ui/TableShell";

export default function PartnersPage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">Duyệt &amp; phân quyền Agent</h1>
      <TableShell>
        <table className="w-full min-w-[400px] text-left text-sm">
          <thead className="border-b border-zinc-200/90 bg-zinc-50/90 text-xs font-medium text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-900/50">
            <tr>
              <th className="p-3">Tên</th>
              <th className="p-3">Loại</th>
              <th className="p-3">Khu vực</th>
              <th className="p-3">Duyệt</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr
                key={a.id}
                className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60"
              >
                <td className="p-3">{a.name}</td>
                <td className="p-3 text-xs">
                  {a.type === "torokushien" ? "登録支援機関" : "自社支援企業"}
                </td>
                <td className="p-3 text-xs">{a.city}</td>
                <td className="p-3">{a.verified ? "✓" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
}
