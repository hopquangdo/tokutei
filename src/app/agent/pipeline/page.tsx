import { PipelineBoardClient } from "./PipelineBoardClient";

export default function PipelinePage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">Pipeline tuyển dụng (Agent)</h1>
      <PipelineBoardClient />
    </div>
  );
}
