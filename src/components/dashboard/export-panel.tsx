"use client";

import { useRef, useState } from "react";
import { Download, Upload, Trash2, CheckCircle2 } from "lucide-react";
import { SectionCard } from "@/components/ui/section-card";
import { exportAllData, importAllData, clearAllData } from "@/lib/storage";
import { useBioApp } from "@/components/providers/app-provider";

export function ExportPanel() {
  const { addToast, state } = useBioApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleExport = () => {
    try {
      const json = exportAllData();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `linkpilot-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast({ title: "Data exported", tone: "success" });
    } catch {
      addToast({ title: "Export failed", tone: "error" });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = reader.result as string;
        importAllData(json);
        addToast({ title: "Data imported", description: "Page will reload.", tone: "success" });
        window.setTimeout(() => window.location.reload(), 800);
      } catch (err) {
        addToast({
          title: "Import failed",
          description: err instanceof Error ? err.message : "Invalid JSON file.",
          tone: "error",
        });
      }
    };
    reader.readAsText(file);

    // Reset input so same file can be re-selected
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }

    clearAllData();
    addToast({ title: "All data cleared", description: "Page will reload.", tone: "info" });
    window.setTimeout(() => window.location.reload(), 800);
  };

  return (
    <SectionCard title="Data Management" eyebrow="Export & Import">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
          >
            <Download className="size-4" />
            Export JSON
          </button>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
          >
            <Upload className="size-4" />
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {/* Danger zone */}
        <div className="mt-2 rounded-2xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-500/20 dark:bg-rose-500/5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-500">
            Danger zone
          </p>
          <p className="mt-1 text-sm text-rose-700 dark:text-rose-300">
            Clear all data from localStorage. This cannot be undone.
          </p>
          <button
            type="button"
            onClick={handleClear}
            onBlur={() => setConfirmClear(false)}
            className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            {confirmClear ? <CheckCircle2 className="size-4" /> : <Trash2 className="size-4" />}
            {confirmClear ? "Click again to confirm" : "Clear all data"}
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
