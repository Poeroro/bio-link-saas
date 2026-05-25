"use client";

import { Copy, Home, Share2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { BioPreview } from "@/components/bio/bio-preview";
import { useBioApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { getPublicUrl } from "@/lib/utils";

export default function PublicBioPage() {
  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params.username ?? "");
  const { state, isReady, addToast, recordPublicVisit, recordLinkClick } = useBioApp();
  const visitedRef = useRef(false);
  const user = useMemo(
    () => state.users.find((item) => item.username.toLowerCase() === username.toLowerCase()),
    [state.users, username],
  );

  useEffect(() => {
    if (!user || visitedRef.current) {
      return;
    }

    recordPublicVisit(user.username);
    visitedRef.current = true;
  }, [recordPublicVisit, user]);

  if (!isReady) {
    return <LoadingState label="Memuat halaman publik" />;
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-4 dark:bg-zinc-950">
        <section className="max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/7">
          <EmptyState
            title="Bio page tidak ditemukan"
            description="Username ini belum tersimpan di localStorage browser."
          />
          <Link
            href="/"
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
          >
            <Home className="size-4" />
            Kembali
          </Link>
        </section>
      </main>
    );
  }

  const publicUrl = getPublicUrl(user.username);

  const copy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    addToast({ title: "Link disalin", description: publicUrl, tone: "success" });
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${user.name} Bio Link`,
        text: user.headline,
        url: publicUrl,
      });
      return;
    }

    await copy();
  };

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
        <Button variant="ghost" size="sm" onClick={copy}>
          <Copy className="size-4" />
          Copy
        </Button>
        <Button variant="primary" size="sm" onClick={share}>
          <Share2 className="size-4" />
          Share
        </Button>
      </div>
      <BioPreview
        user={user}
        onLinkClick={(link) => {
          recordLinkClick(user.username, link.id);
        }}
      />
    </main>
  );
}
