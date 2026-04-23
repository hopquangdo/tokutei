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
            Truy cập theo khu: Ứng viên hoặc Agent
          </p>
          <Card padding="p-5 sm:p-6">
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
