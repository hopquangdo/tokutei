"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  emptyJdForm,
  simulateJdParse,
  type SimulatedJdParse,
} from "@/lib/mock/ai-demo";

const jlptOptions = ["N5", "N4", "N3", "N2", "N1", "不問"] as const;

/** Trễ giả lập thời gian phản hồi phân tích (staging). */
const PARSE_FAKE_MS_MIN = 1_200;
const PARSE_FAKE_MS_MAX = 2_200;

function fakeParseDelayMs() {
  return (
    PARSE_FAKE_MS_MIN + Math.floor(Math.random() * (PARSE_FAKE_MS_MAX - PARSE_FAKE_MS_MIN))
  );
}

function updateField<K extends keyof SimulatedJdParse>(key: K, v: SimulatedJdParse[K]) {
  return (prev: SimulatedJdParse) => ({ ...prev, [key]: v });
}

export function JdParseClient() {
  const [form, setForm] = useState<SimulatedJdParse>(() => emptyJdForm());
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [posted, setPosted] = useState(false);
  const [parseTick, setParseTick] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const parseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const parseInFlightRef = useRef(false);

  useEffect(() => {
    return () => {
      if (parseTimerRef.current) clearTimeout(parseTimerRef.current);
    };
  }, []);

  const onParse = useCallback(() => {
    if (parseInFlightRef.current) return;
    parseInFlightRef.current = true;
    setIsParsing(true);
    if (parseTimerRef.current) clearTimeout(parseTimerRef.current);
    const delay = fakeParseDelayMs();
    parseTimerRef.current = setTimeout(() => {
      parseTimerRef.current = null;
      parseInFlightRef.current = false;
      setForm(simulateJdParse());
      setParseTick((n) => n + 1);
      setIsParsing(false);
    }, delay);
  }, []);

  const onFilePick = (f: File | null) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      window.alert("File vượt quá 10MB (giới hạn hệ thống).");
      return;
    }
    setFileName(f.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFilePick(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.industry.trim()) {
      window.alert("Vui lòng điền ít nhất 職名 (tiêu đề) và 分野 (ngành).");
      return;
    }
    setPosted(true);
  };

  return (
    <div
      className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] shadow-[var(--app-shadow-card)] dark:border-zinc-800/80 dark:bg-zinc-900/40"
      role="region"
      aria-label="Luồng tạo tin từ JD"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--app-border)] bg-gradient-to-r from-blue-50/90 to-transparent px-4 py-3 dark:from-blue-950/25 dark:border-zinc-800/80 dark:to-transparent">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm"
          style={{ background: "var(--app-primary)" }}
          aria-hidden
        >
          AI
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            Workflow
          </p>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            ① Upload · ② Phân tích · ③ Chỉnh sửa &amp; đăng
          </p>
        </div>
      </div>

      {/* 1. Upload — dải gọn, kéo thả trên cùng một dòng hành động */}
      <div className="border-b border-[var(--app-border)] bg-white/70 px-3 py-2 sm:px-4 sm:py-2.5 dark:border-zinc-800/80 dark:bg-zinc-900/25">
        <div className="mb-1.5 flex flex-col gap-0.5 sm:mb-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <h3
            className="text-sm font-medium leading-tight text-zinc-800 dark:text-zinc-100"
            id="jd-upload-heading"
          >
            Bước 1 — Tải tệp JD
          </h3>
          <p
            className="text-[11px] leading-snug text-[var(--app-text-muted)]"
            id="jd-upload-hint"
          >
            Chỉ lưu tên file trên trình duyệt. Phân tích AI chạy nội bộ — chưa tải file lên máy chủ.
          </p>
        </div>
        <div
          className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3"
          role="group"
          aria-labelledby="jd-upload-heading"
          aria-describedby="jd-upload-hint"
          aria-busy={isParsing}
        >
          <div
            className={
              "focus-within:ring-2 focus-within:ring-[var(--app-primary)]/25 focus-within:ring-offset-1 focus-within:ring-offset-white dark:focus-within:ring-offset-zinc-900/40 " +
              "flex min-w-0 flex-1 flex-col justify-center gap-1.5 rounded-lg border-2 border-dashed px-2.5 py-1.5 transition sm:flex-row sm:items-center sm:gap-2.5 sm:py-1.5 " +
              (isDragging
                ? "border-[var(--app-primary)] bg-blue-50/60 dark:bg-blue-950/30"
                : "border-zinc-200/95 bg-zinc-50/50 dark:border-zinc-600/80 dark:bg-zinc-900/20")
            }
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            aria-label="Vùng kéo thả tệp JD, hoặc dùng nút chọn file"
          >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1.5 sm:gap-2">
              <span
                className="shrink-0 text-xs text-zinc-600 dark:text-zinc-400"
                aria-hidden
                title="Kéo thả PDF hoặc Word (tối đa 10MB) vào vùng này"
              >
                Kéo thả hoặc
              </span>
              <label className="app-btn app-btn-secondary app-btn-sm cursor-pointer shrink-0">
                Chọn file
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => onFilePick(e.target.files?.[0] ?? null)}
                />
              </label>
              <span className="hidden h-3 w-px bg-zinc-200 dark:bg-zinc-600 sm:inline" aria-hidden />
              <span
                className="min-w-0 flex-1 truncate text-left text-xs text-zinc-500 dark:text-zinc-500"
                title={fileName ?? undefined}
              >
                {fileName ? (
                  <span className="text-zinc-700 dark:text-zinc-300">
                    <span className="font-medium text-emerald-700 dark:text-emerald-400" title="Đã chọn tệp">
                      ✓{" "}
                    </span>
                    {fileName}
                  </span>
                ) : (
                  <span className="italic">Chưa chọn tệp</span>
                )}
              </span>
            </div>
            <p
              className="text-[10px] leading-tight text-zinc-500 dark:text-zinc-500 sm:ml-auto sm:shrink-0 sm:pl-1 sm:text-right"
              title="Chấp nhận PDF, Word, tối đa 10MB"
            >
              .pdf, .doc, .docx · ≤10MB
            </p>
          </div>
          <div className="flex w-full min-w-0 shrink-0 flex-col sm:w-[11.5rem] sm:justify-center">
            <button
              type="button"
              onClick={onParse}
              disabled={isParsing}
              className="app-btn app-btn-primary inline-flex w-full items-center justify-center gap-2 disabled:pointer-events-none disabled:opacity-75"
              title="Có thể bấm khi chưa chọn file — dùng bộ gợi ý sẵn. Không tải file lên máy chủ."
            >
              {isParsing && (
                <span className="inline-flex shrink-0" aria-hidden>
                  <svg
                    className="h-4 w-4 animate-spin text-white/90"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </span>
              )}
              {isParsing ? "Đang phân tích…" : "Phân tích JD (AI)"}
            </button>
            <p
              className="mt-1 text-center text-[10px] leading-tight sm:text-left"
              aria-live="polite"
            >
              {isParsing ? (
                <span className="text-blue-600 dark:text-blue-400">
                  Đang phân tích — soạn gợi ý mô tả, yêu cầu…
                </span>
              ) : (
                <span className="text-zinc-500">Bấm sau khi chọn file, hoặc dùng mẫu nếu chưa chọn.</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Form nội dung — toàn chiều ngang, bên dưới upload */}
      <div className="flex min-w-0 flex-col bg-slate-50/50 dark:bg-zinc-950/30">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-zinc-100/90 px-4 py-3 dark:border-zinc-800/80">
            <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
              Bước 2 — Nội dung tin tuyển
            </h3>
            <p className="mt-1 text-xs text-[var(--app-text-muted)]">
              特定技能 — chỉnh sửa trước khi đăng. Nội dung từ AI mang tính gợi ý, cần rà soát.
            </p>
            {parseTick > 0 && (
              <p
                className="mt-2 text-xs text-emerald-700 dark:text-emerald-300"
                role="status"
              >
                Đã áp dụng kết quả phân tích lần {parseTick} — kiểm tra lại trước khi đăng.
              </p>
            )}
            {posted && (
              <p
                className="mt-2 rounded-lg border border-emerald-200/80 bg-emerald-50/90 px-3 py-2 text-xs text-emerald-900 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-200"
                role="status"
              >
                Đã gửi bản ghi duyệt nội bộ. Cập nhật sẽ hiển thị tại &quot;Tin bạn quản lý&quot; sau khi
                đồng bộ hệ thống.
              </p>
            )}
          </div>
          <div className="max-h-[min(70dvh,48rem)] space-y-3 overflow-y-auto px-4 py-4">
            <Field label="職名 / Tiêu đề tin" required>
              <input
                className="app-input w-full"
                value={form.title}
                onChange={(e) => setForm(updateField("title", e.target.value))}
                placeholder="Ví dụ: 特定技能 建設 — …"
                required
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="分野 / Ngành" required>
                <input
                  className="app-input w-full"
                  value={form.industry}
                  onChange={(e) => setForm(updateField("industry", e.target.value))}
                  placeholder="建設, 食料品製造…"
                />
              </Field>
              <Field label="勤務地 / Địa điểm" required>
                <input
                  className="app-input w-full"
                  value={form.city}
                  onChange={(e) => setForm(updateField("city", e.target.value))}
                />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="給与 / Lương">
                <input
                  className="app-input w-full"
                  value={form.salary}
                  onChange={(e) => setForm(updateField("salary", e.target.value))}
                />
              </Field>
              <Field label="雇用形態">
                <input
                  className="app-input w-full"
                  value={form.workType}
                  onChange={(e) => setForm(updateField("workType", e.target.value))}
                />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="JLPT yêu cầu">
                <select
                  className="app-input w-full"
                  value={form.requiredJlpt}
                  onChange={(e) => setForm(updateField("requiredJlpt", e.target.value))}
                >
                  {jlptOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Hoa hồng B2B (%)">
                <input
                  className="app-input w-full"
                  value={form.shareCommission}
                  onChange={(e) => setForm(updateField("shareCommission", e.target.value))}
                  placeholder="12%"
                />
              </Field>
            </div>
            <Field label="業務内容 / Mô tả công việc">
              <textarea
                className="app-input min-h-[88px] w-full resize-y"
                value={form.workContent}
                onChange={(e) => setForm(updateField("workContent", e.target.value))}
                rows={4}
              />
            </Field>
            <Field label="応募条件 / Yêu cầu (mỗi dòng hoặc ngắt đoạn)">
              <textarea
                className="app-input min-h-[100px] w-full resize-y font-mono text-xs"
                value={form.requirements}
                onChange={(e) => setForm(updateField("requirements", e.target.value))}
                rows={5}
                placeholder="Mỗi dòng một điều kiện…"
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="勤務時間">
                <textarea
                  className="app-input min-h-[72px] w-full resize-y text-sm"
                  value={form.workHours}
                  onChange={(e) => setForm(updateField("workHours", e.target.value))}
                  rows={3}
                />
              </Field>
              <Field label="福利厚生 / Phúc lợi">
                <textarea
                  className="app-input min-h-[72px] w-full resize-y text-sm"
                  value={form.benefits}
                  onChange={(e) => setForm(updateField("benefits", e.target.value))}
                  rows={3}
                />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="採用人数">
                <input
                  className="app-input w-full"
                  value={form.headcount}
                  onChange={(e) => setForm(updateField("headcount", e.target.value))}
                />
              </Field>
              <Field label="試用期間 / Thử việc">
                <input
                  className="app-input w-full"
                  value={form.trialPeriod}
                  onChange={(e) => setForm(updateField("trialPeriod", e.target.value))}
                />
              </Field>
            </div>
            <Field label="Ghi chú nội bộ / 備考 (không bắt buộc)">
              <textarea
                className="app-input min-h-[60px] w-full resize-y text-sm"
                value={form.notes}
                onChange={(e) => setForm(updateField("notes", e.target.value))}
                rows={2}
              />
            </Field>
          </div>
          <div className="shrink-0 border-t border-zinc-100 px-4 py-3 dark:border-zinc-800/80">
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="app-btn app-btn-primary app-btn-sm">
                Đăng tin
              </button>
              <button
                type="button"
                className="app-btn app-btn-secondary app-btn-sm"
                onClick={() => {
                  setForm(emptyJdForm());
                  setFileName(null);
                  setPosted(false);
                  setParseTick(0);
                }}
              >
                Xóa form
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  required: req,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-300">
        {label}
        {req && <span className="text-rose-600 dark:text-rose-400"> *</span>}
      </label>
      {children}
    </div>
  );
}
