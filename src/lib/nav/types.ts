import type { IconKey } from "@/components/layout/NavIcons";

export type AppNavItem = { href: string; label: string; icon: IconKey };

export type NavGroup = { id: string; label: string; items: AppNavItem[] };
