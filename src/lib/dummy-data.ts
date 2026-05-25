import type { AppState, LinkKind, UserProfile } from "./types";
import { createId, slugify } from "./utils";

const today = new Date("2026-05-25T09:00:00+07:00");

function daysAgo(index: number) {
  const date = new Date(today);
  date.setDate(today.getDate() - index);
  return date.toISOString().slice(0, 10);
}

export const DEMO_USER: UserProfile = {
  id: "user_maya",
  name: "Maya Adhitama",
  username: "maya.studio",
  email: "maya@biolink.test",
  password: "demo123",
  headline: "Creative director and launch strategist",
  bio: "Membantu founder, kreator, dan brand kecil merapikan presence digital mereka dalam satu halaman yang rapi, cepat, dan terasa premium.",
  location: "Jakarta, ID",
  avatarUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  themeId: "ocean-glass",
  totalViews: 18420,
  totalClicks: 6328,
  subscribers: 1284,
  links: [
    {
      id: "link_strategy",
      title: "Book a launch strategy call",
      url: "https://cal.com",
      description: "30 menit untuk audit funnel dan rencana minggu pertama.",
      kind: "calendar",
      active: true,
      clicks: 1820,
      createdAt: "2026-04-02",
    },
    {
      id: "link_templates",
      title: "Creator storefront",
      url: "https://gumroad.com",
      description: "Template Notion, checklist campaign, dan swipe file.",
      kind: "shop",
      active: true,
      clicks: 1414,
      createdAt: "2026-04-10",
    },
    {
      id: "link_newsletter",
      title: "Monday Signals newsletter",
      url: "https://substack.com",
      description: "Insight singkat soal produk, brand, dan creative ops.",
      kind: "newsletter",
      active: true,
      clicks: 1168,
      createdAt: "2026-04-13",
    },
    {
      id: "link_youtube",
      title: "YouTube studio notes",
      url: "https://youtube.com",
      description: "Breakdown campaign dan eksperimen konten.",
      kind: "youtube",
      active: true,
      clicks: 906,
      createdAt: "2026-04-21",
    },
    {
      id: "link_media",
      title: "Press kit download",
      url: "https://drive.google.com",
      description: "Bio, foto, deck media, dan logo.",
      kind: "download",
      active: false,
      clicks: 208,
      createdAt: "2026-05-01",
    },
  ],
  analytics: Array.from({ length: 14 }, (_, index) => ({
    date: daysAgo(13 - index),
    visits: 640 + index * 37 + (index % 3) * 56,
    clicks: 210 + index * 21 + (index % 4) * 24,
    signups: 18 + (index % 5) * 7,
  })),
};

export const DEFAULT_STATE: AppState = {
  users: [DEMO_USER],
  currentUserId: DEMO_USER.id,
  darkMode: false,
};

export function createStarterUser(input: {
  name: string;
  username?: string;
  email: string;
  password: string;
}): UserProfile {
  const username = slugify(input.username || input.name || input.email.split("@")[0]);
  const now = new Date().toISOString();

  return {
    id: createId("user"),
    name: input.name.trim() || "New Creator",
    username: username || `creator-${Date.now().toString().slice(-4)}`,
    email: input.email.trim().toLowerCase(),
    password: input.password || "demo123",
    headline: "Independent creator building a sharper online home",
    bio: "Halaman baru yang siap dipakai untuk membagikan karya, produk, dan channel utama dalam satu tempat.",
    location: "Indonesia",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    themeId: "studio-pearl",
    totalViews: 1280,
    totalClicks: 462,
    subscribers: 94,
    links: [
      createStarterLink("Website utama", "https://example.com", "Portfolio, layanan, dan kontak.", "website", 184, now),
      createStarterLink("Instagram", "https://instagram.com", "Update harian dan behind the scenes.", "instagram", 143, now),
      createStarterLink("Newsletter", "https://substack.com", "Catatan mingguan dan resources baru.", "newsletter", 96, now),
    ],
    analytics: Array.from({ length: 14 }, (_, index) => ({
      date: daysAgo(13 - index),
      visits: 32 + index * 8 + (index % 3) * 5,
      clicks: 12 + index * 4 + (index % 4) * 3,
      signups: 2 + (index % 5),
    })),
  };
}

function createStarterLink(
  title: string,
  url: string,
  description: string,
  kind: LinkKind,
  clicks: number,
  createdAt: string,
) {
  return {
    id: createId("link"),
    title,
    url,
    description,
    kind,
    active: true,
    clicks,
    createdAt,
  };
}
