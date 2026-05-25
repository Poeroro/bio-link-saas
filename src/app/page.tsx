"use client";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Copy,
  LayoutDashboard,
  Link as LinkIcon,
  Moon,
  Palette,
  QrCode,
  Sparkles,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { BioPreview } from "@/components/bio/bio-preview";
import { useBioApp } from "@/components/providers/app-provider";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { formatNumber } from "@/lib/utils";

const workflow = [
  { title: "Register dummy", detail: "Akun starter langsung berisi profil, link, dan analytics.", icon: CheckCircle2 },
  { title: "Edit workspace", detail: "Profile, link aktif, urutan drag/drop, dan tema sinkron realtime.", icon: LayoutDashboard },
  { title: "Publish /u/username", detail: "QR, copy, share, dan halaman publik siap dicoba.", icon: QrCode },
];

const featureRows = [
  { label: "8+ template tema", icon: Palette },
  { label: "Analytics dummy", icon: BarChart3 },
  { label: "Copy & share link", icon: Copy },
  { label: "Drag/drop link", icon: LinkIcon },
];

export default function Home() {
  const { state, currentUser, toggleDarkMode } = useBioApp();
  const demoUser = currentUser ?? state.users[0];

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8fafc,#ecfeff_44%,#fff7ed)] text-slate-950 dark:bg-[linear-gradient(135deg,#09090b,#111827_48%,#052e2b)] dark:text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <Sparkles className="size-5" />
          </span>
          <span className="text-base font-black tracking-tight">LinkPilot</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-slate-600 transition hover:text-slate-950 dark:text-zinc-300 dark:hover:text-white sm:block"
          >
            Login
          </Link>
          {state.darkMode ? <Moon className="size-4 text-zinc-300" /> : <Sun className="size-4 text-slate-600" />}
          <ToggleSwitch checked={state.darkMode} onChange={toggleDarkMode} label="Dark mode" />
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/74 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/7 dark:text-zinc-300">
            <span className="size-2 rounded-full bg-cyan-400" />
            Bio link SaaS
          </div>
          <h1 className="mt-6 font-serif text-5xl font-semibold leading-[0.95] tracking-normal text-slate-950 dark:text-white sm:text-7xl">
            LinkPilot Bio Link
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-zinc-300 sm:text-lg">
            Satu halaman bio link yang terasa seperti produk SaaS matang: editor realtime,
            template visual, QR code, analytics dummy, dan data yang tersimpan di browser.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-xl shadow-slate-950/18 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200"
            >
              Register dummy
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/78 px-5 text-sm font-bold text-slate-950 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/7 dark:text-white dark:hover:bg-white/12"
            >
              Buka dashboard
              <LayoutDashboard className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            {featureRows.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/70 bg-white/68 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/7"
              >
                <item.icon className="size-5 text-slate-950 dark:text-white" />
                <p className="mt-3 text-sm font-bold text-slate-700 dark:text-zinc-200">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-10 hidden w-44 rounded-3xl border border-white/70 bg-white/82 p-4 shadow-2xl shadow-slate-950/12 backdrop-blur dark:border-white/10 dark:bg-zinc-950/76 sm:block">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Views
            </p>
            <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
              {formatNumber(demoUser.totalViews)}
            </p>
            <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-white/10">
              <div className="h-full w-4/5 rounded-full bg-cyan-400" />
            </div>
          </div>
          <BioPreview user={demoUser} framed compact disableLinks />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-14 sm:px-6 lg:grid-cols-3">
        {workflow.map((item) => (
          <article
            key={item.title}
            className="rounded-[1.75rem] border border-slate-200 bg-white/76 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/7"
          >
            <div className="grid size-11 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <item.icon className="size-5" />
            </div>
            <h2 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-400">
              {item.detail}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
