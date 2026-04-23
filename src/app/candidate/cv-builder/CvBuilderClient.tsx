"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { simulateCvPolish } from "@/lib/mock/ai-demo";

type TabId = "general" | "it" | "shokumu";

type ChatMsg = { id: string; role: "user" | "assistant"; text: string };

const templates: { id: TabId; label: string; sub: string }[] = [
  { id: "general", label: "汎用", sub: "履歴書" },
  { id: "it", label: "IT向け", sub: "IT 職務経歴" },
  { id: "shokumu", label: "技術職", sub: "職務経歴書" },
];

const formats = "PDF、Word、画像、TXT（1ファイル10MBまで）";

export function CvBuilderClient() {
  const cvRef = useRef<HTMLInputElement>(null);
  const jdRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [cvFile, setCvFile] = useState<string | null>(null);
  const [jdFile, setJdFile] = useState<string | null>(null);
  const [nameKanji, setNameKanji] = useState("阮 文 英");
  const [nameKana, setNameKana] = useState("グエン バン エー");
  const [dob, setDob] = useState("1995-04-20");
  const [age, setAge] = useState("30");

  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "履歴書の改善をサポートします。CV・JDをアップロードしたうえで、修正したい点や希望をチャットで送ってください。（デモ応答）",
    },
  ]);
  const [chatDraft, setChatDraft] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const appendAssistant = useCallback((text: string) => {
    setChatMessages((m) => [
      ...m,
      { id: `a-${Date.now()}`, role: "assistant", text },
    ]);
  }, []);

  const sendChat = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const t = chatDraft.trim();
      if (!t) return;
      setChatMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: t }]);
      setChatDraft("");
      const cvHint = cvFile ? "CVはアップロード済みです。" : "まだCVが未アップロードです。";
      const jdHint = jdFile ? "JDはアップロード済みです。" : "JDは未アップロードです。";
      window.setTimeout(() => {
        appendAssistant(
          `「${t.slice(0, 120)}${t.length > 120 ? "…" : ""}」について反映しました。${cvHint}${jdHint} 職務要約を箇条書きで短くし、数値実績があれば追記してください（モック）。`,
        );
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    },
    [appendAssistant, chatDraft, cvFile, jdFile],
  );

  const previewText = useMemo(() => {
    const src = [
      cvFile ? `CV: ${cvFile}` : "CV: 未アップロード",
      jdFile ? `JD: ${jdFile}` : "JD: 未アップロード",
    ].join("\n");
    return simulateCvPolish(`元データ:\n${src}`);
  }, [cvFile, jdFile]);

  const onPick = (kind: "cv" | "jd", file: File | null) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      window.alert("ファイルサイズは10MB以下にしてください。");
      return;
    }
    if (kind === "cv") setCvFile(file.name);
    else setJdFile(file.name);
  };

  return (
    <div className="grid w-full min-h-0 max-w-full grid-cols-1 gap-4 lg:h-[calc(100dvh-7.5rem)] lg:grid-cols-[minmax(0,1fr)_min(100%,420px)] lg:grid-rows-1 lg:gap-5">
      <section className="flex min-h-[min(56dvh,28rem)] flex-col overflow-hidden rounded-3xl border border-zinc-200/60 bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] lg:min-h-0 lg:h-full dark:border-zinc-800 dark:bg-zinc-900">
        <div className="shrink-0 border-b border-zinc-100/80 px-4 py-3 dark:border-zinc-800/80">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">書類をアップロード</p>
          <p className="text-[11px] text-zinc-500">CVとJDのみアップロード。その他の付加ツールはありません。</p>
        </div>

        <div className="shrink-0 space-y-3 p-4">
          <input
            ref={cvRef}
            type="file"
            tabIndex={-1}
            className="hidden"
            accept=".pdf,.doc,.docx,image/*,.txt"
            onChange={(e) => {
              onPick("cv", e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
          <input
            ref={jdRef}
            type="file"
            tabIndex={-1}
            className="hidden"
            accept=".pdf,.doc,.docx,image/*,.txt"
            onChange={(e) => {
              onPick("jd", e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />

          <UploadCard
            title="CVをアップロード"
            hint={formats}
            fileName={cvFile}
            onClick={() => cvRef.current?.click()}
          />
          <UploadCard
            title="JDをアップロード"
            hint={formats}
            fileName={jdFile}
            onClick={() => jdRef.current?.click()}
          />
        </div>

        <div
          className="flex min-h-[12rem] flex-1 flex-col border-t border-zinc-100/90 lg:min-h-0 dark:border-zinc-800/80"
          role="region"
          aria-label="AIチャット"
        >
          <div className="shrink-0 px-4 pt-3">
            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">AIアシスタント</p>
            <p className="text-[10px] text-zinc-500">指示を送るとプレビュー用の文面案が返ります（デモ）。</p>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-y-contain px-4 py-2">
            {chatMessages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[min(100%,18rem)] rounded-2xl rounded-br-sm border border-blue-200/80 bg-blue-50 px-3 py-2 text-xs text-zinc-900 dark:border-blue-500/20 dark:bg-blue-950/50 dark:text-zinc-100"
                      : "max-w-[min(100%,20rem)] rounded-2xl rounded-bl-sm border border-zinc-200/90 bg-zinc-50/90 px-3 py-2 text-xs text-zinc-800 dark:border-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-100"
                  }
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form
            onSubmit={sendChat}
            className="shrink-0 border-t border-zinc-100/90 p-3 dark:border-zinc-800/80"
          >
            <div className="flex gap-2">
              <input
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
                className="app-input min-w-0 flex-1 text-sm"
                placeholder="例：職務要約を短くして、数値目標を入れて"
                aria-label="AIへのメッセージ"
              />
              <button type="submit" className="app-btn app-btn-primary app-btn-sm shrink-0">
                送信
              </button>
            </div>
          </form>
        </div>
      </section>

      <aside className="flex min-h-0 w-full flex-col gap-3 overflow-y-auto overflow-x-hidden lg:h-full">
        <div className="rounded-2xl border border-zinc-200/60 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">テンプレートとプレビュー</h3>
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
            <span className="text-[#2ECC71]">ライブプレビュー</span>
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

          <div className="max-h-[min(50vh,420px)] min-h-[200px] overflow-y-auto rounded-xl border border-dashed border-zinc-200/90 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-900/50">
            <pre className="whitespace-pre-wrap font-sans text-[11px] leading-relaxed text-zinc-800 dark:text-zinc-200">
              {`氏名: ${nameKanji} (${nameKana})  年: ${dob}  年齢: ${age}\n\n` + previewText}
            </pre>
          </div>
        </div>
      </aside>
    </div>
  );
}

function UploadCard({
  title,
  hint,
  fileName,
  onClick,
}: {
  title: string;
  hint: string;
  fileName: string | null;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3 dark:border-zinc-700 dark:bg-zinc-800/30">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
          <p className="text-[11px] text-zinc-500">{hint}</p>
        </div>
        <button type="button" onClick={onClick} className="app-btn app-btn-secondary app-btn-sm">
          ファイルを選ぶ
        </button>
      </div>
      <p className="mt-2 truncate text-xs text-zinc-600 dark:text-zinc-300">
        {fileName ? `選択: ${fileName}` : "未選択"}
      </p>
    </div>
  );
}
