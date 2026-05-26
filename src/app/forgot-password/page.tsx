"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        const data = await res.json();
        setError(data.error || "Terjadi kesalahan");
        setStatus("error");
      }
    } catch {
      setError("Gagal menghubungi server");
      setStatus("error");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#06060a] p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c10]/80 backdrop-blur-xl p-6">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-cyan-400 text-slate-950">
            <Sparkles className="size-5" />
          </div>

          {status === "sent" ? (
            <div className="mt-6 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Mail className="size-5" />
              </div>
              <h1 className="mt-4 text-xl font-bold text-white">Email Terkirim</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Kami sudah mengirim link reset password ke <span className="text-white font-medium">{email}</span>.
                Cek inbox dan spam folder kamu.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
              >
                <ArrowLeft className="size-4" />
                Kembali ke Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mt-5 text-center text-2xl font-bold text-white">
                Lupa Password?
              </h1>
              <p className="mt-3 text-center text-sm leading-6 text-zinc-400">
                Masukkan email akun kamu. Kami akan mengirim link untuk reset password.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-zinc-300">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    required
                    className="h-11 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 text-sm text-white placeholder-zinc-500 transition focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </label>

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="h-11 rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                >
                  {status === "sending" ? "Mengirim..." : "Kirim Link Reset"}
                </button>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition"
                >
                  <ArrowLeft className="size-3.5" />
                  Kembali ke Login
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
