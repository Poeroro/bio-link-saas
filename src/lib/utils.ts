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
