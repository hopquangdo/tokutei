import { SidebarLayout } from "@/components/layout/SidebarLayout";
import type { AppNavItem } from "@/components/layout/SidebarLayout";

const nav: AppNavItem[] = [
  { href: "/agent", label: "ダッシュボード", icon: "home" },
  { href: "/agent/jobs", label: "求人 & AI JD", icon: "briefcase" },
  { href: "/agent/candidates", label: "候補者リスト", icon: "users" },
  { href: "/agent/applications", label: "応募", icon: "inbox" },
  { href: "/agent/pipeline", label: "パイプライン", icon: "layout" },
  { href: "/agent/marketplace", label: "B2Bマーケット", icon: "store" },
  { href: "/agent/chat", label: "B2Bチャット", icon: "link" },
];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout
      title="エージェント"
      badge="登録支援機関"
      variant="agent"
      nav={nav}
    >
      {children}
    </SidebarLayout>
  );
}
