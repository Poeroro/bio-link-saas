"use client";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Copy,
  Globe2,
  HelpCircle,
  LayoutDashboard,
  Link as LinkIcon,
  Moon,
  Palette,
  QrCode,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Sun,
  Zap,
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
  { label: "14+ template tema", icon: Palette },
  { label: "Analytics realtime", icon: BarChart3 },
  { label: "Copy & share link", icon: Copy },
  { label: "Drag/drop link", icon: LinkIcon },
  { label: "16 jenis link", icon: Globe2 },
  { label: "Schedule link", icon: Zap },
  { label: "Mobile responsive", icon: Smartphone },
  { label: "Export/Import data", icon: Shield },
];

const testimonials = [
  {
    name: "Sari Dewi",
    role: "Content Creator",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    text: "LinkPilot bikin bio link gue keliatan profesional tanpa perlu coding. Dashboard-nya intuitif banget!",
  },
  {
    name: "Rizky Pratama",
    role: "Freelance Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    text: "Fitur tema dan QR code-nya juara. Klien gue suka banget sama hasilnya.",
  },
  {
    name: "Maya Putri",
    role: "Small Business Owner",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    text: "Dari 0 ke 1000 views dalam seminggu! Analytics-nya membantu gue ngerti audience.",
  },
];

const pricingTiers = [
  {
    name: "Free",
    price: "Rp 0",
    period: "selamanya",
    features: ["5 link aktif", "3 tema dasar", "Analytics 7 hari", "QR code", "Share link"],
    cta: "Mulai Gratis",
    popular: false,
  },
  {
    name: "Pro",
    price: "Rp 49rb",
    period: "/bulan",
    features: ["Unlimited link", "14+ tema premium", "Analytics 30 hari", "Custom CSS", "Priority support", "Export data"],
    cta: "Upgrade Pro",
    popular: true,
  },
  {
    name: "Business",
    price: "Rp 149rb",
    period: "/bulan",
    features: ["Semua fitur Pro", "Custom domain", "Team collaboration", "API access", "White-label", "Dedicated support"],
    cta: "Hubungi Sales",
    popular: false,
  },
];

const faqs = [
  {
    q: "Apa itu LinkPilot?",
    a: "LinkPilot adalah bio link SaaS yang memungkinkan kamu membuat satu halaman untuk semua link penting. Seperti Linktree, tapi dengan fitur lebih lengkap dan tema yang bisa dikustomisasi.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Ya! Semua data tersimpan di browser kamu (localStorage). Tidak ada server yang menyimpan data pribadi. Kamu bisa export data kapan saja.",
  },
  {
    q: "Bisa pakai custom domain?",
    a: "Fitur custom domain tersedia di plan Business. Untuk plan Free dan Pro, kamu bisa pakai linkpilot.app/u/username.",
  },
  {
    q: "Bagaimana cara upgrade?",
    a: "Buka dashboard, pilih plan yang kamu mau, dan ikuti instruksi pembayaran. Upgrade instant dan langsung aktif.",
  },
];

