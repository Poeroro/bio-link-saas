"use client";

/* eslint-disable @next/next/no-img-element */

import { Copy, ExternalLink, QrCode, Share2 } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/lib/types";
import { getPublicUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";

export function QrSharePanel({
  user,
  onToast,
}: {
  user: UserProfile;
  onToast: (title: string, description?: string) => void;
}) {
  const [publicUrl, setPublicUrl] = useState(`/u/${user.username}`);
  const [qr, setQr] = useState("");

  useEffect(() => {
    const url = getPublicUrl(user.username);
    QRCode.toDataURL(url, {
      width: 240,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    }).then((dataUrl) => {
      setPublicUrl(url);
      setQr(dataUrl);
    });
  }, [user.username]);

  const copy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    onToast("Link publik disalin", publicUrl);
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
    <SectionCard title="QR & Share" eyebrow="Public page">
      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white">
          {qr ? (
            <img src={qr} alt={`QR code ${user.username}`} className="aspect-square w-full rounded-2xl" />
          ) : (
            <div className="grid aspect-square place-items-center rounded-2xl bg-slate-100">
              <QrCode className="size-8 text-slate-400" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">
              /u/{user.username}
            </p>
            <p className="mt-2 break-all rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-white/5 dark:text-zinc-300">
              {publicUrl}
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button variant="secondary" onClick={copy}>
              <Copy className="size-4" />
              Copy
            </Button>
            <Button variant="secondary" onClick={share}>
              <Share2 className="size-4" />
              Share
            </Button>
            <a
              href={`/u/${user.username}`}
              target="_blank"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-slate-950 dark:text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200"
            >
              <ExternalLink className="size-4" />
              Open
            </a>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
