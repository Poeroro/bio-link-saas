"use client";

import type { BioLink, UserProfile } from "@/lib/types";
import { BioPreview } from "./bio-preview";

export function BioPreviewClient({ user }: { user: UserProfile }) {
  return (
    <BioPreview
      user={user}
      onLinkClick={(link: BioLink) => {
        fetch("/api/clicks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ linkId: link.id, userId: user.id }),
        }).catch(() => {});
      }}
    />
  );
}
