"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { DEFAULT_STATE, createStarterUser } from "@/lib/dummy-data";
import { readStoredState, writeStoredState } from "@/lib/storage";
import type { AppState, BioLink, LinkKind, ToastMessage, UserProfile } from "@/lib/types";
import { cn, createId, normalizeUrl, reorderLinks, slugify } from "@/lib/utils";

type RegisterInput = {
  name: string;
  username: string;
  email: string;
  password: string;
};

type LinkInput = {
  title: string;
  url: string;
  description: string;
  kind: LinkKind;
  scheduleStart?: string;
  scheduleEnd?: string;
};

type BioAppContextValue = {
  state: AppState;
  currentUser?: UserProfile;
  isReady: boolean;
  addToast: (message: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
  login: (email: string, password: string) => boolean;
  register: (input: RegisterInput) => boolean;
  logout: () => void;
  toggleDarkMode: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addLink: (link: LinkInput) => void;
  updateLink: (linkId: string, patch: Partial<BioLink>) => void;
  deleteLink: (linkId: string) => void;
  toggleLink: (linkId: string) => void;
  moveLink: (activeId: string, overId: string) => void;
  saveLinkOrder: (links: BioLink[]) => Promise<void>;
  setTheme: (themeId: string) => void;
  recordPublicVisit: (username: string) => void;
  recordLinkClick: (username: string, linkId: string) => void;
  exportData: () => string;
  importData: (json: string) => boolean;
};

const BioAppContext = createContext<BioAppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isReady, setIsReady] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      setState(readStoredState());
      setIsReady(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-sync NextAuth session → AppProvider localStorage
  useEffect(() => {
    if (!isReady) {
      return;
    }

    // NextAuth session gone → clear local login
    if (!session?.user?.email) {
      if (state.currentUserId) {
        setState((current) => ({ ...current, currentUserId: "" }));
      }
      return;
    }

    // Check if a local user with this email exists
    const existingUser = state.users.find(
      (u) => u.email.toLowerCase() === session.user!.email!.toLowerCase(),
    );

    if (existingUser) {
      // User exists locally but not logged in → auto-login
      if (state.currentUserId !== existingUser.id) {
        setState((current) => ({ ...current, currentUserId: existingUser.id }));
      }
      return;
    }

    // User doesn't exist locally → create from session
    const newUser = createStarterUser({
      name: session.user.name || session.user.email!.split("@")[0],
      username: (session.user as { username?: string }).username || session.user.email!.split("@")[0],
      email: session.user.email!,
      password: "nextauth-managed",
    });

    setState((current) => ({
      ...current,
      users: [...current.users, newUser],
      currentUserId: newUser.id,
    }));
  }, [isReady, session?.user?.email, state.users, state.currentUserId]);


  useEffect(() => {
    if (!isReady) {
      return;
    }

    writeStoredState(state);
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [isReady, state]);

  const addToast = useCallback((message: Omit<ToastMessage, "id">) => {
    const toast = { ...message, id: createId("toast") };
    setToasts((current) => [toast, ...current].slice(0, 4));

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toast.id));
    }, 3600);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const currentUser = state.users.find((user) => user.id === state.currentUserId);

  const updateCurrentUser = useCallback(
    (updater: (user: UserProfile) => UserProfile) => {
      setState((current) => ({
        ...current,
        users: current.users.map((user) =>
          user.id === current.currentUserId ? updater(user) : user,
        ),
      }));
    },
    [],
  );

  // ─── DB Sync Helpers ──────────────────────────────────────────────
  const dbLinkToLocal = (dbLink: Record<string, unknown>): BioLink => ({
    id: dbLink.id as string,
    title: (dbLink.label as string) || "",
    url: (dbLink.url as string) || "",
    description: (dbLink.description as string) || "",
    kind: (dbLink.kind as string as LinkKind) || "website",
    active: dbLink.visible !== false,
    clicks: (dbLink.clicks as number) || 0,
    createdAt: dbLink.createdAt ? new Date(dbLink.createdAt as string).toISOString() : new Date().toISOString(),
    scheduleStart: dbLink.scheduleStart ? new Date(dbLink.scheduleStart as string).toISOString() : undefined,
    scheduleEnd: dbLink.scheduleEnd ? new Date(dbLink.scheduleEnd as string).toISOString() : undefined,
  });

  // Fetch profile + links from API on login
  const fetchAndMergeProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const dbUser = await res.json();
      if (!dbUser?.id) return;
      const dbLinks: BioLink[] = (dbUser.links || []).map(dbLinkToLocal);
      setState((current) => ({
        ...current,
        users: current.users.map((u) =>
          u.email.toLowerCase() === (dbUser.email as string).toLowerCase()
            ? {
                ...u,
                id: dbUser.id as string,
                name: (dbUser.name as string) || u.name,
                username: (dbUser.username as string) || u.username,
                bio: (dbUser.bio as string) ?? u.bio,
                location: (dbUser.location as string) ?? u.location,
                avatarUrl: (dbUser.image as string) || u.avatarUrl,
                themeId: (dbUser.themeId as string) || u.themeId,
                customCss: (dbUser.customCss as string) ?? u.customCss,
                links: dbLinks.length > 0 ? dbLinks : u.links,
                totalViews: (dbUser.totalViews as number) ?? u.totalViews,
                totalClicks: (dbUser.totalClicks as number) ?? u.totalClicks,
                subscribers: (dbUser.subscribers as number) ?? u.subscribers,
              }
            : u,
        ),
      }));
    } catch (e) {
      console.error("fetchAndMergeProfile:", e);
    }
  }, []);

  // Fetch DB profile + links when session is ready
  useEffect(() => {
    if (isReady && session?.user?.email && state.currentUserId) {
      fetchAndMergeProfile();
    }
  }, [isReady, session?.user?.email, state.currentUserId, fetchAndMergeProfile]);

  const login = useCallback(
    (email: string, password: string) => {
      const user = state.users.find(
        (item) =>
          item.email.toLowerCase() === email.trim().toLowerCase() &&
          item.password === password,
      );

      if (!user) {
        addToast({
          title: "Login gagal",
          description: "Gunakan akun demo atau akun yang baru dibuat.",
          tone: "error",
        });
        return false;
      }

      setState((current) => ({ ...current, currentUserId: user.id }));
      addToast({
        title: "Berhasil masuk",
        description: `Dashboard ${user.name} siap dibuka.`,
        tone: "success",
      });
      return true;
    },
    [addToast, state.users],
  );

  const register = useCallback(
    (input: RegisterInput) => {
      const email = input.email.trim().toLowerCase();
      const requestedUsername = slugify(input.username || input.name);

      if (!email || !input.password.trim()) {
        addToast({
          title: "Data belum lengkap",
          description: "Email dan password dummy tetap diperlukan.",
          tone: "warning",
        });
        return false;
      }

      const finalEmail = state.users.some((user) => user.email.toLowerCase() === email)
        ? makeEmailAlias(email, state.users.length + 1)
        : email;

      const usernameExists = state.users.some(
        (user) => user.username.toLowerCase() === requestedUsername.toLowerCase(),
      );
      const user = createStarterUser({
        ...input,
        email: finalEmail,
        username: usernameExists ? `${requestedUsername}-${state.users.length + 1}` : requestedUsername,
      });

      setState((current) => ({
        ...current,
        users: [...current.users, user],
        currentUserId: user.id,
      }));
      addToast({
        title: "Akun dibuat",
        description: `Bio page /u/${user.username} sudah siap.`,
        tone: "success",
      });
      return true;
    },
    [addToast, state.users],
  );

  const logout = useCallback(() => {
    setState((current) => ({ ...current, currentUserId: "" }));
    addToast({ title: "Keluar dari dashboard", tone: "info" });
  }, [addToast]);

  const toggleDarkMode = useCallback(() => {
    setState((current) => ({ ...current, darkMode: !current.darkMode }));
  }, []);

  const updateProfile = useCallback(
    async (profile: Partial<UserProfile>) => {
      updateCurrentUser((user) => ({
        ...user,
        ...profile,
        username: profile.username ? slugify(profile.username) : user.username,
      }));
      addToast({ title: "Profil diperbarui", tone: "success" });
      // Sync to DB
      try {
        const body: Record<string, unknown> = {};
        if (profile.name !== undefined) body.name = profile.name;
        if (profile.username !== undefined) body.username = slugify(profile.username);
        if (profile.bio !== undefined) body.bio = profile.bio;
        if (profile.location !== undefined) body.location = profile.location;
        if (profile.headline !== undefined) body.headline = profile.headline;
        if (profile.themeId !== undefined) body.themeId = profile.themeId;
        if (profile.customCss !== undefined) body.customCss = profile.customCss;
        if (profile.avatarUrl !== undefined) body.image = profile.avatarUrl;
        if (Object.keys(body).length > 0) {
          await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        }
      } catch (e) { console.error("updateProfile sync:", e); }
    },
    [addToast, updateCurrentUser],
  );

  const addLink = useCallback(
    async (link: LinkInput) => {
      const tempId = createId("link");
      updateCurrentUser((user) => ({
        ...user,
        links: [
          {
            id: tempId,
            title: link.title.trim() || "Link baru",
            url: normalizeUrl(link.url),
            description: link.description.trim() || "Tambahkan deskripsi singkat.",
            kind: link.kind,
            active: true,
            clicks: 0,
            createdAt: new Date().toISOString(),
            scheduleStart: link.scheduleStart || undefined,
            scheduleEnd: link.scheduleEnd || undefined,
          },
          ...user.links,
        ],
      }));
      addToast({ title: "Link ditambahkan", tone: "success" });
      // Sync to DB
      try {
        const res = await fetch("/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: link.kind,
            label: link.title.trim() || "Link baru",
            url: normalizeUrl(link.url),
            description: link.description.trim() || "Tambahkan deskripsi singkat.",
            visible: true,
            scheduleStart: link.scheduleStart || null,
            scheduleEnd: link.scheduleEnd || null,
          }),
        });
        if (res.ok) {
          const dbLink = await res.json();
          // Replace temp ID with real DB ID
          updateCurrentUser((user) => ({
            ...user,
            links: user.links.map((l) => l.id === tempId ? dbLinkToLocal(dbLink) : l),
          }));
        }
      } catch (e) { console.error("addLink sync:", e); }
    },
    [addToast, updateCurrentUser],
  );

  const updateLink = useCallback(
    async (linkId: string, patch: Partial<BioLink>) => {
      updateCurrentUser((user) => ({
        ...user,
        links: user.links.map((link) =>
          link.id === linkId
            ? {
                ...link,
                ...patch,
                url: patch.url ? normalizeUrl(patch.url) : link.url,
              }
            : link,
        ),
      }));
      addToast({ title: "Link diperbarui", tone: "success" });
      // Sync to DB
      try {
        const body: Record<string, unknown> = { id: linkId };
        if (patch.title !== undefined) body.label = patch.title;
        if (patch.url !== undefined) body.url = normalizeUrl(patch.url);
        if (patch.description !== undefined) body.description = patch.description;
        if (patch.kind !== undefined) body.kind = patch.kind;
        if (patch.active !== undefined) body.visible = patch.active;
        if (patch.scheduleStart !== undefined) body.scheduleStart = patch.scheduleStart;
        if (patch.scheduleEnd !== undefined) body.scheduleEnd = patch.scheduleEnd;
        await fetch("/api/links", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (e) { console.error("updateLink sync:", e); }
    },
    [addToast, updateCurrentUser],
  );

  const deleteLink = useCallback(
    async (linkId: string) => {
      updateCurrentUser((user) => ({
        ...user,
        links: user.links.filter((link) => link.id !== linkId),
      }));
      addToast({ title: "Link dihapus", tone: "info" });
      // Sync to DB
      try { await fetch(`/api/links?id=${linkId}`, { method: "DELETE" }); }
      catch (e) { console.error("deleteLink sync:", e); }
    },
    [addToast, updateCurrentUser],
  );

  const toggleLink = useCallback(
    async (linkId: string) => {
      let newActive = false;
      updateCurrentUser((user) => ({
        ...user,
        links: user.links.map((link) => {
          if (link.id === linkId) { newActive = !link.active; return { ...link, active: newActive }; }
          return link;
        }),
      }));
      addToast({ title: "Status link diubah", tone: "success" });
      // Sync to DB
      try {
        await fetch("/api/links", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: linkId, visible: newActive }),
        });
      } catch (e) { console.error("toggleLink sync:", e); }
    },
    [addToast, updateCurrentUser],
  );

  const moveLink = useCallback(
    (activeId: string, overId: string) => {
      updateCurrentUser((user) => ({
        ...user,
        links: reorderLinks(user.links, activeId, overId),
      }));
    },
    [updateCurrentUser],
  );

  const saveLinkOrder = useCallback(
    async (links: BioLink[]) => {
      try {
        const res = await fetch("/api/links/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            links: links.map((l, i) => ({ id: l.id, order: i })),
          }),
        });
        if (res.ok) {
          addToast({ title: "Urutan link disimpan", tone: "success" });
        } else {
          addToast({ title: "Gagal menyimpan urutan", tone: "error" });
        }
      } catch (e) {
        console.error("saveLinkOrder sync:", e);
        addToast({ title: "Gagal menyimpan urutan", tone: "error" });
      }
    },
    [addToast],
  );

  const setTheme = useCallback(
    async (themeId: string) => {
      updateCurrentUser((user) => ({ ...user, themeId }));
      addToast({ title: "Tema diterapkan", tone: "success" });
      // Sync to DB
      try {
        await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ themeId }),
        });
      } catch (e) { console.error("setTheme sync:", e); }
    },
    [addToast, updateCurrentUser],
  );

  const recordPublicVisit = useCallback((username: string) => {
    setState((current) => ({
      ...current,
      users: current.users.map((user) => {
        if (user.username !== username) {
          return user;
        }

        const analytics = [...user.analytics];
        const last = analytics[analytics.length - 1];

        if (last) {
          analytics[analytics.length - 1] = { ...last, visits: last.visits + 1 };
        }

        return { ...user, totalViews: user.totalViews + 1, analytics };
      }),
    }));
  }, []);

  const recordLinkClick = useCallback((username: string, linkId: string) => {
    setState((current) => ({
      ...current,
      users: current.users.map((user) => {
        if (user.username !== username) {
          return user;
        }

        const analytics = [...user.analytics];
        const last = analytics[analytics.length - 1];

        if (last) {
          analytics[analytics.length - 1] = { ...last, clicks: last.clicks + 1 };
        }

        return {
          ...user,
          totalClicks: user.totalClicks + 1,
          links: user.links.map((link) =>
            link.id === linkId ? { ...link, clicks: link.clicks + 1 } : link,
          ),
          analytics,
        };
      }),
    }));
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importData = useCallback(
    (json: string) => {
      try {
        const parsed = JSON.parse(json) as AppState;
        if (!parsed.users || !Array.isArray(parsed.users)) {
          addToast({ title: "Import gagal", description: "Format data tidak valid.", tone: "error" });
          return false;
        }
        setState(parsed);
        addToast({ title: "Data diimport", description: `${parsed.users.length} akun berhasil dimuat.`, tone: "success" });
        return true;
      } catch {
        addToast({ title: "Import gagal", description: "File JSON tidak valid.", tone: "error" });
        return false;
      }
    },
    [addToast],
  );

  const value = useMemo(
    () => ({
      state,
      currentUser,
      isReady,
      addToast,
      dismissToast,
      login,
      register,
      logout,
      toggleDarkMode,
      updateProfile,
      addLink,
      updateLink,
      deleteLink,
      toggleLink,
      moveLink,
      saveLinkOrder,
      setTheme,
      recordPublicVisit,
      recordLinkClick,
      exportData,
      importData,
    }),
    [
      addLink,
      addToast,
      currentUser,
      deleteLink,
      dismissToast,
      exportData,
      importData,
      isReady,
      login,
      logout,
      moveLink,
      saveLinkOrder,
      recordLinkClick,
      recordPublicVisit,
      register,
      setTheme,
      state,
      toggleDarkMode,
      toggleLink,
      updateLink,
      updateProfile,
    ],
  );

  return (
    <BioAppContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </BioAppContext.Provider>
  );
}

function makeEmailAlias(email: string, index: number) {
  const [local, domain = "demo.test"] = email.split("@");
  return `${local}+${index}@${domain}`;
}

export function useBioApp() {
  const context = useContext(BioAppContext);

  if (!context) {
    throw new Error("useBioApp must be used inside AppProvider");
  }

  return context;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  const icons = {
    success: CheckCircle2,
    info: Info,
    warning: AlertTriangle,
    error: XCircle,
  };

  return (
    <div className="fixed right-4 top-4 z-50 flex w-auto max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = icons[toast.tone];

        return (
          <div
            key={toast.id}
            className={cn(
              "rounded-2xl border bg-white/92 p-4 shadow-2xl shadow-slate-950/12 backdrop-blur-xl transition dark:border-white/10 dark:bg-zinc-950/92",
              toast.tone === "success" && "border-emerald-200",
              toast.tone === "info" && "border-sky-200",
              toast.tone === "warning" && "border-amber-200",
              toast.tone === "error" && "border-rose-200",
            )}
          >
            <div className="flex gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-slate-950 dark:text-white" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                  {toast.title}
                </p>
                {toast.description ? (
                  <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Tutup notifikasi"
                onClick={() => onDismiss(toast.id)}
                className="grid size-7 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}