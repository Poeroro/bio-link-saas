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
      kind: "website",
      active: true,
      clicks: 1820,
      createdAt: "2026-04-02",
    },
    {
      id: "link_templates",
      title: "Creator storefront",
      url: "https://gumroad.com",
      description: "Template Notion, checklist campaign, dan swipe file.",
      kind: "website",
      active: true,
      clicks: 1414,
      createdAt: "2026-04-10",
    },
    {
      id: "link_newsletter",
      title: "Monday Signals newsletter",
      url: "https://substack.com",
      description: "Insight singkat soal produk, brand, dan creative ops.",
      kind: "website",
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
      kind: "website",
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
      createStarterLink("Newsletter", "https://substack.com", "Catatan mingguan dan resources baru.", "website", 96, now),
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

export const DEMO_USER_2: UserProfile = {
  id: "user_rendra",
  name: "Rendra Wicaksono",
  username: "rendra.dev",
  email: "rendra@biolink.test",
  password: "demo123",
  headline: "Full-stack developer & open-source enthusiast",
  bio: "Membangun tools dan produk digital yang simpel, cepat, dan open. Suka ngoprek stack baru dan berbagi lewat tulisan serta proyek open-source.",
  location: "Bandung, ID",
  avatarUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  themeId: "midnight-neon",
  totalViews: 9760,
  totalClicks: 3214,
  subscribers: 642,
  links: [
    {
      id: "link_github",
      title: "GitHub repos",
      url: "https://github.com",
      description: "Proyek open-source dan kontribusi.",
      kind: "github",
      active: true,
      clicks: 1340,
      createdAt: "2026-03-15",
    },
    {
      id: "link_blog",
      title: "Technical blog",
      url: "https://dev.to",
      description: "Tutorial, catatan teknis, dan refleksi engineering.",
      kind: "website",
      active: true,
      clicks: 892,
      createdAt: "2026-03-22",
    },
    {
      id: "link_saas",
      title: "SaaS starter kit",
      url: "https://gumroad.com",
      description: "Boilerplate Next.js + Stripe + Prisma.",
      kind: "website",
      active: true,
      clicks: 546,
      createdAt: "2026-04-05",
      scheduleStart: "2026-04-01T00:00:00+07:00",
      scheduleEnd: "2026-06-01T00:00:00+07:00",
    },
    {
      id: "link_twitter",
      title: "Twitter / X",
      url: "https://x.com",
      description: "Hot takes dan thread teknis.",
      kind: "twitter",
      active: true,
      clicks: 324,
      createdAt: "2026-04-12",
    },
    {
      id: "link_discord",
      title: "Dev community Discord",
      url: "https://discord.gg",
      description: "Diskusi, pairing session, dan code review.",
      kind: "discord",
      active: false,
      clicks: 112,
      createdAt: "2026-05-10",
    },
  ],
  analytics: Array.from({ length: 14 }, (_, index) => ({
    date: daysAgo(13 - index),
    visits: 420 + index * 28 + (index % 3) * 40,
    clicks: 160 + index * 15 + (index % 4) * 18,
    signups: 10 + (index % 5) * 5,
  })),
};

export const DEFAULT_STATE: AppState = {
  users: [DEMO_USER, DEMO_USER_2],
  currentUserId: DEMO_USER.id,
  darkMode: false,
};
