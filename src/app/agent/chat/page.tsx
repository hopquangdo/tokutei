import { B2BChatClient } from "./B2BChatClient";

export default function ChatPage() {
  return (
    <div className="app-page-body flex h-full min-h-0 w-full min-w-0 max-w-full flex-1 flex-col">
      <h1 className="sr-only">B2Bチャット（登録支援機関）</h1>
      <div
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-b border-[var(--app-border)] bg-[var(--app-surface-elevated)] shadow-[var(--app-shadow-card)] sm:border sm:rounded-2xl dark:border-zinc-800/80 dark:bg-zinc-900/50"
        role="region"
        aria-label="B2Bチャットエリア"
      >
        <B2BChatClient />
      </div>
    </div>
  );
}
