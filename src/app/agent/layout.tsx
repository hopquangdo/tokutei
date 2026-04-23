import { SidebarLayout } from "@/components/layout/SidebarLayout";
import type { AppNavItem } from "@/components/layout/SidebarLayout";

const nav: AppNavItem[] = [
  { href: "/agent", label: "Tổng quan", icon: "home" },
  { href: "/agent/jobs", label: "Job & AI JD", icon: "briefcase" },
  { href: "/agent/candidates", label: "Kho ứng viên", icon: "users" },
  { href: "/agent/applications", label: "Ứng tuyển", icon: "inbox" },
  { href: "/agent/pipeline", label: "Pipeline", icon: "layout" },
  { href: "/agent/marketplace", label: "B2B Marketplace", icon: "store" },
  { href: "/agent/chat", label: "Chat B2B", icon: "link" },
];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout
      title="Agent"
      badge="登録支援機関"
      variant="agent"
      nav={nav}
    >
      {children}
    </SidebarLayout>
  );
}
