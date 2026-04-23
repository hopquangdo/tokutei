import { getSession } from "@/lib/auth/session";
import { applications, getCandidate } from "@/lib/mock/seed";
import { ProfileLegalUploadCard } from "./ProfileLegalUploadCard";

const docSurface =
  "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] p-4 shadow-[var(--app-shadow-card)] dark:border-zinc-800/80 dark:bg-zinc-900/50";

const kv = "grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2";

export default async function ProfilePage() {
  const session = await getSession();
  const email = session?.email ?? "ungvien@willtec.local";
  const displayName = "Đỗ Hợp";
  const cand = getCandidate("c1");
  const mine = applications.filter((a) => a.candidateId === "c1");
  const appCount = mine.length;
  const upcomingIv = 1;

  return (
    <div className="app-page-body relative w-full pb-20">
      <h1 className="sr-only">Hồ sơ ứng viên</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="space-y-6 lg:col-span-8">
          <div className="grid gap-4 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className={docSurface}>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold text-white shadow">
                    {displayName.charAt(0)}
                  </div>
                  <h2 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {displayName}
                  </h2>
                  <p className="mt-0.5 break-all text-xs text-zinc-500 dark:text-zinc-400">
                    {email}
                  </p>
                  <div className="mt-4 flex w-full justify-center gap-6 border-t border-zinc-100 pt-4 text-center dark:border-zinc-800/80">
                    <div>
                      <p className="text-2xl font-bold tabular-nums text-blue-700 dark:text-blue-400">
                        {appCount}
                      </p>
                      <p className="text-[11px] text-zinc-500">Ứng tuyển</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold tabular-nums text-blue-700 dark:text-blue-400">
                        {upcomingIv}
                      </p>
                      <p className="text-[11px] text-zinc-500">PV sắp tới</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-8">
              <div className={docSurface}>
                <h3 className="border-b border-zinc-100 pb-2 text-sm font-semibold text-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100">
                  Thông tin cá nhân
                </h3>
                <dl className={`${kv} mt-4`}>
                  <D label="Email" value={email} full />
                  <D label="Giới tính" value="—" />
                  <D label="Ngày sinh" value="12/03/2005" />
                  <D label="Số điện thoại" value="0969994310" />
                  <D label="Quốc tịch" value={cand ? countryVi(cand.country) : "—"} />
                  <D label="JLPT" value={cand?.jlpt ?? "—"} />
                  <D label="Tư cách lưu trú" value={cand ? visaLabel(cand.visaCategory) : "—"} />
                  <D label="Trạng thái hồ sơ" value={cand?.legalOk ? "Đạt yêu cầu" : "Cần bổ sung"} />
                  <D label="Đăng ký" value="01/2026" />
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <ProfileLegalUploadCard />

          <div className={docSurface}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Tài liệu đính kèm</h3>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">+ Thêm file</span>
            </div>
            <ul className="space-y-2">
              {(
                [
                  { n: "在留カード_表.pdf", t: "PDF", sub: "Đã xác minh" },
                  { n: "指定書_建設_2024.pdf", t: "PDF", sub: "Cần ảnh rõ" },
                  { n: "CV_ja.docx", t: "DOC", sub: "Đã tải" },
                ] as const
              ).map((f) => (
                <li
                  key={f.n}
                  className="flex items-center justify-between gap-2 rounded-lg border border-zinc-100 bg-zinc-50/80 px-3 py-2 text-sm dark:border-zinc-800/60 dark:bg-zinc-800/30"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-800 dark:text-zinc-200">{f.n}</p>
                    <p className="text-xs text-zinc-500">
                      {f.t} · {f.sub}
                    </p>
                  </div>
                  <span className="shrink-0 text-zinc-400" aria-hidden>
                    ↓
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-zinc-900 shadow-lg transition hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400"
        aria-label="Hỗ trợ / chat"
      >
        <ChatBubbleIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

function D({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">{value}</dd>
    </div>
  );
}

function countryVi(code: string) {
  if (code === "VN") return "Việt Nam";
  return code;
}

function visaLabel(code: string) {
  if (code === "tokutei_1") return "特定技能1号";
  if (code === "tokutei_2") return "特定技能2号";
  return code;
}

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 4h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
