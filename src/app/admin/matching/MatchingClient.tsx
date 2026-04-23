"use client";

import { useState } from "react";
import { simulateMatching } from "@/lib/mock/ai-demo";
import { Card } from "@/components/ui/Card";

export function MatchingClient() {
  const [jlpt, setJlpt] = useState("N4");
  const [field, setField] = useState("建設");
  const [r, setR] = useState<ReturnType<typeof simulateMatching> | null>(null);
  return (
    <Card>
      <p className="text-xs text-zinc-500">
        Thuật toán: kỹ năng, JLPT, CQI (Culture fit) — ưu tiên ứng viên gắn bó tổ chức.
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-3 text-sm">
        <label className="flex flex-col gap-0.5">
          <span className="text-xs text-zinc-500">JLPT</span>
          <select
            value={jlpt}
            onChange={(e) => setJlpt(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900/50"
          >
            {["N5", "N4", "N3", "N2", "N1"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="flex min-w-[120px] flex-1 flex-col gap-0.5">
          <span className="text-xs text-zinc-500">分野</span>
          <input
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900/50"
          />
        </label>
        <button
          type="button"
          onClick={() => setR(simulateMatching({ jlpt, field }))}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Gợi ý từ hệ thống
        </button>
      </div>
      {r && (
        <ul className="mt-4 space-y-3 text-sm">
          {r.map((x) => (
            <li
              key={x.name}
              className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 dark:border-blue-500/30"
            >
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {x.name} — {x.score} điểm
              </p>
              <ul className="mt-1 list-inside list-disc text-xs text-zinc-600 dark:text-zinc-400">
                {x.reasons.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
