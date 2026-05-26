"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("[LinkPilot Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/15">
          <AlertTriangle className="size-8 text-rose-600 dark:text-rose-400" />
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-zinc-500">
            LinkPilot
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-zinc-300">
            An unexpected error occurred. You can try again or head back home.
          </p>

          {/* Error details toggle */}
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            {showDetails ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            {showDetails ? "Hide" : "Show"} error details
          </button>

          {showDetails && (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-left dark:border-rose-500/20 dark:bg-rose-500/5">
              <p className="break-all font-mono text-xs text-rose-700 dark:text-rose-300">
                {error.message || "Unknown error"}
              </p>
              {error.digest && (
                <p className="mt-2 font-mono text-xs text-rose-500/70">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-xl hover:shadow-violet-500/30"
            >
              <RefreshCw className="size-4" />
              Try again
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              <Home className="size-4" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
