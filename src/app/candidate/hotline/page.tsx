import { Card } from "@/components/ui/Card";

export default function HotlinePage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">Hotline hỗ trợ</h1>
      <Card>
        <p className="text-sm text-zinc-800 dark:text-zinc-200">
          Hotline: <span className="font-mono">0123-456-789</span> (giờ hành
          chính, placeholder)
        </p>
      </Card>
    </div>
  );
}
