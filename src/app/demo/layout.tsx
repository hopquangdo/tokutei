import { AppShell, type AppNavItem } from "@/components/layout/AppShell";
import { getSession } from "@/lib/auth/session";

const nav: AppNavItem[] = [
  { href: "/", label: "プラットフォームTOP", icon: "home" },
  { href: "/demo/verification", label: "4段階本人確認フロー", icon: "scan" },
];

export default async function DemoLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const user = session
    ? { name: session.name, email: session.email, role: session.role }
    : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <AppShell
          title="ドキュメント"
          badge="ガイド"
          variant="demo"
          nav={nav}
          user={user}
        >
          {children}
        </AppShell>
      </div>
    </div>
  );
}
