import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  eyebrow,
  action,
  children,
  className,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-slate-50/80 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#0c0c10]/80 p-5 sm:p-6",
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
