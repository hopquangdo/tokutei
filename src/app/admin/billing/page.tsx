import { commissions } from "@/lib/mock/seed";
import { TableShell } from "@/components/ui/TableShell";

export default function BillingPage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">Tài chính &amp; hoa hồng</h1>
      <TableShell>
        <table className="w-full min-w-[400px] text-left text-sm">
          <thead className="border-b border-zinc-200/90 bg-zinc-50/90 text-xs font-medium text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-900/50">
            <tr>
              <th className="p-3">Loại</th>
              <th className="p-3">Số 万</th>
              <th className="p-3">Bên</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((b) => (
              <tr
                key={b.id}
                className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60"
              >
                <td className="p-3">
                  {b.kind === "listing" ? "Đăng tin" : "Thành công"}
                </td>
                <td className="p-3 tabular-nums">{b.amountMan}</td>
                <td className="p-3 text-xs">{b.party}</td>
                <td className="p-3 text-xs">
                  {b.status === "paid" ? "Đã thanh toán" : "Chờ"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
}
