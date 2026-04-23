"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { safeRedirectPath } from "@/lib/auth/redirect";
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

      <p className="text-center text-sm">
        <Link className="app-link" href="/">
          ← Về trang chủ
        </Link>
      </p>
    </div>
  );
}
