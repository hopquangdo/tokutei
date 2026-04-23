import type { ReactNode } from "react";

export function PageHeader({
  title,
  eyebrow,
  description,
  action,
  className = "",
}: {
  title: string;
  /** Nhãn phía trên tiêu đề (vd. tên module) */
  eyebrow?: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mb-8 flex flex-col gap-3 border-b border-[var(--app-border)] pb-5 dark:border-zinc-800/80 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        {description != null && description !== "" && (
          <div className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
            {description}
          </div>
        )}
      </div>
      {action && <div className="shrink-0 sm:pb-0.5">{action}</div>}
    </div>
  );
}
