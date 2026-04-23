import { CvBuilderClient } from "./CvBuilderClient";

export default function CvBuilderPage() {
  return (
    <div className="app-page-body flex h-full min-h-0 w-full min-w-0 max-w-full flex-1 flex-col">
      <h1 className="sr-only">AI CV Builder</h1>
      <div className="min-h-0 flex-1">
        <CvBuilderClient />
      </div>
    </div>
  );
}
