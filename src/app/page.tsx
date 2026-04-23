import Link from "next/link";
import { Card } from "@/components/ui/Card";

const cards = [
  {
    href: "/login?next=%2Fcandidate",
    title: "Candidate Site",
    desc: "Ứng viên: đăng ký, AI OCR, CV Builder, ứng tuyển, tin nhắn với Agent.",
  },
  {
    href: "/login?next=%2Fagent",
    title: "Agent Site (登録支援機関)",
    desc: "Quản lý Job & ứng viên, pipeline, marketplace B2B, chat, tiến cử.",
  },
  {
    href: "/login?next=%2Fadmin",
    title: "Admin (Willtec)",
    desc: "Duyệt đối tác, marketing, lead Meta/IG, matching AI, hoa hồng.",
  },
] as const;

const roadmap = [
  "Số hóa hồ sơ, OCR 在留・指定書, CV hỗ trợ AI và tìm việc nội bộ theo 特定技能.",
  "Marketplace B2B, hub ứng viên, chat giữa Agent, pipeline và tiến cử có thể theo dõi.",
  "Marketing & lead, matching thông minh theo JLPT / CQI và resume.",
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="app-page-shell w-full min-w-0 flex-1 py-10 sm:py-14">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] p-6 shadow-[var(--app-shadow-card)] sm:p-10 dark:border-zinc-800/80">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-90 blur-3xl"
            style={{ background: "color-mix(in srgb, var(--app-primary) 16%, transparent)" }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full opacity-60 blur-2xl"
            style={{ background: "color-mix(in srgb, var(--app-accent) 12%, transparent)" }}
            aria-hidden
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--app-primary)]">
            Willtec · Tokutei Platform
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Nền tảng tuyển dụng 特定技能
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
            Tách khu theo vai trò (Ứng viên, 登録支援機関, Willtec), phân quyền rõ ràng — một
            luồng ứng tuyển và tuyển dụng 特定技能 tập trung.
          </p>
        </div>

        <ul className="mt-8 space-y-3 sm:mt-10">
          {roadmap.map((r) => (
            <li
              key={r}
              className="flex gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)]/80 px-4 py-3 text-sm text-[var(--app-text-muted)] shadow-[var(--app-shadow-sm)] dark:border-zinc-800/80 dark:bg-zinc-900/30"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--app-primary)" }}
              />
              <span className="leading-relaxed">{r}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="group block">
              <Card
                className="h-full transition group-hover:border-blue-200 group-hover:shadow-md dark:group-hover:border-blue-500/25"
                padding="p-4 sm:p-5"
              >
                <h2 className="text-base font-semibold text-zinc-900 group-hover:text-[var(--app-primary)] dark:text-zinc-50 dark:group-hover:text-blue-300">
                  {c.title}
                </h2>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--app-text-muted)]">
                  {c.desc}
                </p>
                <span className="mt-4 inline-flex items-center text-xs font-semibold text-[var(--app-primary)] group-hover:underline">
                  Bắt đầu
                  <span className="ml-1" aria-hidden>
                    →
                  </span>
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
