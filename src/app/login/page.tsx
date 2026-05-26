"use client";

import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setIsLoading(false);

    if (!result?.ok) {
      setError("Email atau password salah.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc,#ecfeff_45%,#fef3c7)] px-4 py-6 dark:bg-[linear-gradient(135deg,#09090b,#111827_48%,#172554)]">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <Sparkles className="size-5" />
            </span>
            <span className="text-base font-black tracking-tight text-slate-950 dark:text-white">
              LinkPilot
            </span>
          </Link>
        </nav>

        <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">
              Autentikasi
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-6xl">
              Masuk ke workspace creator.
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-zinc-300">
              Kelola bio page, link, dan analytics dari satu dashboard.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/70 bg-white/86 p-5 shadow-2xl shadow-slate-950/12 backdrop-blur dark:border-white/10 dark:bg-white/7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                Login
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                Masukkan email dan password akun kamu.
              </p>
            </div>

            {error ? (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300">
                {error}
              </div>
            ) : null}

            <form onSubmit={submit} className="grid gap-4">
              <label>
                <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
                  Email
                </span>
                <div className="mt-2 flex rounded-2xl border border-slate-200 bg-white text-slate-950 transition focus-within:border-slate-950 dark:border-white/10 dark:bg-zinc-950/60 dark:text-white dark:focus-within:border-white">
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
                    placeholder="email@contoh.com"
                  />
                </div>
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
                  Password
                </span>
                <div className="mt-2 flex rounded-2xl border border-slate-200 bg-white text-slate-950 transition focus-within:border-slate-950 dark:border-white/10 dark:bg-zinc-950/60 dark:text-white dark:focus-within:border-white">
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-slate-950"
              >
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <ArrowRight className="size-5" />
                )}
                Masuk
              </button>
            </form>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-white/5 dark:text-zinc-300">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-bold text-slate-950 underline underline-offset-4 dark:text-white"
              >
                Register
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
