import { Card } from "@/components/ui/Card";

export default function HotlinePage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">サポート窓口</h1>
      <Card>
        <p className="text-sm text-zinc-800 dark:text-zinc-200">
          窓口: <span className="font-mono">0123-456-789</span>（平日
          9:00–18:00 · プレースホルダー）
        </p>
      </Card>
    </div>
  );
}
