"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ArrowUpRight,
  BarChart3,
  Link as LinkIcon,
  LogOut,
  Moon,
  Palette,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnalyticsPanel } from "@/components/dashboard/analytics-panel";
import { LinkManager } from "@/components/dashboard/link-manager";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { QrSharePanel } from "@/components/dashboard/qr-share-panel";
import { ThemePicker } from "@/components/dashboard/theme-picker";
import { BioPreview } from "@/components/bio/bio-preview";
import { useBioApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

const quickNav = [
  { href: "#profile", label: "Profile", icon: UserRound },
  { href: "#links", label: "Links", icon: LinkIcon },
  { href: "#themes", label: "Themes", icon: Palette },
  { href: "#analytics", label: "Analytics", icon: BarChart3 },
];

export default function DashboardPage() {
  const router = useRouter();
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
    return <LoadingState label="Menyiapkan dashboard dan preview" />;
  }

  if (!currentUser) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-4 dark:bg-zinc-950">
        <section className="max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-xl dark:border-white/10 dark:bg-white/7">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <Sparkles className="size-5" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">
            Sesi dashboard belum aktif
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-zinc-400">
            Login atau register dummy untuk membuka editor bio link.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-950 dark:border-white/10 dark:text-white"
            >
              Register
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-zinc-950 dark:text-white">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-slate-50/86 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/86">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <Sparkles className="size-5" />
            </span>
            <span className="hidden text-base font-black tracking-tight sm:block">LinkPilot</span>
          </Link>

          <div className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-white/7 lg:flex">
            {quickNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <item.icon className="size-4" />
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {state.darkMode ? <Moon className="size-4 text-zinc-300" /> : <Sun className="size-4 text-slate-600" />}
            <ToggleSwitch checked={state.darkMode} onChange={toggleDarkMode} label="Dark mode" />
            <Link
              href={`/u/${currentUser.username}`}
              target="_blank"
              className="hidden h-10 items-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200 sm:inline-flex"
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
                router.push("/login");
              }}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <section className="grid gap-5">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/7 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-200">
                  Dashboard user
                </p>
                <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-5xl">
                  {currentUser.headline}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 dark:text-zinc-400">
                  Kelola identitas, urutan link, tema, QR, dan analytics dummy dari satu workspace.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="size-12 rounded-2xl object-cover"
                />
                <div>
                  <p className="text-sm font-bold">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">/u/{currentUser.username}</p>
                </div>
              </div>
            </div>
          </div>

          <div id="profile">
            <ProfileForm user={currentUser} onSave={updateProfile} />
          </div>

          <div id="links">
            <LinkManager
              links={currentUser.links}
              onAdd={addLink}
              onUpdate={updateLink}
              onDelete={deleteLink}
              onToggle={toggleLink}
              onMove={moveLink}
            />
          </div>

          <div id="themes">
            <ThemePicker activeThemeId={currentUser.themeId} onSelect={setTheme} />
          </div>

          <QrSharePanel
            user={currentUser}
            onToast={(title, description) => addToast({ title, description, tone: "success" })}
          />

          <div id="analytics">
            <AnalyticsPanel user={currentUser} />
          </div>
        </section>

        <aside className="xl:sticky xl:top-24 xl:h-[calc(100vh-7rem)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-zinc-500">
                Realtime
              </p>
              <h2 className="text-lg font-semibold">Preview Bio Page</h2>
            </div>
            <Link
              href={`/u/${currentUser.username}`}
              target="_blank"
              aria-label="Buka public bio page"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-950 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/7 dark:text-white"
            >
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="h-[720px] max-h-[calc(100vh-10rem)] min-h-[620px] overflow-hidden rounded-[2rem]">
            <BioPreview
              user={currentUser}
              framed
              compact
              disableLinks
              onLinkClick={() =>
                addToast({
                  title: "Preview realtime",
                  description: "Buka halaman publik untuk klik link asli.",
                  tone: "info",
                })
              }
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
