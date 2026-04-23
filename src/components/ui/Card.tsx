import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  padding = "p-4",
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] shadow-[var(--app-shadow-card)] dark:border-zinc-800/80 dark:bg-zinc-900/50 ${padding} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-sm font-medium text-zinc-500 dark:text-zinc-400 ${className}`}
    >
      {children}
    </h2>
  );
}

export function CardStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
