import { SidebarLayout } from "@/components/layout/SidebarLayout";
import type { AppNavItem } from "@/components/layout/SidebarLayout";

const nav: AppNavItem[] = [
  { href: "/candidate", label: "ダッシュボード", icon: "home" },
  { href: "/candidate/profile", label: "プロフィール", icon: "user" },
  { href: "/candidate/cv-builder", label: "AI履歴書", icon: "pen" },
  { href: "/candidate/jobs", label: "求人検索", icon: "search" },
  { href: "/candidate/applications", label: "応募一覧", icon: "inbox" },
  { href: "/candidate/messages", label: "メッセージ", icon: "message" },
];

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout
      title="候補者"
      variant="candidate"
      nav={nav}
    >
      {children}
    </SidebarLayout>
  );
}
