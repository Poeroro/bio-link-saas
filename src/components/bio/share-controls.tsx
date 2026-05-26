"use client";

import { Copy, Share2 } from "lucide-react";
import { useState } from "react";

export function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-white/10"
    >
      <Copy className="size-4" />
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export function ShareButton({
  name,
  headline,
  url,
}: {
  name: string;
  headline: string;
  url: string;
}) {
  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: `${name} Bio Link`, text: headline, url });
      return;
    }
    await navigator.clipboard.writeText(url);
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-cyan-400 px-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
    >
      <Share2 className="size-4" />
      Share
    </button>
  );
}
