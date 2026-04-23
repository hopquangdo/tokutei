import { SidebarLayout } from "@/components/layout/SidebarLayout";
import type { AppNavItem } from "@/components/layout/SidebarLayout";

const nav: AppNavItem[] = [
  { href: "/candidate", label: "Tổng quan", icon: "home" },
  { href: "/candidate/profile", label: "Thông tin cá nhân", icon: "user" },
  { href: "/candidate/cv-builder", label: "AI CV Builder", icon: "pen" },
  { href: "/candidate/jobs", label: "Việc làm", icon: "search" },
  { href: "/candidate/applications", label: "Ứng tuyển", icon: "inbox" },
  { href: "/candidate/messages", label: "Tin nhắn", icon: "message" },
];

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout
      title="Candidate"
      variant="candidate"
      nav={nav}
    >
      {children}
    </SidebarLayout>
  );
}
