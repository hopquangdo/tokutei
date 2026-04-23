import { notFound } from "next/navigation";
import { JobPostingDetailView } from "@/components/jobs/JobPostingDetailView";
import { getAgent, getJob } from "@/lib/mock/seed";

type PageProps = {
  params: Promise<{ jobId: string }>;
};

export default async function CandidateJobDetailPage({ params }: PageProps) {
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) notFound();

  const ownerName = getAgent(job.ownerAgentId)?.name ?? "採用元";

  return (
    <JobPostingDetailView
      job={job}
      ownerName={ownerName}
      mode="candidate"
      backHref="/candidate/jobs"
      backLabel="求人一覧に戻る"
    />
  );
}
