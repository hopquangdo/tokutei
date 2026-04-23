"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { LegalStatus } from "@/lib/types";
import {
  simulateMismatchOcr,
  simulateOcrAndRules,
  type SimulatedOcr,
} from "@/lib/mock/ai-demo";

const bannerToLegal: Record<SimulatedOcr["banner"], LegalStatus> = {
  ok: "ok",
  warning: "warning",
  reject: "reject",
};

export function OcrClient() {
  const [r, setR] = useState<SimulatedOcr | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setR(simulateOcrAndRules())}
          className="app-btn app-btn-primary app-btn-sm"
        >
          Hợp lệ
        </button>
        <button
          type="button"
          onClick={() => setR(simulateMismatchOcr())}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-300/80 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100/90 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-950/60"
        >
          Cảnh báo
        </button>
      </div>
      {r && (
        <div className="space-y-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] p-4 shadow-[var(--app-shadow-card)] dark:border-zinc-800/80 dark:bg-zinc-900/50">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={bannerToLegal[r.banner]} />
            <span className="text-sm text-zinc-500">
              Độ tin cậy ước lượng: {Math.round(r.confidence * 100)}%
            </span>
          </div>
          <section>
            <h3 className="text-xs font-semibold uppercase text-zinc-500">
              Thẻ cư trú
            </h3>
            <dl className="mt-1 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
              <D k="Số thẻ" v={r.residence.cardNo} />
              <D k="Hết hạn" v={r.residence.expiry} />
              <D k="Tư cách" v={r.residence.zairyu} />
              <D k="Ghi chú" v={r.residence.statusText} />
            </dl>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase text-zinc-500">
              指定書 (Shiteisho)
            </h3>
            <dl className="mt-1 grid gap-1 text-sm sm:grid-cols-2">
              <D k="所属機関" v={r.shiteisho.org} />
              <D k="Nội dung/分野" v={r.shiteisho.field} />
              <D k="Ngày cấp" v={r.shiteisho.issued} />
            </dl>
          </section>
          <p className="text-xs text-zinc-500">
            Đối soát:{" "}
            {r.crossCheck === "match" ? "khớp" : "cần xem lại / không khớp"}
          </p>
          <ul className="list-inside list-disc text-xs text-zinc-600 dark:text-zinc-400">
            {r.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function D({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-zinc-500">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
