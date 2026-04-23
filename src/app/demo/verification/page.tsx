import Link from "next/link";
import { Card } from "@/components/ui/Card";

const steps = [
  {
    title: "Bước 1 — Trích xuất (AI OCR)",
    body: `Thẻ 在留: 12 ký tự, tư cách, hết hạn, địa chỉ. 指定書: 所属機関, 分野, 付与日. CV: lịch sử làm việc phục vụ đối soát (tải file theo hướng dẫn màn hình OCR).`,
  },
  {
    title: "Bước 2 — Tra cứu trạng thái thực (App automation)",
    body: `Luồng tự động mở ứng dụng Cục xuất nhập cảnh, nhập số thẻ và hạn. Nếu ロック/不存在 → hiển thị từ chối ngay. Màn AI OCR phản ánh trạng thái “有効” sau khi tra cứu.`,
  },
  {
    title: "Bước 3 — Đối soát chéo (Logic)",
    body: `So khớp ngành Job vs 指定書 (vàng nếu lệch). Công ty & thôi việc. Ảnh mặt thẻ vs 指定書 (nghi vấn giả mạo) — tài liệu chi tiết (2).`,
  },
  {
    title: "Bước 4 — Bảng kết quả Agent",
    body: `Trạng thái thẻ, tư cách ngành nghề, confidence %, màu xanh/đỏ. Xem bản chạy tại Ứng viên → AI OCR.`,
  },
] as const;

export default function VerificationDocsPage() {
  return (
    <div className="app-page-body w-full min-w-0">
      <h1 className="sr-only">Quy trình xác thực pháp lý tự động (60 giây)</h1>
      <p className="sr-only">
        Tài liệu quy trình Willtec Tokutei. Tải lên: CV + 在留 + 指定書 (Shiteisho) — 4 bước. Thực hiện
        tại Ứng viên → AI OCR.
      </p>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s.title} className="list-none">
            <Card className="border-l-4 border-l-blue-500/50">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {i + 1}. {s.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {s.body}
              </p>
            </Card>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm">
        <Link
          className="font-medium text-blue-700 hover:underline dark:text-blue-400"
          href="/"
        >
          ← Về trang chủ
        </Link>
        {" "}
        <Link
          className="app-link"
          href="/login?next=%2Fcandidate%2Focr"
        >
          Ứng viên → OCR
        </Link>
      </p>
    </div>
  );
}
