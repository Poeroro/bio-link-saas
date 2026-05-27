'use client';

import {
  BarChart3,
  Monitor,
  Smartphone,
  Tablet,
  MousePointerClick,
  TrendingUp,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

type Period = 7 | 30 | 90;

type AnalyticsData = {
  totalClicks: number;
  clicksPerDay: { date: string; clicks: number }[];
  topLinks: { linkId: string; label: string; clicks: number }[];
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
  refererBreakdown: { referer: string; clicks: number }[];
};

const PERIODS: { label: string; value: Period }[] = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
];

export function AnalyticsPanel() {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const [period, setPeriod] = useState<Period>(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/analytics?userId=${userId}&days=${period}`,
      );
      if (!res.ok) throw new Error('Failed to load analytics');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId, period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const maxClicks = data
    ? Math.max(...data.clicksPerDay.map((d) => d.clicks), 1)
    : 1;

  const totalDevice =
    data != null
      ? data.deviceBreakdown.mobile +
        data.deviceBreakdown.desktop +
        data.deviceBreakdown.tablet
      : 0;

  const devicePct = (count: number) =>
    totalDevice > 0 ? Math.round((count / totalDevice) * 100) : 0;

  return (
    <div className="grid gap-5">
      {/* Header + period selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
            Analytics
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
            Click performance
          </h2>
        </div>
        <div className="inline-flex gap-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/5 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={cn(
                'rounded-xl px-4 py-1.5 text-sm font-semibold transition',
                period === p.value
                  ? 'bg-cyan-400 text-slate-950'
                  : 'text-zinc-400 hover:text-slate-950 dark:text-white',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / error */}
      {loading && (
        <div className="grid h-40 place-items-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white/5">
          <div className="size-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      {data && !loading && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatCard
              label="Total clicks"
              value={data.totalClicks}
              icon={MousePointerClick}
              accent="cyan"
            />
            <StatCard
              label="Avg / day"
              value={
                data.clicksPerDay.length > 0
                  ? Math.round(
                      data.totalClicks / data.clicksPerDay.length,
                    )
                  : 0
              }
              icon={TrendingUp}
              accent="emerald"
            />
            <StatCard
              label="Top links"
              value={data.topLinks.length}
              icon={BarChart3}
              accent="violet"
            />
            <StatCard
              label="Peak day"
              value={maxClicks}
              icon={BarChart3}
              accent="amber"
            />
          </div>

          {/* Clicks per day chart */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/5 p-5">
            <p className="mb-4 text-sm font-semibold text-slate-950 dark:text-white">
              Clicks per day
            </p>
            <div className="flex h-48 items-end gap-1.5">
              {data.clicksPerDay.map((day) => {
                const height = Math.max(
                  4,
                  (day.clicks / maxClicks) * 100,
                );
                return (
                  <div
                    key={day.date}
                    className="group flex min-w-0 flex-1 flex-col items-center gap-1"
                  >
                    <div className="relative flex h-40 w-full items-end justify-center">
                      <div
                        className="w-full max-w-[40px] rounded-t-lg bg-cyan-400 transition group-hover:bg-cyan-300"
                        style={{ height: `${height}%` }}
                      />
                      <span className="pointer-events-none absolute -top-6 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs font-semibold text-slate-950 dark:text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                        {day.clicks}
                      </span>
                    </div>
                    <span className="text-[9px] font-medium text-zinc-500">
                      {day.date.slice(5)}
                    </span>
                  </div>
                );
              })}
              {data.clicksPerDay.length === 0 && (
                <p className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
                  No data for this period
                </p>
              )}
            </div>
          </div>

          {/* Top links table */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/5 p-5">
            <p className="mb-4 text-sm font-semibold text-slate-950 dark:text-white">
              Top links
            </p>
            {data.topLinks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-xs uppercase tracking-wider text-zinc-500">
                      <th className="pb-3 pr-4 font-semibold">#</th>
                      <th className="pb-3 pr-4 font-semibold">Label</th>
                      <th className="pb-3 text-right font-semibold">
                        Clicks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topLinks.map((link, i) => {
                      const barWidth =
                        data.topLinks[0].clicks > 0
                          ? Math.max(
                              8,
                              (link.clicks / data.topLinks[0].clicks) *
                                100,
                            )
                          : 0;
                      return (
                        <tr
                          key={link.linkId}
                          className="border-b border-white/5 last:border-0"
                        >
                          <td className="py-3 pr-4 font-mono text-zinc-500">
                            {i + 1}
                          </td>
                          <td className="py-3 pr-4 text-slate-950 dark:text-white">
                            <div className="flex items-center gap-3">
                              <span className="truncate">
                                {link.label}
                              </span>
                              <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-white/10 sm:block">
                                <div
                                  className="h-full rounded-full bg-cyan-400"
                                  style={{
                                    width: `${barWidth}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-right font-semibold text-cyan-400">
                            {link.clicks.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No link data yet</p>
            )}
          </div>

          {/* Device breakdown */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/5 p-5">
            <p className="mb-4 text-sm font-semibold text-slate-950 dark:text-white">
              Device breakdown
            </p>
            <div className="grid grid-cols-3 gap-4">
              <DeviceStat
                icon={Smartphone}
                label="Mobile"
                pct={devicePct(data.deviceBreakdown.mobile)}
              />
              <DeviceStat
                icon={Monitor}
                label="Desktop"
                pct={devicePct(data.deviceBreakdown.desktop)}
              />
              <DeviceStat
                icon={Tablet}
                label="Tablet"
                pct={devicePct(data.deviceBreakdown.tablet)}
              />
            </div>
            {/* Stacked bar */}
            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="bg-cyan-400 transition-all"
                style={{
                  width: `${devicePct(data.deviceBreakdown.mobile)}%`,
                }}
              />
              <div
                className="bg-emerald-400 transition-all"
                style={{
                  width: `${devicePct(data.deviceBreakdown.desktop)}%`,
                }}
              />
              <div
                className="bg-amber-400 transition-all"
                style={{
                  width: `${devicePct(data.deviceBreakdown.tablet)}%`,
                }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-zinc-500">
              <span>Mobile</span>
              <span>Desktop</span>
              <span>Tablet</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof MousePointerClick;
  accent: 'cyan' | 'emerald' | 'violet' | 'amber';
}) {
  const bgMap = {
    cyan: 'bg-cyan-400/12 text-cyan-400',
    emerald: 'bg-emerald-400/12 text-emerald-400',
    violet: 'bg-violet-400/12 text-violet-400',
    amber: 'bg-amber-400/12 text-amber-400',
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">{label}</p>
        <div
          className={cn(
            'grid size-10 place-items-center rounded-xl',
            bgMap[accent],
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function DeviceStat({
  icon: Icon,
  label,
  pct,
}: {
  icon: typeof Smartphone;
  label: string;
  pct: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
      <Icon className="size-5 text-zinc-400" />
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-lg font-bold text-slate-950 dark:text-white">{pct}%</p>
      </div>
    </div>
  );
}
