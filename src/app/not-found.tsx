import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-lg text-center">
        <div className="relative mx-auto mb-8 h-48 w-48">
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 dark:from-violet-500/10 dark:to-fuchsia-500/10" />
          <div className="absolute inset-4 animate-bounce rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/40 dark:to-fuchsia-900/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-6xl font-bold bg-gradient-to-br from-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">
              404
            </span>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/7">
          <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">
            Page not found
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-zinc-300">
            The page you are looking for does not exist or has been moved.
            Try searching for a username instead.
          </p>

          <div className="mt-6">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <svg
                className="size-4 shrink-0 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-sm text-slate-400">
                Try &nbsp;/u/username&nbsp; to find a bio page
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-xl hover:shadow-violet-500/30"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
              />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
