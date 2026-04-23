"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavIcon, type IconKey } from "@/components/layout/NavIcons";
import { AppUserMenu } from "@/components/layout/AppUserMenu";
import type { Role } from "@/lib/auth/types";

export type AppNavItem = { href: string; label: string; icon: IconKey };

const asideShell =
  "border-zinc-200/90 bg-[var(--app-surface-elevated)]/95 shadow-[var(--app-shadow-sm)] dark:border-zinc-800/80 dark:bg-slate-950/60";

const idleLinkClass =
  "text-zinc-600 hover:bg-slate-100/90 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100";

/** Cùng chiều cao + viền với thanh main header (kề sidebar trên desktop). */
const headerStripClass =
  "h-13 shrink-0 border-b border-[var(--app-border)] bg-[var(--app-surface-elevated)]/95 shadow-[var(--app-shadow-header)] backdrop-blur dark:border-zinc-800/80";

function ShellBrand({
  title,
  badge,
  className = "",
}: {
  title: string;
  badge?: string;
  className?: string;
}) {
  return (
    <div className={["flex min-w-0 items-center justify-between gap-2", className].filter(Boolean).join(" ")}>
      <Link
        href="/"
        className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-lg py-0.5 pl-0.5 pr-1 text-left transition hover:bg-slate-50/80 dark:hover:bg-zinc-800/50"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm"
          style={{ background: "var(--app-primary)" }}
          aria-hidden
        >
          W
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
            {title}
          </span>
          <span className="block truncate text-sm font-bold leading-tight text-zinc-900 transition group-hover:text-[var(--app-primary)] dark:text-zinc-50">
            Willtec Tokutei
          </span>
        </span>
      </Link>
      {badge ? (
        <span
          className="shrink-0 self-center rounded-md px-2 py-0.5 text-[10px] font-semibold leading-tight"
          style={{
            background: "var(--app-sidebar-badge-bg)",
            color: "var(--app-sidebar-badge-fg)",
          }}
        >
          {badge}
        </span>
      ) : null}
    </div>
  );
}

function navItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/candidate" || href === "/agent") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNav({
  nav,
  pathname,
  onItemClick,
}: {
  nav: AppNavItem[];
  pathname: string;
  onItemClick?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5 p-2">
      {nav.map((n) => {
        const on = navItemActive(pathname, n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={onItemClick}
            className={
              on
                ? "app-sidebar-link-active flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition"
                : `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${idleLinkClass}`
            }
          >
            <NavIcon name={n.icon} />
            <span className="min-w-0 flex-1 leading-snug">{n.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  title,
  badge,
  nav,
  children,
  user = null,
  variant: _variant,
}: {
  title: string;
  badge?: string;
  nav: AppNavItem[];
  children: React.ReactNode;
  /** Phiên đăng nhập (từ server) — menu avatar / đăng xuất */
  user?: { name: string; email: string; role: Role } | null;
  /** Dành cho theme tương lai theo khu (candidate / agent / demo) */
  variant?: "candidate" | "agent" | "demo";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  /** Trang cần lấp cả vùng main (không lề, chiều cao flex). */
  const mainFullBleed =
    pathname === "/candidate/messages" || pathname === "/agent/chat";

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div
        className={[
          "flex shrink-0 items-center gap-2 px-3 md:hidden",
          headerStripClass,
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200/90 text-zinc-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800/80"
          aria-label="Mở menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="min-w-0 flex-1" aria-hidden />
        <AppUserMenu user={user} />
      </div>

      <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {open && (
          <button
            type="button"
            className="absolute inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
            aria-label="Đóng menu"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={[
            "absolute inset-y-0 left-0 z-50 flex w-[min(19rem,88vw)] flex-col border-r transition-transform duration-200 ease-out",
            asideShell,
            open ? "translate-x-0" : "-translate-x-full",
            "md:static md:z-0 md:h-full md:min-h-0 md:w-64 md:max-w-[16.5rem] md:shrink-0 md:translate-x-0 md:overflow-hidden",
          ].join(" ")}
        >
          <div className={["flex items-center px-3", headerStripClass].join(" ")}>
            <ShellBrand title={title} badge={badge} />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <SidebarNav
              nav={nav}
              pathname={pathname}
              onItemClick={() => setOpen(false)}
            />
          </div>
          <p className="border-t border-[var(--app-border)] p-3 text-[10px] leading-relaxed text-zinc-500 dark:border-zinc-800/80">
            Willtec Tokutei · bản dữ liệu staging nội bộ
          </p>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header
            className={["hidden w-full min-w-0 items-center justify-end gap-2 px-3 md:flex", headerStripClass].join(" ")}
            aria-label="Tài khoản"
          >
            <AppUserMenu user={user} />
          </header>
          <main
            className={[
              "app-main-scroll min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain",
              mainFullBleed && "flex min-h-0 flex-col",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              background: `linear-gradient(180deg, var(--app-surface) 0%, color-mix(in srgb, var(--app-primary) 4%, var(--app-surface)) 42%, var(--app-surface) 100%)`,
            }}
          >
            <div
              className={[
                "app-page-shell w-full min-w-0",
                mainFullBleed && "app-page-shell--bleed",
                mainFullBleed
                  ? "flex min-h-0 flex-1 flex-col px-0 py-0"
                  : "py-6 sm:py-8",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
