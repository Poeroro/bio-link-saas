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
  Palette,
  QrCode,
  Shield,
  Smartphone,
  
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { SiteName } from "@/components/site-logo";
import { BioPreview } from "@/components/bio/bio-preview";
import { useBioApp } from "@/components/providers/app-provider";
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
    name: "Gratis",
    price: "Rp 0",
    period: "selamanya",
    features: ["Unlimited link", "Semua tema premium", "Analytics lengkap", "Custom CSS", "QR code", "Share link", "Export data", "Priority support"],
    cta: "Mulai Sekarang",
    popular: true,
 },
];

const faqs = [
  {
    q: "Apa itu LinkPilot?",
    a: "LinkPilot adalah bio link SaaS yang memungkinkan kamu membuat satu halaman untuk semua link penting. Seperti Linktree, tapi dengan fitur lebih lengkap dan tema yang bisa dikustomisasi.",
 },
  {
    q: "Apakah data saya aman?",
    a: "Ya! Semua data tersimpan aman di database kami. Kamu bisa export data kapan saja.",
 },
  {
    q: "Berapa biayanya?",
    a: "LinkPilot 100% gratis. Semua fitur tersedia untuk semua pengguna tanpa biaya.",
 },
];

export default function Home() {
  const { state, currentUser } = useBioApp();
  const demoUser = currentUser ?? state.users[0];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06060a] text-white">
      {/* ── Mesh Gradient Orbs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-cyan-500/35 blur-[80px]"
          style={{ animation: "floatOrb 20s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full bg-violet-500/35 blur-[80px]"
          style={{ animation: "floatOrb 20s ease-in-out infinite 3s" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/35 blur-[80px]"
          style={{ animation: "floatOrb 20s ease-in-out infinite 6s" }}
        />
      </div>

      {/* ── Nav ── */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <SiteName />
        </Link>
        <div className="flex items-center gap-4">
          {currentUser ? (
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 text-sm font-bold text-slate-950 transition hover:opacity-90"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-semibold text-zinc-400 transition hover:text-white sm:block"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-white/10 px-4 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
        <div className="max-w-3xl">
          <div
            className="animate-fade-slide-up inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400 backdrop-blur-xl"
            style={{ animationDelay: "calc(var(--i, 0) * 0.08s)" }}
          >
            <span className="size-2 rounded-full bg-cyan-400" />
            Bio link SaaS
          </div>
          <h1
            className="animate-fade-slide-up mt-6 font-serif text-5xl font-semibold leading-[0.95] tracking-normal sm:text-7xl"
            style={{ "--i": 1, animationDelay: "calc(1 * 0.08s)" } as React.CSSProperties}
          >
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              LinkPilot
            </span>{" "}
            Bio Link
          </h1>
          <p
            className="animate-fade-slide-up mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg"
            style={{ "--i": 2, animationDelay: "calc(2 * 0.08s)" } as React.CSSProperties}
          >
            Satu halaman bio link yang terasa seperti produk SaaS matang: editor realtime,
            template visual, QR code, analytics dummy, dan data yang tersimpan di browser.
          </p>

          <div
            className="animate-fade-slide-up mt-7 flex flex-col gap-3 sm:flex-row"
            style={{ "--i": 3, animationDelay: "calc(3 * 0.08s)" } as React.CSSProperties}
          >
            {currentUser ? (
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30"
              >
                Buka Dashboard
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30"
                >
                  Mulai Gratis
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-[#0c0c10]/80 px-5 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[#141418]/80"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          <div
            className="animate-fade-slide-up mt-8 grid gap-3 sm:grid-cols-4"
            style={{ "--i": 4, animationDelay: "calc(4 * 0.08s)" } as React.CSSProperties}
          >
            {featureRows.map((item, idx) => (
              <div
                key={item.label}
                className="glass-card p-4 transition-all duration-200 hover:bg-white/[0.06]"
                style={{ "--i": 5 + idx, animationDelay: `calc(${5 + idx} * 0.08s)` } as React.CSSProperties}
              >
                <item.icon className="size-5 text-cyan-400" />
                <p className="mt-3 text-sm font-bold text-zinc-300">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-10 hidden w-44 rounded-3xl bg-[#0c0c10]/80 p-4 shadow-2xl backdrop-blur-xl border border-white/[0.06] sm:block">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Views
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {formatNumber(demoUser.totalViews)}
            </p>
            <div className="mt-4 h-2 rounded-full bg-white/[0.06]">
              <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
            </div>
          </div>
          <BioPreview user={demoUser} framed compact disableLinks />
        </div>
      </section>

      {/* ── Workflow ── */}
      <section className="relative z-10 mx-auto grid max-w-7xl gap-4 px-4 pb-14 sm:px-6 lg:grid-cols-3">
        {workflow.map((item, idx) => (
          <article
            key={item.title}
            className="animate-fade-slide-up glass-card-lg p-5 transition-all duration-200 hover:bg-white/[0.06]"
            style={{ "--i": idx, animationDelay: `calc(${idx} * 0.08s)` } as React.CSSProperties}
          >
            <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 text-cyan-400">
              <item.icon className="size-5" />
            </div>
            <h2 className="mt-5 text-lg font-bold text-white">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {item.detail}
            </p>
          </article>
        ))}
      </section>

      {/* ── Testimonials ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
            Dipercaya Creator Indonesia
          </h2>
          <p className="mt-4 text-zinc-400">
            Ribuan creator sudah pakai LinkPilot untuk presence digital mereka.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {testimonials.map((item, idx) => (
            <article
              key={item.name}
              className="animate-fade-slide-up glass-card-lg p-6 transition-all duration-200 hover:bg-white/[0.06]"
              style={{ "--i": idx, animationDelay: `calc(${idx} * 0.08s)` } as React.CSSProperties}
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="size-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-white">{item.name}</p>
                  <p className="text-xs text-zinc-500">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
            Harga Transparan
          </h2>
          <p className="mt-4 text-zinc-400">
            Semua fitur tersedia untuk semua pengguna. Gratis selamanya.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {pricingTiers.map((tier, idx) => (
            <article
              key={tier.name}
              className={`animate-fade-slide-up relative p-6 backdrop-blur-xl transition-all duration-200 hover:bg-white/[0.06] ${
                tier.popular
                  ? "glass-card-lg border-cyan-400/30 shadow-lg shadow-cyan-500/10"
                  : "glass-card-lg"
 }`}
              style={{ "--i": idx, animationDelay: `calc(${idx} * 0.08s)` } as React.CSSProperties}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-1 text-xs font-bold text-slate-950">
                  Paling Populer
                </div>
              )}
              <h3 className="text-lg font-bold text-white">{tier.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{tier.price}</span>
                <span className="text-sm text-zinc-500">{tier.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-zinc-400">
                    <CheckCircle2 className="size-4 text-cyan-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={currentUser ? "/dashboard" : "/register"}
                className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold transition ${
                  tier.popular
                    ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:shadow-lg hover:shadow-cyan-500/20"
                    : "border border-white/[0.06] bg-white/[0.04] text-white hover:bg-white/[0.08]"
 }`}
              >
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
            Pertanyaan Umum
          </h2>
        </div>
        <div className="mt-10 space-y-4">
          {faqs.map((item, idx) => (
            <details
              key={item.q}
              className="group animate-fade-slide-up glass-card-lg"
              style={{ "--i": idx, animationDelay: `calc(${idx} * 0.08s)` } as React.CSSProperties}
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 p-5 text-sm font-bold text-white">
                <span className="flex items-center gap-3">
                  <HelpCircle className="size-5 text-cyan-400" />
                  {item.q}
                </span>
                <span className="text-zinc-500 transition group-open:rotate-180">▼</span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-6 text-zinc-400">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#06060a]/80 py-10 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white"><SiteName /></span>
          </div>
          <p className="text-xs text-zinc-500">
            © 2026 <SiteName />. Bio link SaaS untuk creator Indonesia.
          </p>
          <div className="flex gap-4">
            {currentUser ? (
              <Link href="/dashboard" className="text-xs text-cyan-400 hover:text-white">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-xs text-zinc-500 hover:text-white">
                  Login
                </Link>
                <Link href="/register" className="text-xs text-zinc-500 hover:text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </main>
  );
}
