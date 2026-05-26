"use client";
import { SparkleLogo } from "@/components/sparkle-logo";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  if (!token || !email) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#06060a] p-4">
        <div className="w-full max-w-md text-center">
          <p className="text-red-400 text-sm">Link reset tidak valid. Silakan minta link baru.</p>
          <Link href="/forgot-password" className="mt-4 inline-block text-sm text-cyan-400 hover:text-cyan-300">
            Lupa Password
          </Link>
        </div>
      </main>
    );
 }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Password tidak cocok");
      return;
 }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
 }

    setStatus("saving");
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
 });

      if (res.ok) {
        setStatus("done");
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
            <SparkleLogo className="size-5" />
          </div>

          {status === "done" ? (
            <div className="mt-6 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="size-5" />
              </div>
              <h1 className="mt-4 text-xl font-bold text-white">Password Berhasil Diubah</h1>
              <p className="mt-2 text-sm text-zinc-400">Silakan login dengan password baru kamu.</p>
              <Link
                href="/login"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-cyan-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mt-5 text-center text-2xl font-bold text-white">
                Reset Password
              </h1>
              <p className="mt-2 text-center text-sm text-zinc-400">
                Buat password baru untuk <span className="text-white">{email}</span>
              </p>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-zinc-300">Password Baru</span>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      required
                      className="h-11 w-full rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 pr-10 text-sm text-white placeholder-zinc-500 transition focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-zinc-300">Konfirmasi Password</span>
                  <input
                    type={showPw ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Ulangi password"
                    required
                    className="h-11 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 text-sm text-white placeholder-zinc-500 transition focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </label>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={status === "saving"}
                  className="h-11 rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                >
                  {status === "saving" ? "Menyimpan..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}


export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
