"use client";

import { useCallback, useMemo, useState } from "react";
import type { ChatThread, Message } from "@/lib/types";
import { b2bThreads } from "@/lib/mock/seed";

const MY_AGENT = "Willtec Hỗ trợ Tokyo";

type BubbleMsg = { id: string; from: "them" | "me"; text: string; at: string };

type Conversation = {
  id: string;
  title: string;
  subtitle: string;
  lastPreview: string;
  lastAt: string;
  messages: BubbleMsg[];
};

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function isMeFromLabel(from: string) {
  return from === MY_AGENT || from.startsWith("Bạn");
}

function messageToBubble(m: Message): BubbleMsg {
  return {
    id: m.id,
    from: isMeFromLabel(m.from) ? "me" : "them",
    text: m.text,
    at: formatTime(m.at),
  };
}

function threadToConversation(t: ChatThread): Conversation {
  const last = t.messages[t.messages.length - 1];
  const other = t.participants.filter((p) => p !== MY_AGENT);
  return {
    id: t.id,
    title: t.title,
    subtitle: other.length ? other.join(" · ") : "B2B",
    lastPreview: last ? (last.text.length > 90 ? last.text.slice(0, 90) + "…" : last.text) : "—",
    lastAt: last ? formatTime(last.at) : "—",
    messages: t.messages.map(messageToBubble),
  };
}

function uid() {
  return `b2b-${Date.now()}`;
}

const initial: Conversation[] = b2bThreads.map(threadToConversation);

export function B2BChatClient() {
  const [conversations, setConversations] = useState<Conversation[]>(initial);
  const [activeId, setActiveId] = useState<string>(initial[0]?.id ?? "");
  const [draft, setDraft] = useState("");

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text || !active) return;
    const now = "Vừa gửi";
    const newMsg: BubbleMsg = { id: uid(), from: "me", text, at: now };
    setConversations((rows) =>
      rows.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastPreview: text,
              lastAt: now,
            }
          : c,
      ),
    );
    setDraft("");
  }, [draft, active, activeId]);

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col md:flex-row">
      {/* Cột trái: hội thoại B2B (cùng pattern MessageClient ứng viên) */}
      <div
        className="flex min-h-0 w-full min-w-0 flex-[0_0_auto] flex-col border-b border-[var(--app-border)] bg-slate-50/50 max-md:max-h-[min(40dvh,18rem)] dark:border-zinc-800/80 dark:bg-zinc-900/30 md:h-full md:max-h-none md:w-72 md:max-w-[40%] md:shrink-0 md:border-b-0 md:border-r"
        role="navigation"
        aria-label="Hội thoại B2B"
      >
        <p className="shrink-0 border-b border-[var(--app-border)] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)] dark:border-zinc-800/80">
          Cuộc trò chuyện
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
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{c.subtitle}</span>
                  <span className="line-clamp-1 w-full text-xs text-zinc-500">{c.lastPreview}</span>
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
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{active.subtitle}</p>
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-y-contain p-3">
              {active.messages.map((m) => (
                <div
                  key={m.id}
                  className={m.from === "me" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      m.from === "me"
                        ? "max-w-[min(100%,20rem)] rounded-2xl rounded-br-md border border-blue-200/80 bg-blue-50 px-3 py-2 text-sm text-zinc-900 shadow-sm dark:border-blue-500/25 dark:bg-blue-950/50 dark:text-zinc-100"
                        : "max-w-[min(100%,20rem)] rounded-2xl rounded-bl-md border border-zinc-200/90 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-800/60 dark:text-zinc-100"
                    }
                  >
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      {m.from === "me" ? "Bạn" : "Đối tác"} · {m.at}
                    </p>
                    <p className="mt-0.5 whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="shrink-0 border-t border-[var(--app-border)] p-2 dark:border-zinc-800/80">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <input
                  className="app-input min-w-0 flex-1 text-sm"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Gửi ghi chú B2B (tiến cử, hoa hồng, lịch PV…)"
                  aria-label="Nội dung tin nhắn"
                />
                <button type="submit" className="app-btn app-btn-primary app-btn-sm shrink-0">
                  Gửi
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6 text-sm text-zinc-500">
            Chọn một cuộc trò chuyện
          </div>
        )}
      </div>
    </div>
  );
}
