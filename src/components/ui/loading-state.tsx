export function LoadingState({ label = "Memuat workspace" }: { label?: string }) {
  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-zinc-950">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/8 dark:border-white/10 dark:bg-white/7">
          <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-white/15" />
          <div className="mt-6 space-y-3">
            <div className="h-12 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/10" />
            <div className="h-12 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/10" />
            <div className="h-12 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/10" />
          </div>
          <p className="mt-5 text-sm font-medium text-slate-500 dark:text-zinc-400">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
