import { candidates } from "@/lib/mock/seed";
import { AgentCandidatesClient } from "./AgentCandidatesClient";

export default function AgentCandidates() {
  const mine = candidates.filter((c) => c.agentId === "a1");

  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">自社候補者プール</h1>
      <AgentCandidatesClient initial={mine} />
    </div>
  );
}
