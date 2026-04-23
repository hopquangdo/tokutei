import { notFound } from "next/navigation";
import { JobPostingDetailView } from "@/components/jobs/JobPostingDetailView";
import { candidates, getAgent, getJob } from "@/lib/mock/seed";

type PageProps = {
  params: Promise<{ jobId: string }>;
};

export default async function AgentMarketplaceJobDetailPage({ params }: PageProps) {
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) notFound();

  const ownerName = getAgent(job.ownerAgentId)?.name ?? "採用元";
  const suggested = candidates
    .filter((c) => c.legalOk)
    .sort((a, b) => b.cqiScore - a.cqiScore);

  return (
    <JobPostingDetailView
      job={job}
      ownerName={ownerName}
      mode="agent"
      backHref="/agent/marketplace"
      backLabel="マーケットに戻る"
      suggestedCandidates={suggested}
      stickyPrimaryPanel
    />
  );
}
