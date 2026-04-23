import { OcrClient } from "./OcrClient";

export default function OcrPage() {
  return (
    <div className="app-page-body w-full min-w-0 space-y-6">
      <h1 className="sr-only">OCR ＆ 法務書類</h1>
      <OcrClient />
    </div>
  );
}
