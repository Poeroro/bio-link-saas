"use client";

import { ArrowRight, Loader2, Moon, Sparkles, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useBioApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { SiteName } from "@/components/site-logo";

export function AuthCard({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { login, register, state, toggleDarkMode } = useBioApp();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: mode === "register" ? "Alya Pranata" : "",
    username: mode === "register" ? "alya.pranata" : "",
    email: mode === "login" ? "maya@biolink.test" : "alya.demo@demo.test",
    password: "demo123",
  });

  const isRegister = mode === "register";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    window.setTimeout(() => {
      const ok = isRegister
        ? register(form)
        : login(form.email, form.password);

      setIsLoading(false);

      if (ok) {
        router.push("/dashboard");
      }
    }, 520);
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc,#ecfeff_45%,#fef3c7)] px-4 py-6 dark:bg-[linear-gradient(135deg,#09090b,#111827_48%,#172554)]">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-slate-950 dark:text-white dark:bg-white dark:text-slate-950">
              <Sparkles className="size-5" />
            </span>
            <span className="text-base font-black tracking-tight text-slate-950 dark:text-white">
              <SiteName />
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {state.darkMode ? <Moon className="size-4 text-slate-950 dark:text-white" /> : <Sun className="size-4 text-slate-700" />}
            <ToggleSwitch checked={state.darkMode} onChange={toggleDarkMode} label="Dark mode" />
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">
              Dummy auth
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-6xl">
              {isRegister ? "Mulai dengan bio page siap pakai." : "Masuk ke workspace creator."}
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-zinc-300">
              Data tersimpan di browser melalui localStorage. Akun demo tersedia dengan
              email maya@biolink.test dan password demo123.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/70 bg-white/86 p-5 shadow-2xl shadow-slate-950/12 backdrop-blur dark:border-white/10 dark:bg-white/7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                {isRegister ? "Register" : "Login"}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500 dark:text-zinc-400">
                {isRegister
                  ? "Form sudah terisi data awal agar flow bisa langsung dicoba."
                  : "Gunakan akun demo atau akun hasil register."}
              </p>
            </div>

            <form onSubmit={submit} className="grid gap-4">
              {isRegister ? (
                <>
                  <Field
                    label="Nama"
                    value={form.name}
                    onChange={(value) => setForm((current) => ({ ...current, name: value }))}
                  />
                  <Field
                    label="Username"
                    value={form.username}
                    prefix="@"
                    onChange={(value) => setForm((current) => ({ ...current, username: value }))}
                  />
                </>
              ) : null}
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => setForm((current) => ({ ...current, email: value }))}
              />
              <Field
                label="Password"
                type="password"
                value={form.password}
                onChange={(value) => setForm((current) => ({ ...current, password: value }))}
              />
              <Button type="submit" size="lg" disabled={isLoading} className="mt-2 w-full">
                {isLoading ? <Loader2 className="size-5 animate-spin" /> : <ArrowRight className="size-5" />}
                {isRegister ? "Buat akun" : "Masuk"}
              </Button>
            </form>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-white/5 dark:text-zinc-300">
              {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
              <Link
                href={isRegister ? "/login" : "/register"}
                className="font-bold text-slate-950 underline underline-offset-4 dark:text-slate-950 dark:text-white"
              >
                {isRegister ? "Login" : "Register dummy"}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  prefix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  prefix?: string;
}) {
  return (
    <label>
      <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">{label}</span>
      <div className="mt-2 flex rounded-2xl border border-slate-200 bg-white text-slate-950 transition focus-within:border-slate-950 dark:border-white/10 dark:bg-zinc-950/60 dark:text-slate-950 dark:text-white dark:focus-within:border-white">
        {prefix ? (
          <span className="grid place-items-center pl-4 text-sm font-bold text-slate-400">
            {prefix}
          </span>
        ) : null}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
        />
      </div>
    </label>
  );
}
