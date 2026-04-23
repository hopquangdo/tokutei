"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { DEMO_USERS } from "@/lib/auth/demo-users";
import type { Role } from "@/lib/auth/types";

export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const nextParam = sp.get("next");
  const err = sp.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  async function submit() {
    setFormError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        role?: Role;
      };
      if (!res.ok) {
        setFormError(data.error ?? "Đăng nhập thất bại");
        return;
      }
      const role = data.role;
      if (!role) {
        setFormError("Phản hồi không hợp lệ");
        return;
      }
      const target = safeRedirectPath(nextParam, role);
      router.push(target);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-4">
      {err === "wrong_portal" && (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
          Bạn đã đăng nhập tài khoản khác khu. Vui lòng đăng xuất rồi chọn
          đúng loại tài khoản.
        </p>
      )}
      {formError && (
        <p className="text-sm text-rose-600 dark:text-rose-400">{formError}</p>
      )}

      <div className="space-y-2 text-sm">
        <label className="app-label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="app-input"
        />
      </div>
      <div className="space-y-2 text-sm">
        <label className="app-label" htmlFor="login-password">
          Mật khẩu
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="app-input"
        />
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="app-btn app-btn-primary mt-1 w-full py-2.5 text-sm"
      >
        {loading ? "…" : "Đăng nhập"}
      </button>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-[var(--app-text-muted)]">
          Tài khoản gợi ý
        </p>
        <div className="flex flex-col gap-1.5">
          {DEMO_USERS.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => {
                setEmail(u.email);
                setPassword(u.password);
              }}
              className="rounded-lg border border-[var(--app-border)] bg-slate-50/90 px-3 py-2.5 text-left text-xs text-zinc-700 shadow-[var(--app-shadow-sm)] transition hover:border-blue-200 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:border-blue-500/30 dark:hover:bg-zinc-800/80"
            >
              <span
                className="font-semibold capitalize"
                style={{ color: "var(--app-primary)" }}
              >
                {u.role}
              </span>{" "}
              <span className="text-[var(--app-text-muted)]">{u.email}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm">
        <Link className="app-link" href="/">
          ← Về trang chủ
        </Link>
      </p>
    </div>
  );
}
