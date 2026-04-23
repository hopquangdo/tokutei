"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export function ProfileLegalUploadCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (uploadTimer.current) {
        clearTimeout(uploadTimer.current);
        uploadTimer.current = null;
      }
    };
  }, []);

  const runUpload = useCallback((names: string[]) => {
    if (uploadTimer.current) {
      clearTimeout(uploadTimer.current);
      uploadTimer.current = null;
    }
    if (names.length === 0) {
      setStatus("idle");
      setErrorDetail(null);
      return;
    }
    setStatus("uploading");
    setErrorDetail(null);
    uploadTimer.current = setTimeout(() => {
      uploadTimer.current = null;
      const ok = Math.random() > 0.25;
      if (ok) {
        setStatus("success");
        setErrorDetail(null);
      } else {
        setStatus("error");
        setErrorDetail("Không tải được tệp. Thử lại với tệp khác hoặc định dạng được hỗ trợ.");
      }
    }, 1400);
  }, []);

  const onFilesPicked = (list: FileList | null) => {
    if (!list?.length) {
      setFileNames([]);
      setStatus("idle");
      setErrorDetail(null);
      return;
    }
    const names = Array.from(list, (f) => f.name);
    setFileNames(names);
    runUpload(names);
  };

  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Tải tài liệu pháp lý
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Tải lên tài liệu như{" "}
        <span className="font-medium text-zinc-800 dark:text-zinc-200">Thẻ cư trú</span>,{" "}
        <span className="font-medium text-zinc-800 dark:text-zinc-200">Hộ chiếu</span>,{" "}
        <span className="font-medium text-zinc-800 dark:text-zinc-200">Tờ chỉ định (指定書)</span> — ảnh
        hoặc PDF.
      </p>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept="image/jpeg,image/png,image/webp,.pdf,application/pdf"
        multiple
        onChange={(e) => onFilesPicked(e.target.files)}
      />
      <div className="mt-4">
        {status === "success" && (
          <p
            role="status"
            className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-200"
          >
            <CheckIcon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Đã tải tài liệu thành công.</span>
          </p>
        )}
        {status === "error" && (
          <p
            role="alert"
            className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-900 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-200"
          >
            <CloseIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{errorDetail ?? "Tải lên thất bại. Vui lòng thử lại."}</span>
          </p>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            onFilesPicked(e.dataTransfer.files);
          }}
          disabled={status === "uploading"}
          className={[
            "w-full rounded-xl border-2 border-dashed px-4 py-8 text-center transition",
            isDragging
              ? "border-blue-500 bg-blue-100/80 dark:border-blue-400 dark:bg-blue-950/40"
              : "border-blue-200 bg-blue-50/60 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-500/30 dark:bg-blue-950/20 dark:hover:border-blue-500/50",
            status === "uploading" ? "cursor-wait opacity-80" : "cursor-pointer",
          ].join(" ")}
        >
          {status === "uploading" ? (
            <span className="inline-flex flex-col items-center gap-2">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Đang tải lên…</span>
            </span>
          ) : (
            <>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                <UploadIcon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-medium text-blue-800 dark:text-blue-200">
                Chọn file hoặc kéo thả vào đây
              </p>
              <p className="mt-1 text-xs text-zinc-500">Ảnh hoặc PDF — có thể chọn nhiều file</p>
            </>
          )}
        </button>
        {fileNames.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            {fileNames.map((n) => (
              <li key={n} className="truncate rounded border border-zinc-100 bg-white px-2 py-1 dark:border-zinc-700 dark:bg-zinc-800/50">
                {n}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-center text-[11px] text-zinc-500">
          Tệp được xử lý nội bộ trước khi đồng bộ máy chủ.
        </p>
      </div>
    </div>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-6-3 3-3m0 0 3-3m-3 3h-6m6-3-3-3" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
