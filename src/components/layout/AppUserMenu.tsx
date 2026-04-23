"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Role } from "@/lib/auth/types";
import { defaultHomeForRole } from "@/lib/auth/redirect";

const roleLabel: Record<Role, string> = {
  candidate: "Ứng viên",
  agent: "登録支援機関 (Agent)",
  admin: "Willtec Admin",
};

function initials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return (p[0]![0]! + p[1]![0]!).toUpperCase();
  const w = p[0] ?? "?";
  return w.slice(0, 2).toUpperCase();
}

export function AppUserMenu({ user }: { user: { name: string; email: string; role: Role } | null }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);

  const logout = useCallback(async () => {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }, [router]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) {
    return (
      <Link
        className="app-btn app-btn-primary app-btn-sm shrink-0"
        href={`/login?next=${encodeURIComponent(pathname || "/")}`}
      >
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="relative shrink-0" ref={wrapRef}>
      <button
        type="button"
        className="flex max-w-full items-center gap-2 rounded-xl border border-zinc-200/90 bg-white/90 py-1 pl-1 pr-2 text-left shadow-sm transition hover:border-zinc-300 hover:bg-slate-50/90 dark:border-zinc-600/80 dark:bg-zinc-800/80 dark:hover:border-zinc-500"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={open ? panelId : undefined}
        id={`${panelId}-trigger`}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm"
          style={{ background: "var(--app-primary)" }}
        >
          {initials(user.name)}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-[10rem] truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            {user.name}
          </span>
          <span className="block text-[10px] font-medium text-[var(--app-text-muted)]">
            {roleLabel[user.role]}
          </span>
        </span>
        <span className="text-zinc-400 dark:text-zinc-500" aria-hidden>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          id={panelId}
          role="menu"
          aria-labelledby={`${panelId}-trigger`}
          className="absolute right-0 z-[60] mt-1.5 w-[min(18rem,calc(100vw-1.5rem))] origin-top-right overflow-hidden rounded-xl border border-zinc-200/90 bg-[var(--app-surface-elevated)] py-1.5 text-sm shadow-lg dark:border-zinc-700/80 dark:bg-zinc-900"
        >
          <div className="border-b border-zinc-100 px-3 py-2.5 dark:border-zinc-800/80">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">{user.name}</p>
            <p className="mt-0.5 truncate text-[11px] text-[var(--app-text-muted)]" title={user.email}>
              {user.email}
            </p>
            <p className="mt-1.5">
              <span
                className="inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: "var(--app-primary-subtle)", color: "var(--app-primary)" }}
              >
                {roleLabel[user.role]}
              </span>
            </p>
          </div>
          <div className="p-1">
            <Link
              role="menuitem"
              href={defaultHomeForRole(user.role)}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2.5 py-2 text-xs text-zinc-700 transition hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-800/80"
            >
              Về trang đầu khu
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              disabled={busy}
              className="mt-0.5 w-full rounded-lg px-2.5 py-2 text-left text-xs font-medium text-rose-700 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/50 disabled:opacity-50"
            >
              {busy ? "Đang đăng xuất…" : "Đăng xuất"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
