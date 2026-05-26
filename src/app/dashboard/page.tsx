'use client';

/* eslint-disable @next/next/no-img-element */

import {
  ArrowUpRight,
  BarChart3,
  Globe2,
  Link as LinkIcon,
  LogOut,
  Moon,
  Palette,
  Save,
  Settings,
  Sparkles,
  Sun,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AnalyticsPanel } from '@/components/dashboard/analytics-panel';
import { CustomCssPanel } from '@/components/dashboard/custom-css-panel';
import { DomainPanel } from '@/components/dashboard/domain-panel';
import { ExportPanel } from '@/components/dashboard/export-panel';
import { LinkManager } from '@/components/dashboard/link-manager';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { QrSharePanel } from '@/components/dashboard/qr-share-panel';
import { ThemePicker } from '@/components/dashboard/theme-picker';
import { BioPreview } from '@/components/bio/bio-preview';
import { useBioApp } from '@/components/providers/app-provider';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { cn } from '@/lib/utils';
import { BIO_THEMES } from '@/lib/themes';

type Tab = 'links' | 'analytics' | 'settings' | 'domains';

const TABS: { id: Tab; label: string; icon: typeof LinkIcon }[] = [
  { id: 'links', label: 'Links', icon: LinkIcon },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'domains', label: 'Domains', icon: Globe2 },
];

/* ── Skeleton shimmer ─────────────────────────────────────── */
function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-white/[0.04] bg-[length:200%_100%] bg-no-repeat',
        'bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)]',
        'animate-[shimmer_1.8s_ease-in-out_infinite]',
        className,
      )}
    />
  );
}

