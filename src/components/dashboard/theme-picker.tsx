"use client";

import { Check } from "lucide-react";
import { BIO_THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { SectionCard } from "@/components/ui/section-card";

export function ThemePicker({
  activeThemeId,
  onSelect,
}: {
  activeThemeId: string;
  onSelect: (themeId: string) => void;
}) {
  return (
    <SectionCard title="Template Tema" eyebrow="Visual system">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {BIO_THEMES.map((theme) => {
          const isActive = activeThemeId === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelect(theme.id)}
              className={cn(
                "group rounded-3xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg",
                isActive
                  ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                  : "border-slate-200 bg-white text-slate-950 dark:border-white/10 dark:bg-white/7 dark:text-white",
              )}
            >
              <div className={cn("h-24 rounded-2xl bg-gradient-to-br", theme.preview)} />
              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">{theme.name}</p>
                  <p
                    className={cn(
                      "mt-1 text-xs leading-5",
                      isActive ? "text-white/70 dark:text-slate-600" : "text-slate-500 dark:text-zinc-400",
                    )}
                  >
                    {theme.description}
                  </p>
                </div>
                {isActive ? (
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
                    <Check className="size-4" />
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}
