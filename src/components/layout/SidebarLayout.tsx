import { getSession } from "@/lib/auth/session";
import { AppShell, type AppNavItem } from "@/components/layout/AppShell";

export type { AppNavItem } from "@/components/layout/AppShell";

export async function SidebarLayout({
  title,
  nav,
  children,
  badge,
  variant,
}: {
  title: string;
  nav: AppNavItem[];
  children: React.ReactNode;
  badge?: string;
  variant: "candidate" | "agent" | "admin";
}) {
  const session = await getSession();
  const user = session
    ? { name: session.name, email: session.email, role: session.role }
    : null;

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AppShell title={title} badge={badge} nav={nav} user={user} variant={variant}>
          {children}
        </AppShell>
      </div>
    </div>
  );
}
