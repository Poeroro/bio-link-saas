"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, CheckCircle2, Mail } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState<"idle" | "verifying" | "sending" | "sent" | "done" | "error">("idle");
  const [method, setMethod] = useState<"otp" | "link">("link");
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-verify if token in URL (link method)
  useEffect(() => {
    if (token && emailParam) {
      verifyWithToken(token, emailParam);
    }
  }, []);

  async function verifyWithToken(t: string, e: string) {
    setStatus("verifying");
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e, token: t }),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        const data = await res.json();
        setError(data.error || "Verifikasi gagal");
        setStatus("error");
      }
    } catch {
      setError("Gagal menghubungi server");
      setStatus("error");
    }
  }

  async function sendVerification() {
    if (!email) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setMethod(data.method);
        setStatus("sent");
      } else {
        const data = await res.json();
        setError(data.error || "Gagal mengirim verifikasi");
        setStatus("error");
      }
    } catch {
      setError("Gagal menghubungi server");
      setStatus("error");
    }
  }

  async function verifyOtp() {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Masukkan 6 digit kode");
      return;
    }
    setStatus("verifying");
    setError("");
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        const data = await res.json();
        setError(data.error || "Verifikasi gagal");
        setStatus("error");
      }
    } catch {
      setError("Gagal menghubungi server");
      setStatus("error");
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#06060a] p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c10]/80 backdrop-blur-xl p-6">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-cyan-400 text-slate-950">
            <Sparkles className="size-5" />
          </div>

          {status === "done" ? (
            <div className="mt-6 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="size-5" />
              </div>
              <h1 className="mt-4 text-xl font-bold text-white">Email Terverifikasi!</h1>
              <p className="mt-2 text-sm text-zinc-400">
                Email kamu sudah terverifikasi. Sekarang bisa akses dashboard.
              </p>
              <Link
                href="/dashboard"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-cyan-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Buka Dashboard
              </Link>
            </div>
          ) : status === "sent" ? (
            <div className="mt-6">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-cyan-500/10 text-cyan-400">
                <Mail className="size-5" />
              </div>
              <h1 className="mt-4 text-center text-xl font-bold text-white">
                {method === "otp" ? "Kode Terkirim" : "Email Terkirim"}
              </h1>
              <p className="mt-2 text-center text-sm text-zinc-400">
                {method === "otp"
                  ? <>Masukkan 6 digit kode yang dikirim ke <span className="text-white">{email}</span></>
                  : <>Cek email <span className="text-white">{email}</span> dan klik link verifikasi.</>}
              </p>

              {method === "otp" && (
                <div className="mt-6">
                  <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="size-12 rounded-xl border border-white/[0.06] bg-white/[0.04] text-center text-xl font-bold text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                      />
                    ))}
                  </div>

                  {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}

                  <button
                    onClick={verifyOtp}
                    disabled={(status as string) === "verifying" || otp.join("").length !== 6}
                    className="mt-4 h-11 w-full rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                  >
                    {(status as string) === "verifying" ? "Memverifikasi..." : "Verifikasi"}
                  </button>
                </div>
              )}

              <button
                onClick={sendVerification}
                className="mt-4 w-full text-center text-sm text-cyan-400 hover:text-cyan-300 transition"
              >
                Kirim ulang
              </button>
            </div>
          ) : (
            <>
              <h1 className="mt-5 text-center text-2xl font-bold text-white">
                Verifikasi Email
              </h1>
              <p className="mt-3 text-center text-sm text-zinc-400">
                Verifikasi email kamu untuk mengakses dashboard.
              </p>

              {emailParam ? (
                <div className="mt-6 text-center">
                  <p className="text-sm text-zinc-300 mb-4">
                    Email: <span className="font-medium text-white">{email}</span>
                  </p>
                  <button
                    onClick={sendVerification}
                    disabled={status === "sending"}
                    className="h-11 w-full rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                  >
                    {status === "sending" ? "Mengirim..." : "Kirim Kode Verifikasi"}
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); sendVerification(); }}
                  className="mt-6 grid gap-4"
                >
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
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="h-11 rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                  >
                    {status === "sending" ? "Mengirim..." : "Kirim Kode Verifikasi"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}


export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
