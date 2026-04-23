"use client";

import { useMemo, useRef, useState } from "react";
import { simulateCvPolish } from "@/lib/mock/ai-demo";

type TabId = "general" | "it" | "shokumu";

const templates: { id: TabId; label: string; sub: string }[] = [
  { id: "general", label: "Template chung", sub: "履歴書" },
  { id: "it", label: "CV IT", sub: "IT 職務経歴" },
  { id: "shokumu", label: "Kỹ thuật", sub: "職務経歴書" },
];

const formats = "PDF, Word, ảnh, TXT (tối đa 10MB/tệp)";

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

  const previewText = useMemo(() => {
    const src = [
      cvFile ? `CV: ${cvFile}` : "CV: chưa tải",
      jdFile ? `JD: ${jdFile}` : "JD: chưa tải",
    ].join("\n");
    return simulateCvPolish(`Nguồn hồ sơ:\n${src}`);
  }, [cvFile, jdFile]);

  const onPick = (kind: "cv" | "jd", file: File | null) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      window.alert("File vượt quá 10MB.");
      return;
    }
    if (kind === "cv") setCvFile(file.name);
    else setJdFile(file.name);
  };

  return (
    <div className="grid w-full min-h-0 max-w-full grid-cols-1 gap-4 lg:h-[calc(100dvh-7.5rem)] lg:grid-cols-[minmax(0,1fr)_min(100%,420px)] lg:grid-rows-1 lg:gap-5">
      <section className="flex min-h-[min(50dvh,22rem)] flex-col overflow-hidden rounded-3xl border border-zinc-200/60 bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] lg:h-full lg:min-h-0 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100/80 px-4 py-3 dark:border-zinc-800/80">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Upload hồ sơ</p>
          <p className="text-[11px] text-zinc-500">Chỉ upload CV và JD. Bỏ các công cụ “thêm” khác.</p>
        </div>

        <div className="space-y-3 p-4">
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
            title="Upload CV"
            hint={formats}
            fileName={cvFile}
            onClick={() => cvRef.current?.click()}
          />
          <UploadCard
            title="Upload JD"
            hint={formats}
            fileName={jdFile}
            onClick={() => jdRef.current?.click()}
          />
        </div>
      </section>

      <aside className="flex min-h-0 w-full flex-col gap-3 overflow-y-auto overflow-x-hidden lg:h-full">
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
          Chọn file
        </button>
      </div>
      <p className="mt-2 truncate text-xs text-zinc-600 dark:text-zinc-300">
        {fileName ? `Đã chọn: ${fileName}` : "Chưa có file"}
      </p>
    </div>
  );
}
