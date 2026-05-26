import type { BioLink } from "./types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function createId(prefix = "id") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export function normalizeUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "https://example.com";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function reorderLinks(links: BioLink[], activeId: string, overId: string) {
  const from = links.findIndex((link) => link.id === activeId);
  const to = links.findIndex((link) => link.id === overId);

  if (from < 0 || to < 0 || from === to) {
    return links;
  }

  const next = [...links];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);

  return next;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function getPublicUrl(username: string) {
  if (typeof window === "undefined") {
    return `/u/${username}`;
  }

  return `${window.location.origin}/u/${username}`;
}

export function isLinkScheduledActive(link: BioLink): boolean {
  const now = new Date();

  if (link.scheduleStart) {
    const start = new Date(link.scheduleStart);
    if (now < start) return false;
  }

  if (link.scheduleEnd) {
    const end = new Date(link.scheduleEnd);
    if (now > end) return false;
  }

  return true;
}

export function getRelativeTime(date: string | Date): string {
  const now = Date.now();
  const then = typeof date === "string" ? new Date(date).getTime() : date.getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return "baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;
  if (diffWeek < 5) return `${diffWeek} minggu lalu`;
  if (diffMonth < 12) return `${diffMonth} bulan lalu`;

  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear} tahun lalu`;
}
