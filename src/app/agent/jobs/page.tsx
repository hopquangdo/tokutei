import { JdParseClient } from "./JdParseClient";

export default function AgentJobsPage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">Job &amp; AI JD</h1>

      <section className="min-w-0" aria-labelledby="section-jd-workflow">
        <JdParseClient />
      </section>
    </div>
  );
}
