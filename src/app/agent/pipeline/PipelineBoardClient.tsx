"use client";

import { useCallback, useMemo, useState } from "react";
import { applications as seedApplications, getCandidate, getJob } from "@/lib/mock/seed";
import { PIPELINE_STAGE_LABEL_JA } from "@/lib/mock/platform-dashboard-data";
import type { Application, ApplicationClosedReason, PipelineStage } from "@/lib/types";
import { Card } from "@/components/ui/Card";

const OPEN_STAGES: PipelineStage[] = [
  "screening",
  "interview",
  "offer",
  "visa",
  "onboarded",
];

const DROP_STAGE = "stage" as const;
const DROP_REJECTED = "rejected" as const;
const DROP_WITHDRAWN = "withdrawn" as const;

export function PipelineBoardClient() {
  const [apps, setApps] = useState<Application[]>(() => [...seedApplications]);

  const byOpenStage = useCallback(
    (st: PipelineStage) => apps.filter((a) => a.stage === st && !a.closed),
    [apps]
  );
  const rejected = useMemo(
    () => apps.filter((a) => a.closed === "rejected"),
    [apps]
  );
  const withdrawn = useMemo(
    () => apps.filter((a) => a.closed === "withdrawn"),
    [apps]
  );

  const setClosed = useCallback((id: string, reason: ApplicationClosedReason) => {
    setApps((rows) =>
      rows.map((a) =>
        a.id === id
          ? {
              ...a,
              closed: reason,
              closedNote:
                reason === "rejected"
                  ? "パイプラインで不採用"
                  : "パイプラインから取り下げ",
            }
          : a
      )
    );
  }, []);

  const moveToStage = useCallback((id: string, stage: PipelineStage) => {
    setApps((rows) =>
      rows.map((a) =>
        a.id === id
          ? { ...a, stage, closed: undefined, closedNote: undefined }
          : a
      )
    );
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent, zone: "stage" | "rejected" | "withdrawn", stage?: PipelineStage) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("applicationId");
      if (!id) return;
      if (zone === DROP_STAGE && stage) moveToStage(id, stage);
      if (zone === DROP_REJECTED) setClosed(id, "rejected");
      if (zone === DROP_WITHDRAWN) setClosed(id, "withdrawn");
    },
    [moveToStage, setClosed]
  );

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div>
      <h2 className="sr-only">段階別カンバン</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {OPEN_STAGES.map((st) => {
          const items = byOpenStage(st);
          return (
            <div
              key={st}
              className="min-h-0"
              onDragOver={allowDrop}
              onDrop={(e) => onDrop(e, DROP_STAGE, st)}
            >
              <Card
                className="flex min-h-[200px] flex-col border-t-4 border-t-[var(--app-primary)]"
                padding="p-3"
              >
                <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800/80">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-zinc-100">
                    {PIPELINE_STAGE_LABEL_JA[st]}
                  </h3>
                  <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {items.length}
                  </span>
                </div>
                <ul className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto">
                  {items.length === 0 ? (
                    <li className="rounded-lg border border-dashed border-zinc-200/80 p-3 text-center text-[11px] text-zinc-400 dark:border-zinc-700/60">
                      空です — 応募をここにドロップ
                    </li>
                  ) : (
                    items.map((a) => (
                      <PipelineCard
                        key={a.id}
                        application={a}
                        onReject={() => setClosed(a.id, "rejected")}
                        onWithdraw={() => setClosed(a.id, "withdrawn")}
                      />
                    ))
                  )}
                </ul>
              </Card>
            </div>
          );
        })}
      </div>

      <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        終了した応募
      </h3>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div onDragOver={allowDrop} onDrop={(e) => onDrop(e, DROP_REJECTED)}>
          <Card className="flex min-h-[160px] flex-col border-t-4 border-t-rose-500" padding="p-3">
            <div className="flex items-center justify-between gap-2 border-b border-rose-100 pb-2 dark:border-rose-900/50">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-rose-800 dark:text-rose-200">
                不採用
              </h3>
              <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-rose-800 dark:bg-rose-900/50 dark:text-rose-200">
                {rejected.length}
              </span>
            </div>
            <ul className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto">
              {rejected.length === 0 ? (
                <li className="rounded-lg border border-dashed border-rose-200/60 p-3 text-center text-[11px] text-rose-300 dark:border-rose-800/50">
                  まだありません —「不採用」ボタンまたは列へドロップ
                </li>
              ) : (
                rejected.map((a) => <ClosedCard key={a.id} application={a} />)
              )}
            </ul>
          </Card>
        </div>
        <div onDragOver={allowDrop} onDrop={(e) => onDrop(e, DROP_WITHDRAWN)}>
          <Card className="flex min-h-[160px] flex-col border-t-4 border-t-amber-500" padding="p-3">
            <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-2 dark:border-amber-900/50">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-200">
                取り下げ
              </h3>
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-amber-900 dark:bg-amber-900/30 dark:text-amber-100">
                {withdrawn.length}
              </span>
            </div>
            <ul className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto">
              {withdrawn.length === 0 ? (
                <li className="rounded-lg border border-dashed border-amber-200/60 p-3 text-center text-[11px] text-amber-300 dark:border-amber-800/50">
                  まだありません —「取り下げ」ボタンまたは列へドロップ
                </li>
              ) : (
                withdrawn.map((a) => <ClosedCard key={a.id} application={a} />)
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PipelineCard({
  application: a,
  onReject,
  onWithdraw,
}: {
  application: Application;
  onReject: () => void;
  onWithdraw: () => void;
}) {
  const c = getCandidate(a.candidateId);
  const j = getJob(a.jobId);
  if (!c || !j) return null;
  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("applicationId", a.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="cursor-grab rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-2 text-xs shadow-sm active:cursor-grabbing dark:border-zinc-700/60 dark:bg-zinc-900/40"
    >
      <p className="font-medium text-zinc-900 dark:text-zinc-100">{c.name}</p>
      <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-zinc-500">{j.title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={onReject}
          className="rounded-md border border-rose-200/90 bg-rose-50/90 px-2 py-0.5 text-[10px] font-medium text-rose-800 transition hover:bg-rose-100 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-200"
        >
          不採用
        </button>
        <button
          type="button"
          onClick={onWithdraw}
          className="rounded-md border border-amber-200/90 bg-amber-50/90 px-2 py-0.5 text-[10px] font-medium text-amber-900 transition hover:bg-amber-100/90 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-100"
        >
          取下
        </button>
      </div>
    </li>
  );
}

function ClosedCard({ application: a }: { application: Application }) {
  const c = getCandidate(a.candidateId);
  const j = getJob(a.jobId);
  if (!c || !j) return null;
  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("applicationId", a.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="cursor-grab rounded-lg border border-zinc-200/80 bg-zinc-50/90 p-2 text-xs active:cursor-grabbing dark:border-zinc-700/60 dark:bg-zinc-800/40"
    >
      <p className="font-medium text-zinc-900 dark:text-zinc-100">{c.name}</p>
      <p className="mt-0.5 line-clamp-2 text-[10px] text-zinc-500">{j.title}</p>
      <p className="mt-1 text-[10px] text-zinc-500">
        終了段階: {PIPELINE_STAGE_LABEL_JA[a.stage]}
        {a.closedNote ? ` · ${a.closedNote}` : ""}
      </p>
      <p className="mt-1.5 text-[9px] font-medium text-zinc-400">
        オープン段階の列に戻すと再開できます
      </p>
    </li>
  );
}
