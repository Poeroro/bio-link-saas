"use client";

import { Save } from "lucide-react";
import { useState } from "react";
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

  return (
    <SectionCard
      title="Edit Profile"
      eyebrow="Identity"
      action={
        <Button
          size="sm"
          onClick={() => onSave(draft)}
          className="shrink-0"
        >
          <Save className="size-4" />
          Simpan
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nama"
          value={draft.name}
          onChange={(value) => setDraft((current) => ({ ...current, name: value }))}
        />
        <Field
          label="Username"
          value={draft.username}
          prefix="@"
          onChange={(value) => setDraft((current) => ({ ...current, username: value }))}
        />
        <Field
          label="Headline"
          value={draft.headline}
          onChange={(value) => setDraft((current) => ({ ...current, headline: value }))}
        />
        <Field
          label="Lokasi"
          value={draft.location}
          onChange={(value) => setDraft((current) => ({ ...current, location: value }))}
        />
        <label className="sm:col-span-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Bio</span>
          <textarea
            value={draft.bio}
            onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-white dark:focus:border-white"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Avatar URL</span>
          <input
            value={draft.avatarUrl}
            onChange={(event) => setDraft((current) => ({ ...current, avatarUrl: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-white dark:focus:border-white"
          />
        </label>
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
