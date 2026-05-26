"use client";

import { useEffect, useState } from "react";

export function SiteName({ fallback = "LinkPilot" }: { fallback?: string }) {
  const [name, setName] = useState(fallback);

  useEffect(() => {
    fetch("/api/site-name")
      .then((r) => r.json())
      .then((d) => { if (d.name) setName(d.name); })
      .catch(() => {});
  }, []);

  return <>{name}</>;
}
