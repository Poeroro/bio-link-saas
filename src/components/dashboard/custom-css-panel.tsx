"use client";

import { useState } from "react";
import { Code2, Save, Eye } from "lucide-react";
import { SectionCard } from "@/components/ui/section-card";
import { useBioApp } from "@/components/providers/app-provider";

export function CustomCssPanel() {
  const { currentUser, updateProfile, addToast } = useBioApp();
  const [css, setCss] = useState(currentUser?.customCss ?? "");

  if (!currentUser) return null;

  const handleSave = () => {
    updateProfile({ customCss: css });
    addToast({ title: "Custom CSS saved", tone: "success" });
  };

  const hasChanges = css !== (currentUser.customCss ?? "");

  return (
    <SectionCard
      title="Custom CSS"
      eyebrow="Advanced"
      action={
        <div className="flex items-center gap-2">
          {css.trim() && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              <Eye className="size-3" />
              Preview active
            </span>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-3">
            <Code2 className="size-4 text-slate-400" />
          </div>
          <textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            placeholder={`/* Add custom CSS here */\n.bio-page {\n  background: linear-gradient(...);\n}`}
            spellCheck={false}
            rows={8}
            className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 font-mono text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:placeholder:text-zinc-600 dark:focus:border-violet-500"
          />
        </div>

        <p className="text-xs text-slate-500 dark:text-zinc-400">
          CSS is applied to your public bio page. Use <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-white/10">.bio-page</code> as root selector.
        </p>

        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges}
          className="inline-flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-slate-950 dark:text-white shadow-lg shadow-violet-500/25 transition hover:shadow-xl hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="size-4" />
          Save CSS
        </button>
      </div>
    </SectionCard>
  );
}
