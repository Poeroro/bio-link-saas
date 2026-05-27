"use client";

import {
  Edit3,
  GripVertical,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
  WebsiteIcon,
  TiktokIcon,
  WhatsAppIcon,
  TelegramIcon,
  DiscordIcon,
  TwitchIcon,
  GithubIcon,
  FacebookIcon,
} from "@/components/icons/social-icons";
import React, { useState } from "react";
import type { BioLink, LinkKind } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

type IconComponent = (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;

const LINK_KIND_OPTIONS: Array<{
  value: LinkKind;
  label: string;
  icon: IconComponent;
}> = [
  { value: "twitter", label: "Twitter", icon: TwitterIcon },
  { value: "instagram", label: "Instagram", icon: InstagramIcon },
  { value: "youtube", label: "YouTube", icon: YoutubeIcon },
  { value: "website", label: "Website", icon: WebsiteIcon },
  { value: "tiktok", label: "TikTok", icon: TiktokIcon },
  { value: "whatsapp", label: "WhatsApp", icon: WhatsAppIcon },
  { value: "telegram", label: "Telegram", icon: TelegramIcon },
  { value: "discord", label: "Discord", icon: DiscordIcon },
  { value: "twitch", label: "Twitch", icon: TwitchIcon },
  { value: "github", label: "GitHub", icon: GithubIcon },
  { value: "facebook", label: "Facebook", icon: FacebookIcon },
];

export function LinkManager({
  links,
  onAdd,
  onUpdate,
  onDelete,
  onToggle,
  onMove,
  onSaveOrder,
}: {
  links: BioLink[];
  onAdd: (link: Omit<BioLink, "id" | "clicks" | "active" | "createdAt">) => void;
  onUpdate: (linkId: string, patch: Partial<BioLink>) => void;
  onDelete: (linkId: string) => void;
  onToggle: (linkId: string) => void;
  onMove: (activeId: string, overId: string) => void;
  onSaveOrder: (links: BioLink[]) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    title: "New campaign link",
    url: "https://example.com/campaign",
    description: "Landing page terbaru untuk audience utama.",
    kind: "website" as LinkKind,
    scheduleStart: "",
    scheduleEnd: "",
  });
  const [editDraft, setEditDraft] = useState(draft);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);

  const submitNew = () => {
    onAdd({
      ...draft,
      scheduleStart: draft.scheduleStart || undefined,
      scheduleEnd: draft.scheduleEnd || undefined,
    });
    setDraft({
      title: "",
      url: "",
      description: "",
      kind: "website",
      scheduleStart: "",
      scheduleEnd: "",
    });
  };

  const startEditing = (link: BioLink) => {
    setEditingId(link.id);
    setEditDraft({
      title: link.title,
      url: link.url,
      description: link.description,
      kind: link.kind,
      scheduleStart: link.scheduleStart ?? "",
      scheduleEnd: link.scheduleEnd ?? "",
    });
  };

  const saveEditing = (linkId: string) => {
    onUpdate(linkId, {
      ...editDraft,
      scheduleStart: editDraft.scheduleStart || undefined,
      scheduleEnd: editDraft.scheduleEnd || undefined,
    });
    setEditingId(null);
  };

  return (
    <SectionCard title="Tambah & Kelola Link" eyebrow="Link stack">
      <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/5 sm:grid-cols-[1fr_1fr_auto] sm:p-5">
        <input
          value={draft.title}
          onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          placeholder="Judul link"
          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none focus:border-slate-950 dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
        />
        <input
          value={draft.url}
          onChange={(event) => setDraft((current) => ({ ...current, url: event.target.value }))}
          placeholder="https://..."
          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none focus:border-slate-950 dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
        />
        <select
          value={draft.kind}
          onChange={(event) =>
            setDraft((current) => ({ ...current, kind: event.target.value as LinkKind }))
          }
          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none focus:border-slate-950 dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
        >
          {LINK_KIND_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          value={draft.description}
          onChange={(event) =>
            setDraft((current) => ({ ...current, description: event.target.value }))
          }
          placeholder="Deskripsi singkat"
          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none focus:border-slate-950 dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:focus:border-white sm:col-span-2"
        />
        <Button onClick={submitNew} disabled={!draft.title.trim() || !draft.url.trim()}>
          <Plus className="size-4" />
          Tambah
        </Button>
      </div>

      <div className="mt-5 grid gap-3">
        {links.length ? (
          links.map((link) => {
            const option = LINK_KIND_OPTIONS.find((item) => item.value === link.kind) ?? LINK_KIND_OPTIONS[0];
            const Icon = option.icon;
            const isEditing = editingId === link.id;

            return (
              <div
                key={link.id}
                draggable
                onDragStart={(event) => {
                  setDraggingId(link.id);
                  event.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={() => setDraggingId(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggingId) {
                    onMove(draggingId, link.id);
                    setHasOrderChanges(true);
                  }
                  setDraggingId(null);
                }}
                className={cn(
                  "rounded-3xl border bg-white p-4 transition dark:bg-white/7",
                  draggingId === link.id
                    ? "border-cyan-400 opacity-70"
                    : "border-slate-200 dark:border-white/10",
                )}
              >
                {isEditing ? (
                  <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                    <input
                      value={editDraft.title}
                      onChange={(event) =>
                        setEditDraft((current) => ({ ...current, title: event.target.value }))
                      }
                      className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none focus:border-slate-950 dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                    />
                    <input
                      value={editDraft.url}
                      onChange={(event) =>
                        setEditDraft((current) => ({ ...current, url: event.target.value }))
                      }
                      className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none focus:border-slate-950 dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                    />
                    <select
                      value={editDraft.kind}
                      onChange={(event) =>
                        setEditDraft((current) => ({
                          ...current,
                          kind: event.target.value as LinkKind,
                        }))
                      }
                      className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none focus:border-slate-950 dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                    >
                      {LINK_KIND_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <input
                      value={editDraft.description}
                      onChange={(event) =>
                        setEditDraft((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none focus:border-slate-950 dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:focus:border-white md:col-span-2"
                    />
                    <input
                      type="date"
                      value={editDraft.scheduleStart}
                      onChange={(event) =>
                        setEditDraft((current) => ({
                          ...current,
                          scheduleStart: event.target.value,
                        }))
                      }
                      placeholder="Schedule start"
                      className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none focus:border-slate-950 dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                    />
                    <input
                      type="date"
                      value={editDraft.scheduleEnd}
                      onChange={(event) =>
                        setEditDraft((current) => ({
                          ...current,
                          scheduleEnd: event.target.value,
                        }))
                      }
                      placeholder="Schedule end"
                      className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none focus:border-slate-950 dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                    />
                    <Button onClick={() => saveEditing(link.id)}>
                      <Save className="size-4" />
                      Simpan
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <button
                        type="button"
                        className="grid size-10 shrink-0 cursor-grab place-items-center rounded-2xl bg-slate-100 text-slate-500 active:cursor-grabbing dark:bg-white/10 dark:text-zinc-300"
                        aria-label="Pindah urutan link"
                      >
                        <GripVertical className="size-5" />
                      </button>
                      <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                          {link.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-zinc-400">
                          {link.url}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-zinc-400">
                          {link.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                        {formatNumber(link.clicks)}
                      </span>
                      <ToggleSwitch
                        checked={link.active}
                        onChange={() => onToggle(link.id)}
                        label={`${link.title} aktif`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Edit ${link.title}`}
                        onClick={() => startEditing(link)}
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        aria-label={`Hapus ${link.title}`}
                        onClick={() => onDelete(link.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <EmptyState
            title="Belum ada link"
            description="Tambahkan link pertama untuk mengisi halaman publik dan preview realtime."
            icon={Plus}
          />
        )}
      </div>

      {hasOrderChanges && links.length > 1 && (
        <div className="mt-4 flex justify-end">
          <Button onClick={() => { onSaveOrder(links); setHasOrderChanges(false); }}>
            <Save className="size-4" />
            Simpan Urutan
          </Button>
        </div>
      )}
    </SectionCard>
  );
}
