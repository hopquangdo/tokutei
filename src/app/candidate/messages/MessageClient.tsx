"use client";

import { useCallback, useMemo, useState } from "react";

type Msg = { id: string; from: "them" | "me"; text: string; at: string };

type Conversation = {
  id: string;
  title: string;
  subtitle?: string;
  lastPreview: string;
  lastAt: string;
  messages: Msg[];
};

const initial: Conversation[] = [
  {
    id: "c1",
    title: "登録支援（Willtec東京）",
    subtitle: "登録支援",
    lastPreview: "指定書のカラー原本を再アップロードしてください。",
    lastAt: "今日 10:00",
    messages: [
      {
        id: "1",
        from: "them",
        text: "指定書のカラー原本を再アップロードしてください。",
        at: "10:00",
      },
      { id: "2", from: "me", text: "承知しました。本日中に提出します。", at: "10:12" },
    ],
  },
  {
    id: "c2",
    title: "HR — 建設 現場A",
    subtitle: "初回面接",
    lastPreview: "現場へは在留カードの原本をお持ちください。",
    lastAt: "昨日 16:20",
    messages: [
      {
        id: "1",
        from: "them",
        text: "現場へは在留カードの原本をお持ちください。",
        at: "16:20",
      },
    ],
  },
  {
    id: "c3",
    title: "アカウント窓口",
    subtitle: "Willtec",
    lastPreview: "書類の更新ありがとうございます。",
    lastAt: "2026/4/20",
    messages: [
      { id: "1", from: "them", text: "書類の更新ありがとうございます。", at: "09:00" },
    ],
  },
];

function uid() {
  return `m-${Date.now()}`;
}

export function MessageClient() {
  const [conversations, setConversations] = useState<Conversation[]>(initial);
  const [activeId, setActiveId] = useState<string>(initial[0]?.id ?? "");
  const [draft, setDraft] = useState("");

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text || !active) return;
    const now = "たった今";
    const newMsg: Msg = { id: uid(), from: "me", text, at: now };
    setConversations((rows) =>
      rows.map((c) =>
        c.id === activeId
          ? {
            ...c,
            messages: [...c.messages, newMsg],
            lastPreview: text,
            lastAt: now,
          }
          : c
      )
    );
    setDraft("");
  }, [draft, active, activeId]);

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col md:flex-row ">
      {/* Cột trái: danh sách hội thoại */}
      <div
        className="flex min-h-0 w-full min-w-0 flex-[0_0_auto] flex-col border-b border-[var(--app-border)] bg-slate-50/50 max-md:max-h-[min(40dvh,18rem)] dark:border-zinc-800/80 dark:bg-zinc-900/30 md:h-full md:max-h-none md:w-72 md:max-w-[40%] md:shrink-0 md:border-b-0 md:border-r"
        role="navigation"
        aria-label="会話一覧"
      >
        <p className="shrink-0 border-b border-[var(--app-border)] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)] dark:border-zinc-800/80">
          会話
        </p>
        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          {conversations.map((c) => {
            const on = c.id === activeId;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={
                    on
                      ? "flex w-full flex-col items-start gap-0.5 border-l-[3px] border-l-[var(--app-primary)] bg-blue-50/90 px-3 py-2.5 text-left transition dark:bg-blue-950/30"
                      : "flex w-full flex-col items-start gap-0.5 border-l-[3px] border-l-transparent px-3 py-2.5 text-left transition hover:bg-white/80 dark:hover:bg-zinc-800/40"
                  }
                >
                  <span
                    className={
                      on
                        ? "text-sm font-semibold text-zinc-900 dark:text-zinc-50"
                        : "text-sm font-medium text-zinc-800 dark:text-zinc-200"
                    }
                  >
                    {c.title}
                  </span>
                  {c.subtitle && (
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {c.subtitle}
                    </span>
                  )}
                  <span className="line-clamp-1 w-full text-xs text-zinc-500">
                    {c.lastPreview}
                  </span>
                  <span className="text-[10px] text-zinc-400">{c.lastAt}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Cột phải: tin nhắn + composer */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {active ? (
          <>
            <div className="shrink-0 border-b border-[var(--app-border)] px-3 py-2.5 dark:border-zinc-800/80">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{active.title}</p>
              {active.subtitle && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{active.subtitle}</p>
              )}
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-y-contain p-3">
              {active.messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.from === "me" ? "flex justify-end" : "flex justify-start"
                  }
                >
                  <div
                    className={
                      m.from === "me"
                        ? "max-w-[min(100%,20rem)] rounded-2xl rounded-br-md border border-blue-200/80 bg-blue-50 px-3 py-2 text-sm text-zinc-900 shadow-sm dark:border-blue-500/25 dark:bg-blue-950/50 dark:text-zinc-100"
                        : "max-w-[min(100%,20rem)] rounded-2xl rounded-bl-md border border-zinc-200/90 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-800/60 dark:text-zinc-100"
                    }
                  >
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      {m.from === "me" ? "あなた" : "相手"} · {m.at}
                    </p>
                    <p className="mt-0.5 whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="shrink-0 border-t border-[var(--app-border)] p-2 dark:border-zinc-800/80">
              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  className="app-input min-w-0 flex-1 text-sm"
                  placeholder="メッセージを入力…"
                />
                <button
                  type="button"
                  onClick={send}
                  className="app-btn app-btn-primary app-btn-sm shrink-0"
                >
                  送信
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6 text-sm text-zinc-500">
            会話を選択してください
          </div>
        )}
      </div>
    </div>
  );
}
