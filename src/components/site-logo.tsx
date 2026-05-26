"use client";

import { useEffect, useState } from "react";

export function SiteName({ fallback = "Link US" }: { fallback?: string }) {
  const [name, setName] = useState(fallback);

  useEffect(() => {
    fetch("/api/site-name")
      .then((r) => r.json())
      .then((d) => { if (d.name) setName(d.name); })
      .catch(() => {});
  }, []);

  // Split: "Link" gets gradient, rest gets white
  const linkPart = "Link";
  const rest = name.startsWith(linkPart) ? name.slice(linkPart.length) : name;

  return (
    <span className="font-serif font-bold tracking-tight text-lg">
      <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
        {linkPart}
      </span>
      <span className="text-white">{rest}</span>
    </span>
  );
}
