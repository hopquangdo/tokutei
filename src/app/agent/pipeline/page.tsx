import { PipelineBoardClient } from "./PipelineBoardClient";

export default function PipelinePage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">採用パイプライン（登録支援機関）</h1>
      <PipelineBoardClient />
    </div>
  );
}
