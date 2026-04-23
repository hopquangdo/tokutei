/**
 * Tràn nền trắng, bỏ nền xám của vùng main; chiều cao gần bằng khung nhìn (trừ header + padding shell).
 */
export default function CvBuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        "relative -mx-[var(--app-content-pad)] -mt-6 -mb-6 flex w-[calc(100%+2*var(--app-content-pad))] min-w-0 max-w-none flex-1 flex-col",
        "bg-white px-[var(--app-content-pad)] pb-6 pt-0 dark:bg-zinc-950",
        "min-h-[calc(100dvh-3.5rem-1.5rem)] sm:-mt-8 sm:pb-8",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
