import { TableShell } from "@/components/ui/TableShell";

const rows = [
  { id: "P-1", hoso: "Lê Thị (Lead FB)", staff: "未割当" },
  { id: "P-2", hoso: "Phạm Văn C (screening)", staff: "佐藤" },
] as const;

export default function AssignPage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">Phân công hồ sơ (Assign)</h1>
      <TableShell>
        <table className="w-full min-w-[300px] text-left text-sm">
          <thead className="border-b border-zinc-200/90 bg-zinc-50/90 text-xs font-medium text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-900/50">
            <tr>
              <th className="p-3">Hồ sơ</th>
              <th className="p-3">Staff</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60"
              >
                <td className="p-3">{r.hoso}</td>
                <td className="p-3">{r.staff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
}
