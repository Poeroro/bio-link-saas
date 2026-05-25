import type { LucideIcon } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "slate",
}: {
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  tone?: "slate" | "emerald" | "sky" | "rose";
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
            {formatNumber(value)}
          </p>
        </div>
        <div
          className={cn(
            "grid size-11 place-items-center rounded-2xl",
            tone === "slate" && "bg-slate-100 text-slate-950 dark:bg-white/10 dark:text-white",
            tone === "emerald" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-200",
            tone === "sky" && "bg-sky-100 text-sky-700 dark:bg-sky-400/12 dark:text-sky-200",
            tone === "rose" && "bg-rose-100 text-rose-700 dark:bg-rose-400/12 dark:text-rose-200",
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500 dark:text-zinc-400">{detail}</p>
    </div>
  );
}