export default function Home() {
  const { state, currentUser, toggleDarkMode } = useBioApp();
  const demoUser = currentUser ?? state.users[0];

  return (
    <>
      {/* Mesh gradient background */}
      <div className="mesh-bg" aria-hidden="true">
        <div className="mesh-orb mesh-orb--cyan" />
        <div className="mesh-orb mesh-orb--violet" />
        <div className="mesh-orb mesh-orb--emerald" />
      </div>

      <main className="relative z-10 min-h-screen overflow-hidden text-white">
        {/* ── Nav ── */}
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--primary)] text-[var(--surface-0)]">
              <Sparkles className="size-5" />
            </span>
            <span className="font-serif text-base font-black tracking-tight">LinkPilot</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-semibold text-[var(--text-muted)] transition hover:text-white sm:block"
            >
              Login
            </Link>
            {state.darkMode ? <Moon className="size-4 text-zinc-300" /> : <Sun className="size-4 text-slate-600" />}
            <ToggleSwitch checked={state.darkMode} onChange={toggleDarkMode} label="Dark mode" />
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
          <div className="max-w-3xl animate-fade-up stagger-1">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <span className="size-2 rounded-full bg-[var(--primary)]" />
              Bio link SaaS
            </div>

            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[0.95] tracking-normal sm:text-7xl">
              LinkPilot{" "}
              <span className="text-gradient-primary">Bio Link</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              Satu halaman bio link yang terasa seperti produk SaaS matang: editor realtime,
              template visual, QR code, analytics dummy, dan data yang tersimpan di browser.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-bold text-[var(--surface-0)] shadow-lg shadow-[var(--primary-glow)] transition-base hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]"
              >
                Register dummy
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/dashboard"
                className="glass glass--interactive focus-ring inline-flex h-12 items-center justify-center gap-2 px-5 text-sm font-bold"
              >
                Buka dashboard
                <LayoutDashboard className="size-4" />
              </Link>
            </div>

            {/* Feature grid */}
            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              {featureRows.map((item, i) => (
                <div
                  key={item.label}
                  className={`glass glass--interactive animate-fade-up stagger-${i + 1} p-4`}
                >
                  <item.icon className="size-5 text-[var(--primary)]" />
                  <p className="mt-3 text-sm font-bold text-zinc-200">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Preview + stats card */}
          <div className="relative animate-fade-up stagger-3">
            <div className="absolute -left-8 top-10 hidden w-44 glass glass--glow p-4 sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">Views</p>
              <p className="mt-2 text-3xl font-black">{formatNumber(demoUser.totalViews)}</p>
              <div className="mt-4 h-2 rounded-full bg-[var(--surface-3)]">
                <div className="h-full w-4/5 rounded-full bg-[var(--primary)]" />
              </div>
            </div>
            <BioPreview user={demoUser} framed compact disableLinks />
          </div>
        </section>

        {/* ── Workflow ── */}
        <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-14 sm:px-6 lg:grid-cols-3">
          {workflow.map((item, i) => (
            <article
              key={item.title}
              className={`glass glass--interactive animate-fade-up stagger-${i + 1} p-5`}
            >
              <div className="grid size-11 place-items-center rounded-2xl bg-[var(--primary)] text-[var(--surface-0)]">
                <item.icon className="size-5" />
              </div>
              <h2 className="mt-5 text-lg font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{item.detail}</p>
            </article>
          ))}
        </section>

        {/* ── Testimonials ── */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-center animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              Dipercaya Creator Indonesia
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">
              Ribuan creator sudah pakai LinkPilot untuk presence digital mereka.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {testimonials.map((item, i) => (
              <article
                key={item.name}
                className={`glass glass--interactive animate-fade-up stagger-${i + 1} p-6`}
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  &ldquo;{item.text}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="size-10 rounded-full object-cover ring-2 ring-[var(--border)]"
                  />
                  <div>
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-center animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              Harga Transparan
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">
              Pilih plan yang sesuai kebutuhan. Upgrade atau downgrade kapan saja.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {pricingTiers.map((tier, i) => (
              <article
                key={tier.name}
                className={`relative animate-fade-up stagger-${i + 1} p-6 ${
                  tier.popular
                    ? "glass glass--glow"
                    : "glass glass--interactive"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-4 py-1 text-xs font-bold text-[var(--surface-0)] shadow-lg shadow-[var(--primary-glow)]">
                    Paling Populer
                  </div>
                )}
                <h3 className="text-lg font-bold">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-black">{tier.price}</span>
                  <span className="text-sm text-[var(--text-muted)]">{tier.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-zinc-300">
                      <CheckCircle2 className="size-4 text-[var(--primary)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`focus-ring mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold transition-base ${
                    tier.popular
                      ? "bg-[var(--primary)] text-[var(--surface-0)] hover:bg-[var(--primary-hover)] shadow-lg shadow-[var(--primary-glow)]"
                      : "glass glass--interactive"
                  }`}
                >
                  {tier.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="text-center animate-fade-up">
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              Pertanyaan Umum
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {faqs.map((item, i) => (
              <details
                key={item.q}
                className={`glass group animate-fade-up stagger-${i + 1}`}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 p-5 text-sm font-bold">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="size-5 text-[var(--primary)]" />
                    {item.q}
                  </span>
                  <span className="text-[var(--text-muted)] transition group-open:rotate-180">▼</span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-6 text-zinc-400">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-[var(--border)] bg-[var(--surface-1)]/50 py-10 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[var(--primary)]" />
              <span className="text-sm font-bold">LinkPilot</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              © 2026 LinkPilot. Bio link SaaS untuk creator Indonesia.
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="text-xs text-[var(--text-muted)] hover:text-white transition-base">
                Login
              </Link>
              <Link href="/register" className="text-xs text-[var(--text-muted)] hover:text-white transition-base">
                Register
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
