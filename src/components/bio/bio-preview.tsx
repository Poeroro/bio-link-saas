"use client";
import React from "react";

/* eslint-disable @next/next/no-img-element */

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
} from "@/components/icons/social-icons";
import type { BioLink, LinkKind, UserProfile } from "@/lib/types";
import { getTheme } from "@/lib/themes";
import { cn, formatNumber, isLinkScheduledActive } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

const linkIcons: Record<LinkKind, (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  website: WebsiteIcon,
  tiktok: TiktokIcon,
  whatsapp: WhatsAppIcon,
  telegram: TelegramIcon,
  discord: DiscordIcon,
  twitch: TwitchIcon,
  github: GithubIcon,
};

export function BioPreview({
  user,
  framed = false,
  compact = false,
  disableLinks = false,
  onLinkClick,
}: {
  user: UserProfile;
  framed?: boolean;
  compact?: boolean;
  disableLinks?: boolean;
  onLinkClick?: (link: BioLink) => void;
}) {
  const theme = getTheme(user.themeId);
  const activeLinks = user.links.filter((link) => link.active && isLinkScheduledActive(link));

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        framed ? "rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-950/12 dark:border-white/10" : "min-h-screen",
        theme.pageClass,
      )}
    >
      {user.customCss ? <style dangerouslySetInnerHTML={{ __html: user.customCss }} /> : null}
      <div className={cn("mx-auto flex min-h-full w-full max-w-xl flex-col px-4 py-6", compact ? "gap-4" : "gap-6 sm:py-10")}>
        <article className={cn("relative overflow-hidden rounded-[2rem] p-5 sm:p-7", theme.surfaceClass)}>
          <div className="absolute right-6 top-6 flex gap-2">
            <span className={cn("size-2.5 rounded-full", theme.accentClass)} />
            <span className="size-2.5 rounded-full bg-white/60" />
          </div>

          <div className="flex flex-col items-center text-center">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className={cn("size-24 rounded-full object-cover ring-4", theme.avatarClass)}
            />
            <h1 className={cn("mt-5 text-2xl font-bold leading-tight", theme.textClass)}>
              {user.name}
            </h1>
            <p className={cn("mt-2 text-sm font-semibold", theme.mutedClass)}>
              {user.location}
            </p>
            <p className={cn("mt-4 max-w-md text-sm leading-6", theme.mutedClass)}>
              {user.bio}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            <MiniStat label="Views" value={user.totalViews} textClass={theme.textClass} mutedClass={theme.mutedClass} />
            <MiniStat label="Clicks" value={user.totalClicks} textClass={theme.textClass} mutedClass={theme.mutedClass} />
            <MiniStat label="Subs" value={user.subscribers} textClass={theme.textClass} mutedClass={theme.mutedClass} />
          </div>

          <div className={cn("mt-6 flex flex-col", compact ? "gap-2.5" : "gap-3")}>
            {activeLinks.length ? (
              activeLinks.map((link) => {
                const Icon = linkIcons[link.kind] ?? WebsiteIcon;

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => {
                      if (disableLinks) {
                        event.preventDefault();
                      }

                      onLinkClick?.(link);
                    }}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl p-3 text-left transition",
                      theme.linkClass,
                    )}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-950/8 transition group-hover:scale-105 dark:bg-white/10">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{link.title}</span>
                      <span className="mt-0.5 block line-clamp-1 text-xs opacity-70">
                        {link.description}
                      </span>
                    </span>
                    <span className="text-xs font-semibold opacity-60">{formatNumber(link.clicks)}</span>
                  </a>
                );
              })
            ) : (
              <EmptyState
                title="Belum ada link aktif"
                description="Aktifkan link dari dashboard agar muncul di halaman publik."
              />
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  textClass,
  mutedClass,
}: {
  label: string;
  value: number;
  textClass: string;
  mutedClass: string;
}) {
  return (
    <div className="rounded-2xl bg-white/38 px-3 py-2 backdrop-blur dark:bg-white/8">
      <p className={cn("text-sm font-bold", textClass)}>{formatNumber(value)}</p>
      <p className={cn("text-[11px] font-semibold uppercase tracking-[0.14em]", mutedClass)}>
        {label}
      </p>
    </div>
  );
}
