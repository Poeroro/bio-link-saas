import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon: Icon = Sparkles,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center dark:border-white/12 dark:bg-white/5">
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-slate-950 shadow-sm dark:bg-white/10 dark:text-white">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-zinc-300">
        {description}
      </p>
    </div>
  );
}
