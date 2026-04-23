import type { LegalStatus } from "@/lib/types";

const styles: Record<LegalStatus, string> = {
  ok: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40",
  warning:
    "bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-500/40",
  reject: "bg-rose-500/15 text-rose-700 dark:text-rose-200 border-rose-500/40",
};

const labels: Record<LegalStatus, string> = {
  ok: "Hợp lệ (Xanh)",
  warning: "Cảnh báo (Vàng)",
  reject: "Rủi ro / Không hợp lệ (Đỏ)",
};

export function StatusBadge({ status }: { status: LegalStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
