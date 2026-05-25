import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-sm",
        size === "lg" && "h-12 px-5 text-base",
        variant === "primary" &&
          "bg-slate-950 text-white shadow-lg shadow-slate-950/16 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200",
        variant === "secondary" &&
          "border border-slate-200 bg-white text-slate-950 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/8 dark:text-white dark:hover:bg-white/12",
        variant === "ghost" &&
          "text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white",
        variant === "danger" &&
          "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/12 dark:text-rose-200 dark:hover:bg-rose-500/18",
        className,
      )}
      {...props}
    />
  );
}
