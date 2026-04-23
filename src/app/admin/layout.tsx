import { SidebarLayout } from "@/components/layout/SidebarLayout";
import type { AppNavItem } from "@/components/layout/SidebarLayout";

const nav: AppNavItem[] = [
  { href: "/admin", label: "Tổng quan", icon: "home" },
  { href: "/admin/master", label: "Master dữ liệu", icon: "settings" },
  { href: "/admin/partners", label: "Đối tác & phân quyền", icon: "users" },
  { href: "/admin/matching", label: "AI Matching", icon: "zap" },
  { href: "/admin/marketing", label: "Marketing", icon: "bar" },
  { href: "/admin/leads", label: "Lead Meta / IG", icon: "link" },
  { href: "/admin/billing", label: "Hoa hồng & billing", icon: "dollar" },
  { href: "/admin/assign", label: "Phân công staff", icon: "list" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout title="Admin" badge="Willtec" variant="admin" nav={nav}>
      {children}
    </SidebarLayout>
  );
}
