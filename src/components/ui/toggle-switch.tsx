import { cn } from "@/lib/utils";

export function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative h-7 w-12 rounded-full border transition",
        checked
          ? "border-slate-950 bg-slate-950 dark:border-white dark:bg-white"
          : "border-slate-300 bg-slate-100 dark:border-white/20 dark:bg-white/10",
      )}
    >
      <span
        className={cn(
          "absolute top-1 grid size-5 place-items-center rounded-full bg-white shadow-sm transition dark:bg-zinc-950",
          checked ? "left-6" : "left-1",
        )}
      />
    </button>
  );
}
