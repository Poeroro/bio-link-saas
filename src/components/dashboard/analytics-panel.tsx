"use client";

import { BarChart3, MousePointerClick, TrendingUp, Users } from "lucide-react";
import type { UserProfile } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";

export function AnalyticsPanel({ user }: { user: UserProfile }) {
  const maxVisits = Math.max(...user.analytics.map((day) => day.visits));
  const topLinks = [...user.links].sort((a, b) => b.clicks - a.clicks).slice(0, 4);

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total views"
          value={user.totalViews}
          detail="+18.4% dari 14 hari lalu"
          icon={BarChart3}
          tone="sky"
        />
        <MetricCard
          label="Total clicks"
          value={user.totalClicks}
          detail="CTR dummy 34.3%"
          icon={MousePointerClick}
          tone="emerald"
        />
        <MetricCard
          label="Subscribers"
          value={user.subscribers}
          detail="+74 lead baru"
          icon={Users}
          tone="rose"
        />
        <MetricCard
          label="Growth score"
          value={92}
          detail="Audience hangat"
          icon={TrendingUp}
          tone="slate"
        />
      </div>

      <SectionCard title="Analytics Dummy" eyebrow="14-day pulse">
        <div className="flex h-56 items-end gap-2 rounded-3xl bg-slate-50 p-4 dark:bg-white/5">
          {user.analytics.map((day, index) => {
            const height = Math.max(12, (day.visits / maxVisits) * 100);

            return (
              <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end">
                  <div
                    className={cn(
                      "w-full rounded-t-xl bg-slate-950 transition dark:bg-white",
                      index > user.analytics.length - 5 && "bg-cyan-500 dark:bg-cyan-300",
                    )}
                    style={{ height: `${height}%` }}
                    title={`${day.date}: ${formatNumber(day.visits)} visits`}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                  {day.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {topLinks.map((link, index) => (
            <div
              key={link.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                  {index + 1}. {link.title}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                  {link.active ? "Aktif" : "Nonaktif"} · {formatNumber(link.clicks)} clicks
                </p>
              </div>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-500"
                  style={{ width: `${Math.max(8, (link.clicks / topLinks[0].clicks) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
