import type { ReactNode } from "react";

const iconClass = "h-[18px] w-[18px] shrink-0 text-current";

type IconKey =
  | "home"
  | "user"
  | "file"
  | "scan"
  | "pen"
  | "search"
  | "inbox"
  | "message"
  | "briefcase"
  | "users"
  | "layout"
  | "store"
  | "settings"
  | "link"
  | "bar"
  | "zap"
  | "dollar"
  | "list"
  | "book";

const icons: Record<IconKey, () => ReactNode> = {
  home: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  user: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  file: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V10.5a.75.75 0 0 0-.22-.53l-7.5-7.5a.75.75 0 0 0-.53-.22Z" />
    </svg>
  ),
  scan: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 12 9.375v-4.5ZM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5Z" />
    </svg>
  ),
  pen: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  ),
  search: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  ),
  inbox: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 0 1.86 1.98l.19.01h6.3a2.25 2.25 0 0 0 1.86-1.98L18.5 13.5M2.25 7.5h19.5M2.25 4.5h19.5" />
    </svg>
  ),
  message: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m.375 0H9.75M12 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m.375 0H13.5m.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H13.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  briefcase: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-4.25m0-1.4h16.5m-16.5-4.1V6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v2.4M9 8.25h.008v.008H9V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM12 5.25h.008v.008H12V5.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  ),
  users: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.8-2.04v-.5ZM15 19.128v-.003c0-1.113-.285-2.16-.78-3.04M19.5 6.5a2.25 2.25 0 1 0-2.5-2.25M4.5 6.5a2.25 2.25 0 1 0 2.5-2.25" />
    </svg>
  ),
  layout: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  ),
  store: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25A1.5 1.5 0 0 0 3.75 16.5V21m-3-3h18.75M3.75 3.75h.008v.008H3.75V3.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75h.008v.008H9.75V3.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75h.008v.008H15.75V3.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75h19.5a1.5 1.5 0 0 0 1.5-1.5V4.5a1.5 1.5 0 0 0-1.5-1.5H2.25a1.5 1.5 0 0 0-1.5 1.5V5.25a1.5 1.5 0 0 0 1.5 1.5Z" />
    </svg>
  ),
  settings: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.375.303.69.65.87.322.17.7.2 1.04.1l1.2-.3a1.125 1.125 0 0 1 1.3 1.3l-.27 1.2c-.1.34-.07.72.1 1.04.18.35.5.6.9.64l1.3.2c.55.1.94.6.94 1.15v2.6c0 .55-.39 1.05-.94 1.15l-1.3.2c-.4.04-.72.3-.9.64-.18.32-.2.7-.1 1.04l.27 1.2a1.125 1.125 0 0 1-1.3 1.3l-1.2-.3c-.34-.1-.72-.07-1.04.1-.35.18-.59.5-.64.9l-.2 1.3c-.1.55-.6.94-1.15.94h-2.6c-.55 0-1.05-.39-1.15-.94l-.2-1.3c-.05-.4-.29-.72-.64-.9a1.1 1.1 0 0 0-1.04-.1l-1.2.3a1.125 1.125 0 0 1-1.3-1.3l.27-1.2c.1-.34.07-.72-.1-1.04-.18-.35-.5-.6-.9-.64l-1.3-.2c-.55-.1-.94-.6-.94-1.15v-2.6c0-.55.39-1.05.94-1.15l1.3-.2c.4-.04.72-.3.9-.64.18-.32.2-.7.1-1.04l-.27-1.2a1.125 1.125 0 0 1 1.3-1.3l1.2.3c.32.1.7.08 1.04-.1.35-.18.6-.5.64-.9l.2-1.3Z" />
    </svg>
  ),
  link: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 0 6.364L10 18.25a4.5 4.5 0 0 1-6.364-6.364l1.06-1.06a.75.75 0 0 1 1.06 0l.53.53a.75.75 0 0 1 0 1.06L5.3 12.5a2.25 2.25 0 0 0 0 3.182l1.5 1.5a2.25 2.25 0 0 0 3.182 0l3.19-3.19a.75.75 0 0 0 0-1.06l-1.06-1.06a.75.75 0 0 1 0-1.06l.53-.53a.75.75 0 0 1 1.06 0Z" />
    </svg>
  ),
  bar: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v4.5C7.5 18.246 6.996 18.75 6.375 18.75h-2.25A1.125 1.125 0 0 1 3 17.625v-4.5ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125v-9.75ZM16.5 3.75c0-.621.504-1.125 1.125-1.125h2.25C20.496 2.625 21 3.129 21 3.75v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V3.75Z" />
    </svg>
  ),
  zap: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5 10.5 2.25 8.25 10.5H12l-2.25 6.75L21.75 10.5 14.25 22.5 12.75 12h-2.5L3.75 13.5Z" />
    </svg>
  ),
  dollar: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3.75-7.5h7.5a1.875 1.875 0 0 0 0-3.75H9.75a1.875 1.875 0 0 1 0-3.75h3.75m0 0H12m-3.75 7.5h4.5a1.875 1.875 0 0 1 0 3.75H9.75a1.875 1.875 0 0 0 0 3.75H12m0 0h.008v.008H12V15Z" />
    </svg>
  ),
  list: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 4.5h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 17.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  ),
  book: () => (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6.75 4.5c-1.64 0-3.1.5-4.2 1.2V18c1.1-.7 2.56-1.2 4.2-1.2 1.64 0 3.1.5 4.2 1.2V5.2c-1.1-.7-2.56-1.2-4.2-1.2Z" />
    </svg>
  ),
};

export function NavIcon({ name }: { name: IconKey }) {
  const I = icons[name] ?? icons.home;
  return <span className="opacity-90">{I()}</span>;
}

export type { IconKey };