function DashboardSkeleton() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Mesh gradient bg skeleton */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#06060a]" />

      {/* Header skeleton */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#06060a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="size-10 rounded-2xl" />
            <SkeletonBlock className="hidden h-5 w-24 sm:block" />
          </div>
          <div className="hidden items-center gap-1 rounded-2xl border border-white/[0.06] bg-[#141418] p-1 lg:flex">
            {TABS.map((_, i) => (
              <SkeletonBlock key={i} className="h-9 w-20 rounded-xl" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBlock className="hidden h-5 w-32 sm:block" />
            <SkeletonBlock className="h-8 w-16 rounded-xl" />
            <SkeletonBlock className="h-10 w-20 rounded-2xl" />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <section className="grid gap-5">
          {/* User card skeleton */}
          <SkeletonBlock className="h-44 rounded-2xl" />
          {/* Tab content skeleton */}
          <SkeletonBlock className="h-20 rounded-2xl" />
          <SkeletonBlock className="h-32 rounded-2xl" />
          <SkeletonBlock className="h-32 rounded-2xl" />
        </section>
        <aside>
          <SkeletonBlock className="h-8 w-36 rounded-lg" />
          <SkeletonBlock className="mt-3 h-[720px] rounded-2xl" />
        </aside>
      </div>
    </main>
  );
}

/* ── Staggered fadeSlideUp wrapper ─────────────────────────── */
function AnimatedTab({
  tabKey,
  activeTab,
  children,
}: {
  tabKey: string;
  activeTab: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (tabKey === activeTab) {
      setVisible(false);
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    }
  }, [tabKey, activeTab]);

  if (tabKey !== activeTab) return null;

  return (
    <div
      className={cn(
        'grid gap-5 transition-all duration-500 ease-out',
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0',
      )}
    >
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('links');
  const {
    currentUser,
    isReady,
    state,
    addToast,
    logout,
    toggleDarkMode,
    updateProfile,
    addLink,
    updateLink,
    deleteLink,
    toggleLink,
    moveLink,
    setTheme,
  } = useBioApp();

  if (!isReady) {
    return <DashboardSkeleton />;
  }

  if (!currentUser) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#06060a] p-4">
        <section className="max-w-md rounded-2xl border border-white/[0.06] bg-[#141418] p-6 text-center backdrop-blur-xl">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-cyan-400 text-[#06060a]">
            <Sparkles className="size-5" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-white">
            Sesi dashboard belum aktif
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Login atau register untuk membuka editor bio link.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-cyan-400 px-4 text-sm font-semibold text-[#06060a] transition hover:bg-cyan-300"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/[0.06] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
            >
              Register
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const profileUrl = `bio-link-saas.vercel.app/u/${currentUser.username}`;

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* ── Mesh gradient background with floating orbs ─────── */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#06060a]">
        {/* Orb 1 */}
        <div
          className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(34,211,238,0.35) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'floatOrb 20s ease-in-out infinite',
          }}
        />
        {/* Orb 2 */}
        <div
          className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'floatOrb 20s ease-in-out infinite -7s',
          }}
        />
        {/* Orb 3 */}
        <div
          className="absolute -bottom-32 left-1/3 h-[550px] w-[550px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'floatOrb 20s ease-in-out infinite -13s',
          }}
        />
      </div>

      {/* ── Global keyframes (injected once) ────────────────── */}
      <style jsx global>{`
        @keyframes floatOrb {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>

      {/* ── Sticky glass header ─────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#06060a]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-cyan-400 text-[#06060a]">
              <Sparkles className="size-5" />
            </span>
            <span className="hidden text-base font-black tracking-tight sm:block">
              LinkPilot
            </span>
          </Link>

          {/* Tab navigation – desktop */}
          <nav className="hidden items-center gap-1 rounded-2xl border border-white/[0.06] bg-[#141418] p-1 backdrop-blur-md lg:flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-all duration-300',
                  activeTab === tab.id
                    ? 'bg-cyan-400 text-[#06060a] shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                    : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white',
                )}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {session?.user?.email && (
              <span className="hidden text-xs text-zinc-500 sm:block">
                {session.user.email}
              </span>
            )}
            {state.darkMode ? (
              <Moon className="size-4 text-zinc-400" />
            ) : (
              <Sun className="size-4 text-zinc-400" />
            )}
            <ToggleSwitch
              checked={state.darkMode}
              onChange={toggleDarkMode}
              label="Dark mode"
            />
            <Link
              href={`/u/${currentUser.username}`}
              target="_blank"
              className="hidden h-10 items-center gap-2 rounded-2xl bg-cyan-400 px-3 text-sm font-semibold text-[#06060a] transition hover:bg-cyan-300 sm:inline-flex"
            >
              Public
              <ArrowUpRight className="size-4" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Logout"
              onClick={() => {
                logout();
                router.push('/login');
              }}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>

        {/* Mobile tab bar */}
        <div className="flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'inline-flex shrink-0 h-9 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-all duration-300',
                activeTab === tab.id
                  ? 'bg-cyan-400 text-[#06060a] shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                  : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white',
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="relative z-10 mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <section className="grid gap-5">
          {/* User info card – surface-1 glass */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c10]/80 p-5 backdrop-blur-[12px] sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-400">
                  Dashboard
                </p>
                <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {currentUser.headline}
                </h1>
                <p className="mt-2 text-sm text-zinc-400">
                  {currentUser.bio}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300">
                    <Globe2 className="size-3" />
                    {profileUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://${profileUrl}`,
                      );
                      addToast({
                        title: 'Profile link copied',
                        tone: 'success',
                      });
                    }}
                    className="text-zinc-500 transition hover:text-cyan-400"
                    aria-label="Copy profile link"
                  >
                    <ArrowUpRight className="size-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="size-12 rounded-2xl object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-white">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    @{currentUser.username}
                  </p>
                  {session?.user?.email && (
                    <p className="text-xs text-zinc-500">
                      {session.user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: inline tabs as buttons */}
          <div className="flex gap-2 overflow-x-auto lg:hidden">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'inline-flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition-all duration-300',
                  activeTab === tab.id
                    ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                    : 'border-white/[0.06] bg-[#141418] text-zinc-400 hover:text-white',
                )}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content with staggered animations */}
          <AnimatedTab tabKey="links" activeTab={activeTab}>
            <div>
              <LinkManager
                links={currentUser.links}
                onAdd={addLink}
                onUpdate={updateLink}
                onDelete={deleteLink}
                onToggle={toggleLink}
                onMove={moveLink}
              />
            </div>
            <ThemePicker
              activeThemeId={currentUser.themeId}
              onSelect={setTheme}
            />
            <QrSharePanel
              user={currentUser}
              onToast={(title, description) =>
                addToast({ title, description, tone: 'success' })
              }
            />
          </AnimatedTab>

          <AnimatedTab tabKey="analytics" activeTab={activeTab}>
            <AnalyticsPanel />
          </AnimatedTab>

          <AnimatedTab tabKey="settings" activeTab={activeTab}>
            <ProfileForm user={currentUser} onSave={updateProfile} />

            {/* Theme selector */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c10]/80 p-5 backdrop-blur-[12px]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
                Appearance
              </p>
              <h2 className="mt-1 text-lg font-semibold text-white">
                Theme
              </h2>
              <select
                value={currentUser.themeId}
                onChange={(e) => setTheme(e.target.value)}
                className="mt-3 w-full rounded-xl border border-white/[0.06] bg-[#141418] px-4 py-2.5 text-sm text-white transition-shadow focus:border-cyan-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.2)]"
              >
                {BIO_THEMES.map((theme) => (
                  <option
                    key={theme.id}
                    value={theme.id}
                    className="bg-[#141418] text-white"
                  >
                    {theme.name} — {theme.description}
                  </option>
                ))}
              </select>
            </div>

            <CustomCssPanel />
            <ExportPanel />
          </AnimatedTab>

          <AnimatedTab tabKey="domains" activeTab={activeTab}>
            <DomainPanel />
          </AnimatedTab>
        </section>

        {/* Sidebar preview */}
        <aside className="xl:sticky xl:top-24 xl:h-[calc(100vh-7rem)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                Realtime
              </p>
              <h2 className="text-lg font-semibold text-white">
                Preview Bio Page
              </h2>
            </div>
            <Link
              href={`/u/${currentUser.username}`}
              target="_blank"
              aria-label="Buka public bio page"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-white/[0.06] bg-[#141418] text-white transition hover:-translate-y-0.5 hover:bg-white/[0.06]"
            >
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="h-[720px] max-h-[calc(100vh-10rem)] min-h-[620px] overflow-hidden rounded-2xl">
            <BioPreview
              user={currentUser}
              framed
              compact
              disableLinks
              onLinkClick={() =>
                addToast({
                  title: 'Preview realtime',
                  description:
                    'Buka halaman publik untuk klik link asli.',
                  tone: 'info',
                })
              }
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
