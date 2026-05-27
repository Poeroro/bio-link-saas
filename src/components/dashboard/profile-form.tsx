"use client";

import { Save, Upload, Key, Eye, EyeOff } from "lucide-react";
import { useState, useRef } from "react";
import type { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";

export function ProfileForm({
  user,
  onSave,
}: {
  user: UserProfile;
  onSave: (profile: Partial<UserProfile>) => void;
}) {
  const [draft, setDraft] = useState({
    name: user.name,
    username: user.username,
    headline: user.headline,
    bio: user.bio,
    location: user.location,
    avatarUrl: user.avatarUrl,
  });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/avatar", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setDraft((current) => ({ ...current, avatarUrl: data.url }));
        onSave({ avatarUrl: data.url });
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SectionCard
      title="Edit Profile"
      eyebrow="Identity"
      action={
        <Button size="sm" onClick={() => onSave(draft)} className="shrink-0">
          <Save className="size-4" />
          Simpan
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Avatar upload */}
        <div className="sm:col-span-2 flex items-center gap-4">
          <div
            className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-200 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 shrink-0 cursor-pointer group"
            onClick={() => fileRef.current?.click()}
          >
            {draft.avatarUrl ? (
              <img src={draft.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-500">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-5 h-5 text-slate-950 dark:text-white" />
            </div>
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileChange} />
            <Button size="sm" variant="secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Avatar"}
            </Button>
            <p className="mt-1 text-xs text-zinc-500">JPEG, PNG, WebP, GIF. Max 2MB.</p>
          </div>
        </div>
        <Field label="Nama" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value }))} />
        <Field label="Username" value={draft.username} prefix="@" onChange={(value) => setDraft((current) => ({ ...current, username: value }))} />
        <Field label="Headline" value={draft.headline} onChange={(value) => setDraft((current) => ({ ...current, headline: value }))} />
        <Field label="Lokasi" value={draft.location} onChange={(value) => setDraft((current) => ({ ...current, location: value }))} />
        <label className="sm:col-span-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Bio</span>
          <textarea
            value={draft.bio}
            onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-white dark:focus:border-white"
          />
        </label>
      </div>
    </SectionCard>
  );
}

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    setMessage(null);
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Password baru tidak cocok" });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password minimal 6 karakter" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "ok", text: "Password berhasil diubah!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.error || "Gagal mengubah password" });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard title="Ubah Password" eyebrow="Keamanan">
      <div className="grid gap-4 max-w-md">
        <div>
          <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Password Saat Ini</span>
          <div className="mt-2 flex rounded-2xl border border-slate-200 bg-white text-sm text-slate-950 transition focus-within:border-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-white dark:focus-within:border-white">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
              placeholder="Masukkan password saat ini"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="px-3 text-zinc-400 hover:text-slate-950 dark:text-white">
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Password Baru</span>
          <div className="mt-2 flex rounded-2xl border border-slate-200 bg-white text-sm text-slate-950 transition focus-within:border-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-white dark:focus-within:border-white">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
              placeholder="Minimal 6 karakter"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="px-3 text-zinc-400 hover:text-slate-950 dark:text-white">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Konfirmasi Password Baru</span>
          <div className="mt-2 flex rounded-2xl border border-slate-200 bg-white text-sm text-slate-950 transition focus-within:border-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-white dark:focus-within:border-white">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
              placeholder="Ulangi password baru"
            />
          </div>
        </div>
        {message && (
          <p className={`text-sm font-medium ${message.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>
            {message.text}
          </p>
        )}
        <div>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Key className="size-4" />
            {saving ? "Menyimpan..." : "Ubah Password"}
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

function Field({
  label,
  value,
  onChange,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
}) {
  return (
    <label>
      <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">{label}</span>
      <div className="mt-2 flex rounded-2xl border border-slate-200 bg-white text-sm text-slate-950 transition focus-within:border-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-white dark:focus-within:border-white">
        {prefix ? (
          <span className="grid place-items-center pl-4 font-semibold text-slate-400">{prefix}</span>
        ) : null}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
        />
      </div>
    </label>
  );
}
