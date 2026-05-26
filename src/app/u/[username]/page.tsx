import type { Metadata } from "next";
import { Home } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BioPreviewClient } from "@/components/bio/bio-preview-client";
import { CopyButton, ShareButton } from "@/components/bio/share-controls";
import { prisma } from "@/lib/prisma";

async function getUser(username: string) {
  return prisma.user.findUnique({
    where: { username },
    include: {
      links: { where: { visible: true }, orderBy: { order: "asc" } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) return { title: "Bio page tidak ditemukan" };

  const siteSetting = await prisma.setting.findUnique({ where: { key: "siteName" } }).catch(() => null);
  const siteName = siteSetting?.value || "LinkPilot";
  const name = user.name ?? user.username;
  const headline = user.bio ?? `Bio link ${name}`;
  const avatarUrl = user.image ?? null;

  return {
    title: `${name} | ${siteName}`,
    description: headline,
    openGraph: {
      title: `${name} - ${siteName}`,
      description: headline,
      ...(avatarUrl ? { images: [{ url: avatarUrl }] } : {}),
    },
    twitter: {
      card: "summary",
      title: `${name} - ${siteName}`,
      description: headline,
      ...(avatarUrl ? { images: [avatarUrl] } : {}),
    },
  };
}

export default async function PublicBioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) notFound();

  const now = new Date();
  const visibleLinks = user.links.filter((link) => {
    if (link.scheduleStart && new Date(link.scheduleStart) > now) return false;
    if (link.scheduleEnd && new Date(link.scheduleEnd) < now) return false;
    return true;
  });

  const name = user.name ?? user.username;
  const headline = user.bio ?? "";
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const publicUrl = origin ? `${origin}/u/${username}` : `/u/${username}`;

  return (
    <main className="relative min-h-screen">
      <div className="fixed left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/60 bg-white/78 p-1.5 shadow-xl shadow-slate-950/12 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/72">
        <Link
          href="/"
          className="grid size-10 place-items-center rounded-xl text-slate-700 transition hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-white/10"
          aria-label="Home"
        >
          <Home className="size-4" />
        </Link>
        <CopyButton url={publicUrl} />
        <ShareButton name={name} headline={headline} url={publicUrl} />
      </div>
      <BioPreviewClient
        user={{
          id: user.id,
          username: user.username,
          name,
          email: user.email ?? "",
          password: "",
          headline,
          bio: user.bio ?? "",
          location: user.location ?? "",
          avatarUrl: user.image ?? "",
          themeId: user.themeId ?? "default",
          links: visibleLinks.map((l) => ({
            id: l.id,
            title: l.label,
            url: l.url,
            description: l.description ?? "",
            kind: l.kind as any,
            active: l.visible,
            clicks: l.clicks,
            createdAt: l.createdAt.toISOString(),
            scheduleStart: l.scheduleStart?.toISOString(),
            scheduleEnd: l.scheduleEnd?.toISOString(),
          })),
          totalViews: 0,
          totalClicks: visibleLinks.reduce((sum, l) => sum + l.clicks, 0),
          subscribers: 0,
          analytics: [],
        }}
      />
    </main>
  );
}
