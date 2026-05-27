'use client';

/* eslint-disable @next/next/no-img-element */

import {
  ArrowUpRight,
  BarChart3,
  Link as LinkIcon,
  LogOut,
  Menu,
  Moon,
  Palette,
  Save,
  Settings,
  Sun,
  UserRound,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { AlertTriangle, Loader2, Mail } from 'lucide-react';
import { SiteName } from '@/components/site-logo';
import { AnalyticsPanel } from '@/components/dashboard/analytics-panel';
import { CustomCssPanel } from '@/components/dashboard/custom-css-panel';
import { ExportPanel } from '@/components/dashboard/export-panel';
import { LinkManager } from '@/components/dashboard/link-manager';
import { ProfileForm, PasswordForm } from '@/components/dashboard/profile-form';
import { QrSharePanel } from '@/components/dashboard/qr-share-panel';
import { ThemePicker } from '@/components/dashboard/theme-picker';
import { BioPreview } from '@/components/bio/bio-preview';
import { useBioApp } from '@/components/providers/app-provider';
import { Button } from '@/components/ui/button';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { cn } from '@/lib/utils';
import { BIO_THEMES } from '@/lib/themes';

type Tab = 'links' | 'analytics' | 'settings';

const TABS: { id: Tab; label: string; icon: typeof LinkIcon }[] = [
  { id: 'links', label: 'Links', icon: LinkIcon },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 rounded-2xl bg-[#141418] animate-pulse"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('links');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    saveLinkOrder,
    setTheme,
 } = useBioApp();

  const [verifyRequired, setVerifyRequired] = useState(false);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/auth/verification-status')
      .then(r => r.json())
      .then(d => {
        if (d.needsVerification) {
          setVerifyRequired(true);
          const email = session?.user?.email || '';
          setTimeout(() => {
            router.replace(`/verify-email?email=${encodeURIComponent(email)}`);
 }, 500);
 }
 })
      .catch(() => {})
      .finally(() => setChecking(false));
 }, []);

  if (!isReady || checking) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#06060a] p-4">
        <div className="w-full max-w-md">
          <DashboardSkeleton />
        </div>
      </main>
    );
 }

  if (verifyRequired) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#06060a] p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#0c0c10]/80 backdrop-blur-xl p-6 text-center">
          <Loader2 className="size-8 animate-spin text-cyan-400 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Mengarahkan ke halaman verifikasi...</p>
        </div>
      </main>
    );
 }

  if (!currentUser) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#06060a] p-4">
        <section className="max-w-md rounded-2xl border border-white/[0.06] bg-[#0c0c10]/80 backdrop-blur-xl p-6 text-center">
          <h1 className="mt-5 text-2xl font-bold text-white">
            Sesi dashboard belum aktif
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Login atau register untuk membuka editor bio link.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-cyan-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/[0.06] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.04]"
            >
              Register
            </Link>
          </div>
        </section>
      </main>
    );
 }

  const profileUrl = typeof window !== 'undefined' 
    ? `${window.location.host}/u/${currentUser.username}`
    : `bio-link-saas.vercel.app/u/${currentUser.username}`;

  return (
    <main className="min-h-screen w-full max-w-full bg-[#06060a] text-white">
      {/* Floating mesh orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/[0.07] blur-[80px] animate-[floatOrb_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-500/[0.06] blur-[80px] animate-[floatOrb_25s_ease-in-out_infinite]" />
        <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full bg-emerald-500/[0.05] blur-[80px] animate-[floatOrb_22s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#06060a]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
            {/* Hamburger button - mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative z-50 flex size-9 items-center justify-center rounded-lg bg-white/10 text-white transition lg:hidden"
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            >
              <Menu
                className={`size-5 transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                }`}
              />
              <X
                className={`absolute size-5 transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                }`}
              />
            </button>

            <Link href="/dashboard" className="flex items-center gap-3">
              <span className="hidden text-base font-black tracking-tight sm:block">
                <SiteName />
              </span>
            </Link>

            {/* Tab navigation - desktop only */}
            <nav className="hidden items-center gap-1 rounded-2xl bg-[#0c0c10]/80 backdrop-blur-xl border border-white/[0.06] p-1 lg:flex">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition',
                    activeTab === tab.id
                      ? 'bg-cyan-400/10 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.12)]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]',
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
                className="hidden h-10 items-center gap-2 rounded-2xl bg-cyan-400 px-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 sm:inline-flex"
              >
                View
                <ArrowUpRight className="size-4" />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Logout"
                onClick={() => {
                  logout();
                  signOut({ redirect: false });
                  router.push('/login');
                }}
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile menu overlay — outside header to cover full screen */}
        <div
          className={`fixed inset-0 z-50 bg-[#06060a] backdrop-blur-xl transition-all duration-300 lg:hidden ${
            mobileMenuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className={`flex flex-col items-center justify-start gap-6 min-h-screen pt-24 px-6 transition-all duration-300 ${
              mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
            }`}
          >
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <SiteName />
            </Link>
            <div className="h-px w-16 bg-white/10" />

            {/* Tab links */}
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={cn(
                  'inline-flex items-center gap-3 text-lg font-semibold transition',
                  activeTab === tab.id
                    ? 'text-cyan-400'
                    : 'text-zinc-400 hover:text-white',
                )}
              >
                <tab.icon className="size-5" />
                {tab.label}
              </button>
            ))}

            <div className="h-px w-16 bg-white/10" />

            <Link
              href={`/u/${currentUser.username}`}
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-8 text-base font-bold text-slate-950 transition hover:opacity-90"
            >
              View Profile
              <ArrowUpRight className="size-5" />
            </Link>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_430px]">
          <section className="grid gap-5">
            {/* User info card */}
            <div
              className="rounded-2xl border border-white/[0.06] bg-[#0c0c10]/80 backdrop-blur-xl p-5 sm:p-6"
              style={{ animation: 'fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}
            >
              {verifyRequired && (
                <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                  <AlertTriangle className="size-5 shrink-0 text-amber-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-300">Email belum terverifikasi</p>
                    <p className="text-xs text-amber-400/70 mt-0.5">Verifikasi email untuk mengakses semua fitur.</p>
                  </div>
                  <button
                    onClick={async () => {
                      setSending(true);
                      try {
                        await fetch('/api/auth/send-verification', { method: 'POST' });
                        router.push(`/verify-email?email=${encodeURIComponent(session?.user?.email || '')}`);
 } catch {}
                      setSending(false);
 }}
                    disabled={sending}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/15 hover:bg-amber-400/20 transition disabled:opacity-50"
                  >
                    <Mail className="size-3.5" />
                    {sending ? 'Mengirim...' : 'Verifikasi Sekarang'}
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-400">
                    Dashboard
                  </p>
                  <h1 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                    {currentUser.headline}
                  </h1>
                  <p className="mt-2 text-sm text-zinc-400">
                    {currentUser.bio}
                  </p>
                  <div className="mt-3 flex items-center gap-2 overflow-hidden">
                    <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300">
                      <LinkIcon className="size-3 shrink-0" />
                      <span className="truncate">{profileUrl}</span>
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
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="size-10 rounded-xl object-cover sm:size-12 sm:rounded-2xl"
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
                    'inline-flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition',
                    activeTab === tab.id
                      ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-400'
                      : 'border-white/[0.06] bg-white/[0.04] text-zinc-400 hover:text-white',
                  )}
                >
                  <tab.icon className="size-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'links' && (
              <div
                className="grid gap-5"
                style={{ animation: 'fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}
              >
                <div>
                  <LinkManager
                    links={currentUser.links}
                    onAdd={addLink}
                    onUpdate={updateLink}
                    onDelete={deleteLink}
                    onToggle={toggleLink}
                    onMove={moveLink}
                    onSaveOrder={saveLinkOrder}
                  />
                </div>

                {/* Preview Bio Page — mobile/tablet: inline, above theme picker */}
                <div className="xl:hidden">
                  <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c10]/80 backdrop-blur-xl p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-white">Preview</h2>
                      <Link
                        href={`/u/${currentUser.username}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/[0.10]"
                      >
                        View
                        <ArrowUpRight className="size-3" />
                      </Link>
                    </div>
                    <div className="overflow-y-auto overflow-x-hidden rounded-xl">
                      <BioPreview
                        user={currentUser}
                        framed
                        compact
                        disableLinks
                        onLinkClick={() =>
                          addToast({
                            title: 'Preview realtime',
                            description: 'Buka halaman publik untuk klik link asli.',
                            tone: 'info',
 })
 }
                      />
                    </div>
                  </div>
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
              </div>
            )}

            {activeTab === 'analytics' && (
              <div style={{ animation: 'fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
                <AnalyticsPanel />
              </div>
            )}

            {activeTab === 'settings' && (
              <div
                className="grid gap-5"
                style={{ animation: 'fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}
              >
                <ProfileForm user={currentUser} onSave={updateProfile} />

                {/* Change password */}
                <PasswordForm />

                {/* Theme selector */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c10]/80 backdrop-blur-xl p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
                    Appearance
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-white">
                    Theme
                  </h2>
                  <select
                    value={currentUser.themeId}
                    onChange={(e) => setTheme(e.target.value)}
                    className="mt-3 w-full rounded-xl border border-white/[0.06] bg-[#0c0c10]/80 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  >
                    {BIO_THEMES.map((theme) => (
                      <option
                        key={theme.id}
                        value={theme.id}
                        className="bg-[#0c0c10] text-white"
                      >
                        {theme.name} — {theme.description}
                      </option>
                    ))}
                  </select>
                </div>

                <CustomCssPanel />
                <ExportPanel />
              </div>
            )}


          </section>

          {/* Sidebar preview — desktop only */}
          <aside className="hidden xl:block xl:sticky xl:top-24 xl:h-[calc(100vh-7rem)]">
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
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/[0.10]"
              >
                View
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
            <div className="h-[720px] max-h-[calc(100vh-10rem)] min-h-[620px] overflow-y-auto overflow-x-hidden rounded-2xl">
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
      </div>
    </main>
  );
}