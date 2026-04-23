import type { ReactNode } from "react";

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="overflow-x-auto rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] shadow-[var(--app-shadow-sm)] dark:border-zinc-800/80 dark:bg-zinc-900/40 [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-slate-50/90 dark:[&_tbody_tr:hover]:bg-zinc-800/50"
    >
      {children}
    </div>
  );
}
