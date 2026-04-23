"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { simulateCvPolish } from "@/lib/mock/ai-demo";

/** Màu tham chiếu: mint #2ECC71 + nền sáng + nút đen */
const mint = {
  solid: "bg-[#2ECC71]",
  light: "bg-[#E8F8F0]",
  border: "border-emerald-200/80",
};

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const formats =
  "PDF, Word, Excel, ảnh, TXT… — xử lý cục bộ, chưa tải lên máy chủ.";

type TabId = "general" | "it" | "shokumu";

const templates: { id: TabId; label: string; sub: string }[] = [
  { id: "general", label: "Template chung", sub: "履歴書" },
  { id: "it", label: "CV IT", sub: "IT 職務経歴" },
  { id: "shokumu", label: "Kỹ thuật", sub: "職務経歴書" },
];

type Msg = { id: string; role: "user" | "assistant"; text: string };

export function CvBuilderClient() {
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const [fileNames, setFileNames] = useState<string[]>([]);
  const [composerDrag, setComposerDrag] = useState(false);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      text:
        "Xin chào! Mô tả kinh nghiệm hoặc upload file CV — tôi sẽ gợi ý nội dung tiếng Nhật (履歴書 / 職務経歴). Bên phải là preview theo template.",
    },
  ]);
  const [draft, setDraft] = useState(
    "Tôi làm xây dựng 2 năm. Biết dùng máy, chịu khó, làm ca đêm cũng được."
  );
  const [out, setOut] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [nameKanji, setNameKanji] = useState("阮 文 英");
  const [nameKana, setNameKana] = useState("グエン バン エー");
  const [dob, setDob] = useState("1995-04-20");
  const [age, setAge] = useState("30");
  const [lastUserText, setLastUserText] = useState("");

  const buildCvText = useCallback(
    (userInput: string) => {
      const header =
        activeTab === "it"
          ? "【IT】\n"
          : activeTab === "shokumu"
            ? "【職務経歴】\n"
            : "【履歴書】\n";
      return header + simulateCvPolish(userInput);
    },
    [activeTab]
  );

  const pushAssistant = useCallback(
    (userInput: string) => {
      const text = buildCvText(userInput);
      setOut(text);
      setMessages((m) => [...m, { id: uid(), role: "assistant", text }]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    },
    [buildCvText]
  );

  const sendMessage = useCallback(() => {
    const t = draft.trim();
    if (!t) return;
    setLastUserText(t);
    setMessages((m) => [...m, { id: uid(), role: "user", text: t }]);
    setDraft("");
    pushAssistant(t);
  }, [draft, pushAssistant]);

  const onFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      const names = Array.from(files, (f) => f.name);
      setFileNames(names);
      const userLine = `[Đính kèm: ${names.join(", ")}] — Phân tích & tạo CV.`;
      setLastUserText(userLine);
      setMessages((m) => [...m, { id: uid(), role: "user", text: userLine }]);
      const head = `【Phân tích từ file】\n${names.join(", ")}\n\n`;
      const body = simulateCvPolish(
        draft.trim() || "Nội dung rút gọn từ file đính kèm."
      );
      const text = head + body;
      setOut(text);
      setMessages((m) => [...m, { id: uid(), role: "assistant", text }]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    },
    [draft]
  );

  const regenerate = useCallback(() => {
    if (!lastUserText) return;
    if (lastUserText.startsWith("[Upload file:")) {
      if (!fileNames.length) return;
      const head = `【Tạo lại từ file】\n${fileNames.join(", ")}\n\n`;
      const text = head + simulateCvPolish(draft.trim() || "Nội dung từ file đính kèm.");
      setOut(text);
      setMessages((m) => [...m, { id: uid(), role: "assistant", text }]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
      return;
    }
    const text = buildCvText(lastUserText);
    setOut(text);
    setMessages((m) => [...m, { id: uid(), role: "assistant", text }]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [lastUserText, fileNames, draft, buildCvText]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: "Đã xóa cuộc trò chuyện. Nhập mô tả hoặc gửi file.",
      },
    ]);
    setOut("");
    setFileNames([]);
  }, []);

  const newChat = useCallback(() => {
    setMessages([
      {
        id: "welcome2",
        role: "assistant",
        text: "Phiên mới. Bạn cần CV theo 建設, 食料, hay 介護?",
      },
    ]);
    setOut("");
    setDraft("");
    setFileNames([]);
  }, []);

  const addToEditor = useCallback((text: string) => {
    setOut((prev) => (prev ? `${prev}\n\n---\n${text}` : text));
  }, []);

  useEffect(() => {
    if (!plusMenuOpen) return;
    function onDocDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setPlusMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [plusMenuOpen]);

  return (
    <div className="grid w-full min-h-0 max-w-full grid-cols-1 gap-4 lg:h-[calc(100dvh-7.5rem)] lg:grid-cols-[minmax(0,1fr)_min(100%,400px)] lg:grid-rows-1 lg:gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      {/* —— AI Chat (trái) —— */}
      <div
        className="relative flex w-full min-h-[min(50dvh,22rem)] flex-col overflow-hidden rounded-3xl border border-zinc-200/60 bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] lg:h-full lg:min-h-0 dark:border-zinc-800 dark:bg-zinc-900"
        aria-labelledby={listId + "-title"}
      >
        <div className="border-b border-zinc-100/80 px-4 py-3 dark:border-zinc-800/80">
          <p id={listId + "-title"} className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            AI CV Chat
          </p>
          <p className="text-[11px] text-zinc-500">Nhập nội dung hoặc đính kèm file — {formats}</p>
        </div>

        <div className="absolute left-2 top-24 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={clearChat}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            title="Xóa chat"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={newChat}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            title="Chat mới"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <div
          className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 pl-12"
          role="log"
          aria-live="polite"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              {m.role === "assistant" ? (
                <div
                  className={`max-w-[92%] rounded-2xl border ${mint.border} ${mint.light} px-3.5 py-2.5 shadow-sm sm:max-w-[88%]`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                    {m.text}
                  </p>
                  <div className="mt-2 flex flex-wrap justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => void navigator.clipboard.writeText(m.text)}
                      className="rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-medium text-zinc-600 ring-1 ring-zinc-200/80 hover:bg-white dark:bg-zinc-800/80 dark:ring-zinc-600"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => addToEditor(m.text)}
                      className="rounded-md bg-zinc-900 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-zinc-800"
                    >
                      Thêm vào editor
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-[90%] rounded-2xl border border-zinc-200/90 bg-white px-3.5 py-2.5 text-sm text-zinc-800 shadow-sm dark:border-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-100 sm:max-w-[85%]">
                  {m.text}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 border-t border-zinc-200/90 bg-white px-3 py-3 dark:border-zinc-800/80 dark:bg-zinc-900">
          <input
            ref={fileRef}
            type="file"
            tabIndex={-1}
            className="hidden"
            accept=".pdf,.doc,.docx,image/*,.txt"
            multiple
            onChange={(e) => {
              onFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setComposerDrag(true);
            }}
            onDragLeave={() => setComposerDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setComposerDrag(false);
              onFiles(e.dataTransfer.files);
            }}
            className={`relative rounded-2xl p-2 transition ${
              composerDrag
                ? "bg-zinc-50 ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-white dark:bg-zinc-800/50 dark:ring-offset-zinc-900"
                : "bg-white dark:bg-zinc-900"
            }`}
          >
            {fileNames.length > 0 && (
              <div className="mb-2 flex flex-wrap items-center gap-1.5 px-1">
                {fileNames.map((n) => (
                  <span
                    key={n}
                    className="inline-flex max-w-full items-center gap-1 truncate rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[11px] text-zinc-800 dark:border-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-200"
                  >
                    <PaperclipIcon className="h-3 w-3 shrink-0 text-zinc-500 dark:text-zinc-400" />
                    {n}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFileNames([]);
                    setLastUserText("");
                  }}
                  className="text-[11px] text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline dark:hover:text-zinc-300"
                >
                  Bỏ file
                </button>
              </div>
            )}

            {/* Thanh nhập pill — nền trắng */}
            <div
              className={`flex min-h-[52px] items-center gap-1 rounded-[1.75rem] border border-zinc-200/90 bg-white px-2 py-1.5 shadow-sm dark:border-zinc-600/80 dark:bg-zinc-800/90 ${
                composerDrag ? "border-emerald-500/50 dark:border-emerald-500/50" : ""
              }`}
            >
              <div className="relative shrink-0" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setPlusMenuOpen((v) => !v)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700/80"
                  aria-expanded={plusMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Thêm — tải file và công cụ"
                >
                  <PlusCircleIcon className="h-6 w-6" />
                </button>
                {plusMenuOpen && (
                  <div
                    className="absolute bottom-full left-0 z-30 mb-2 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-zinc-200/90 bg-white py-1 shadow-2xl ring-1 ring-black/5 dark:border-zinc-600/80 dark:bg-zinc-800"
                    role="menu"
                  >
                    <MenuRow
                      icon={<PaperclipIcon className="h-4 w-4" />}
                      label="Tải ảnh & file"
                      onClick={() => {
                        fileRef.current?.click();
                        setPlusMenuOpen(false);
                      }}
                    />
                    <MenuRow
                      icon={<ImageIcon className="h-4 w-4" />}
                      label="Tạo ảnh"
                      hint="Tự động"
                      onClick={() => setPlusMenuOpen(false)}
                    />
                    <MenuRow
                      icon={<LightbulbIcon className="h-4 w-4" />}
                      label="Suy luận"
                      onClick={() => setPlusMenuOpen(false)}
                    />
                    <MenuRow
                      icon={<TelescopeIcon className="h-4 w-4" />}
                      label="Nghiên cứu sâu"
                      onClick={() => setPlusMenuOpen(false)}
                    />
                    <MenuRow
                      icon={<MoreIcon className="h-4 w-4" />}
                      label="Thêm"
                      trailing
                      onClick={() => setPlusMenuOpen(false)}
                    />
                  </div>
                )}
              </div>

              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
                className="max-h-32 min-h-[44px] w-0 min-w-0 flex-1 resize-none bg-transparent py-2 text-[15px] leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                placeholder="Hỏi bất cứ điều gì…"
              />

              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-200"
                title="Nhập bằng giọng nói"
                aria-label="Bật micro"
              >
                <MicIcon className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={sendMessage}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white shadow-md transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                aria-label="Gửi"
              >
                <WaveformSendIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-2 px-0.5">
              <button
                type="button"
                onClick={() =>
                  setDraft((d) =>
                    d ? `${d}\n\n[Yêu cầu: chỉnh sửa / viết lại đoạn CV]` : "Chỉnh sửa CV: làm ngắn gọn, giọng lịch sự tiếng Nhật."
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-600/80 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-800/80"
              >
                <PencilIcon className="h-3.5 w-3.5" />
                Viết hoặc chỉnh
              </button>
              <button
                type="button"
                onClick={() =>
                  setDraft((d) =>
                    d ? `${d}\n\n[Tra cứu: từ vựng 建設 / mẫu câu]` : "Tra cứu: gợi ý từ vựng 職務経歴 phổ biến."
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-600/80 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-800/80"
              >
                <GlobeIcon className="h-3.5 w-3.5" />
                Tra cứu nhanh
              </button>
              <button
                type="button"
                onClick={regenerate}
                className="ml-auto text-[11px] text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline dark:hover:text-zinc-300"
              >
                Regenerate
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-zinc-500 dark:text-zinc-600">
              Kéo thả file vào đây hoặc dùng + → Tải ảnh &amp; file
            </p>
          </div>
        </div>
      </div>

      {/* —— Template CV (phải) —— */}
      <aside
        className="flex min-h-0 w-full flex-col gap-3 overflow-y-auto overflow-x-hidden lg:h-full"
        aria-label="Template CV"
      >
        <div className="rounded-2xl border border-zinc-200/60 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Template & preview</h3>
          <div className="mt-2 flex gap-0.5 rounded-xl border border-zinc-200/80 bg-white p-0.5 dark:border-zinc-700 dark:bg-zinc-900">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={
                  activeTab === t.id
                    ? "flex-1 rounded-lg bg-white py-1.5 text-center text-[11px] font-semibold text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                    : "flex-1 rounded-lg py-1.5 text-center text-[11px] text-zinc-500"
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-600 dark:text-zinc-300">
              {templates.find((x) => x.id === activeTab)?.sub}
            </span>
            <span className="text-[#2ECC71]">Xem trước trực tiếp</span>
          </div>
          <div className="mb-2 grid grid-cols-2 gap-2 text-[11px]">
            <label className="col-span-2">
              <span className="text-zinc-500">氏名</span>
              <input
                value={nameKanji}
                onChange={(e) => setNameKanji(e.target.value)}
                className="mt-0.5 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800/60"
              />
            </label>
            <label>
              <span className="text-zinc-500">ふりがな</span>
              <input
                value={nameKana}
                onChange={(e) => setNameKana(e.target.value)}
                className="mt-0.5 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800/60"
              />
            </label>
            <label>
              <span className="text-zinc-500">年齢</span>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-0.5 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800/60"
              />
            </label>
            <label className="col-span-2">
              <span className="text-zinc-500">生年月日</span>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="mt-0.5 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800/60"
              />
            </label>
          </div>
          <div
            className="max-h-[min(50vh,420px)] min-h-[200px] overflow-y-auto rounded-xl border border-dashed border-zinc-200/90 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-900/50"
            style={{ minHeight: "200px" }}
          >
            {out ? (
              <pre className="whitespace-pre-wrap font-sans text-[11px] leading-relaxed text-zinc-800 dark:text-zinc-200">
                {`氏名: ${nameKanji} (${nameKana})  年: ${dob}  年齢: ${age}\n\n` + out}
              </pre>
            ) : (
              <p className="text-center text-xs text-zinc-400">
                Nội dung từ AI sẽ đồng bộ ở đây. Gửi tin nhắn bên trái hoặc upload file.
              </p>
            )}
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl p-4 text-white shadow-md"
          style={{
            background: "linear-gradient(135deg, #2ECC71 0%, #1abc9c 50%, #16a085 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/15"
            aria-hidden
          />
          <p className="text-xs font-medium text-white/90">Điểm CV</p>
          <p className="mt-1 text-2xl font-bold">B+</p>
          <p className="mt-0.5 text-[11px] text-white/85">
            Cập nhật prompt hoặc thêm 職務経歴 để tăng điểm.
          </p>
          <button
            type="button"
            className="mt-3 w-full rounded-xl bg-zinc-900 py-2 text-xs font-semibold text-white shadow hover:bg-zinc-800"
          >
            Xuất CV
          </button>
        </div>
      </aside>
    </div>
  );
}

function MenuRow({
  icon,
  label,
  hint,
  trailing,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  hint?: string;
  trailing?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-zinc-800 transition hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-700/90"
    >
      <span className="shrink-0 text-zinc-500 dark:text-zinc-400">{icon}</span>
      <span className="min-w-0 flex-1">
        {label}
        {hint && <span className="text-zinc-500"> {hint}</span>}
      </span>
      {trailing && (
        <span className="shrink-0 text-zinc-400 dark:text-zinc-500">
          <ChevronRightIcon className="h-4 w-4" />
        </span>
      )}
    </button>
  );
}

function PaperclipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21.44 11.05-8.49 8.49a5.5 5.5 0 0 1-7.78-7.78l8.49-8.49a3.5 3.5 0 0 1 4.95 4.95l-8.49 8.49a2 2 0 0 1-2.83-2.83l7.78-7.78"
      />
    </svg>
  );
}

function PlusCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="4" width="18" height="14" rx="2" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l3-3 3 2 3-3 3 2" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547Z"
      />
    </svg>
  );
}

function TelescopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 4 3 2 2-2 3 2 3-1 1 1-1 1v4l-2 2-3-1-1 1-1-1-2-1-2-3Z" />
      <path strokeLinecap="round" d="M4 20h4l1-1-2-2H5l-1-1" />
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="9" y="3" width="6" height="10" rx="3" />
      <path d="M12 19v3M8 19h8" />
      <path d="M6 10v1a6 6 0 0 0 12 0v-1" />
    </svg>
  );
}

function WaveformSendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="4" y="10" width="2.5" height="8" rx="0.5" />
      <rect x="8.5" y="6" width="2.5" height="12" rx="0.5" />
      <rect x="13" y="3.5" width="2.5" height="17" rx="0.5" />
      <rect x="17.5" y="7.5" width="2.5" height="9" rx="0.5" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a12 12 0 0 0 0 18M12 3a12 12 0 0 1 0 18" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.08 0L9.5 5.8m7.2 0l-.294 1.1M3 5.8h6m9 0h4M8 4h3l1-1h2l1 1" />
    </svg>
  );
}
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}
