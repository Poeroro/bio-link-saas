"use client";

import { useEffect, useState } from "react";

export function SiteName({ fallback = "LinkUS" }: { fallback?: string }) {
  const [name, setName] = useState(fallback);

  useEffect(() => {
    fetch("/api/site-name")
      .then((r) => r.json())
      .then((d) => { if (d.name) setName(d.name); })
      .catch(() => {});
  }, []);

  // "Link" white, "US" cyan gradient
  const linkPart = "Link";
  const usPart = name.includes("US") ? "US" : name.slice(linkPart.length);

  return (
    <span className="font-serif text-lg font-bold tracking-tight">
      <span className="text-white">{linkPart}</span>
      <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">{usPart}</span>
    </span>
  );
}
