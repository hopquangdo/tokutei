import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { LoginForm } from "./LoginForm";
import { Card } from "@/components/ui/Card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const session = await getSession();
  if (session) {
    redirect(safeRedirectPath(sp.next, session.role));
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="app-page-shell flex w-full min-w-0 flex-1 flex-col items-center justify-center py-12 sm:py-16">
        <div className="w-full max-w-md">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
            Willtec
          </p>
          <h1 className="mb-1 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Đăng nhập
          </h1>
          <p className="mb-6 text-center text-sm text-[var(--app-text-muted)]">
            Truy cập theo khu: Ứng viên, Agent hoặc Admin
          </p>
          <Card padding="p-5 sm:p-6">
            <p className="mb-4 rounded-lg border border-zinc-200/80 bg-slate-50/90 px-3 py-2 text-center text-xs text-[var(--app-text-muted)] dark:border-zinc-700/80 dark:bg-zinc-800/50">
              Đăng nhập bằng một trong ba tài khoản bên dưới. Mật khẩu:{" "}
              <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">demo123</span>
            </p>
            <Suspense
              fallback={
                <p className="text-center text-sm text-zinc-500">Tải form…</p>
              }
            >
              <LoginForm />
            </Suspense>
          </Card>
        </div>
      </div>
    </div>
  );
}
