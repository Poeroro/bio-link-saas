"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Settings,
  Shield,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  Crown,
  Activity,
  Link2,
  MousePointerClick,
  Edit,
  X,
  Save,
  RefreshCw,
  Database,
  Mail,
  Key,
  Bell,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import AdminSidebar from "@/components/admin/admin-sidebar";

// ─── Types ───────────────────────────────────────────────────────────
interface Stats {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
  newUsersToday: number;
  newUsersWeek: number;
  topUsers: {
    id: string;
    name: string | null;
    username: string;
    email: string;
    image: string | null;
    totalClicks: number;
  }[];
}

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  username: string;
  image: string | null;
  isAdmin: boolean;
  emailVerified: boolean;
  createdAt: string;
  _count: { links: number; clickEvents: number };
}



// ─── Glass Card ──────────────────────────────────────────────────────
function GlassCard({ children, className = "", style, glow }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; glow?: string }) {
  return (
    <div
      className={`bg-[#0c0c10]/80 backdrop-blur-xl rounded-2xl border border-white/[0.06] ${className}`}
      style={{ ...style, ...(glow ? { boxShadow: `0 0 20px ${glow}` } : {}) }}
    >
      {children}
    </div>
  );
}

// ─── Mesh Orbs Background ────────────────────────────────────────────
function MeshOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/[0.07] blur-[120px]" />
      <div className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] rounded-full bg-purple-500/[0.06] blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-emerald-500/[0.05] blur-[120px]" />
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────
function TabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 rounded-xl" style={{ background: "linear-gradient(90deg, #141418 25%, #1e1e24 50%, #141418 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.8s ease-in-out infinite" }} />
      <div className="h-64 rounded-2xl" style={{ background: "linear-gradient(90deg, #141418 25%, #1e1e24 50%, #141418 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.8s ease-in-out infinite" }} />
    </div>
  );
}

// ─── Stat Card (reusable) ────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, glow, borderColor, delay }: { label: string; value: number; icon: typeof Users; color: string; glow: string; borderColor: string; delay: number }) {
  return (
    <GlassCard className={`p-4 sm:p-6 ${borderColor}`} glow={glow} style={{ animation: "fadeSlideUp 0.4s ease both", animationDelay: `calc(${delay} * 0.06s)` }}>
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
        <span className="text-xs sm:text-sm text-slate-400">{label}</span>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-white">{value.toLocaleString()}</div>
    </GlassCard>
  );
}

// ─── Page ────────────────────────────────────────────────────────────
type Tab = "overview" | "users" | "settings";

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [sessionUser, setSessionUser] = useState<{ id: string; name?: string | null } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // fetch session on mount
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (!data?.user) {
          router.push("/login");
          return;
        }
        setSessionUser(data.user);
        // check admin
        fetch("/api/admin/stats").then((r) => {
          if (r.status === 403) {
            setIsAdmin(false);
          } else {
            setIsAdmin(true);
          }
        });
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (!sessionUser || isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#06060a] flex items-center justify-center">
        <MeshOrbs />
        <div className="relative z-10 text-slate-400">Loading...</div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-[#06060a] flex items-center justify-center">
        <MeshOrbs />
        <GlassCard className="relative z-10 p-8 text-center max-w-md mx-4">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400">You do not have admin privileges.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060a] flex">
      <MeshOrbs />
      <AdminSidebar activeTab={tab} onTabChange={setTab} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto relative z-10 pt-16 lg:pt-8">
        {tab === "overview" && <OverviewTab />}
        {tab === "users" && <UsersTab />}
        {tab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────────────────────
function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <TabSkeleton />;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-cyan-400", glow: "rgba(34,211,238,0.08)", borderColor: "border-cyan-400/20" },
    { label: "Total Links", value: stats.totalLinks, icon: Link2, color: "text-emerald-400", glow: "rgba(52,211,153,0.08)", borderColor: "border-emerald-400/20" },
    { label: "Total Clicks", value: stats.totalClicks, icon: MousePointerClick, color: "text-purple-400", glow: "rgba(192,132,252,0.08)", borderColor: "border-purple-400/20" },
    { label: "New Today", value: stats.newUsersToday, icon: Activity, color: "text-amber-400", glow: "rgba(251,191,36,0.08)", borderColor: "border-amber-400/20" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-white">Platform Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c, i) => (
          <StatCard key={c.label} {...c} delay={i} />
        ))}
      </div>

      <GlassCard className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">New This Week: {stats.newUsersWeek}</h2>
        <h3 className="text-xs sm:text-sm font-medium text-slate-400 mb-3">Top Users by Clicks</h3>
        <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="text-left text-slate-500 border-b border-white/[0.06]">
                <th className="pb-2">User</th>
                <th className="pb-2">Username</th>
                <th className="pb-2 text-right">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {stats.topUsers.map((u) => (
                <tr key={u.id} className="border-b border-white/[0.03] hover:bg-[#1e1e24] transition-colors duration-200">
                  <td className="py-2 text-white flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">{u.name || u.email}</span>
                  </td>
                  <td className="py-2 text-slate-400">@{u.username}</td>
                  <td className="py-2 text-right text-cyan-400 font-medium">{u.totalClicks.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Users Tab ───────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", username: "", isAdmin: false });

  const loadUsers = (q?: string) => {
    setLoading(true);
    const params = q ? `?search=${encodeURIComponent(q)}` : "";
    fetch(`/api/admin/users${params}`)
      .then((r) => r.json())
      .then((data) => { setUsers(data); setLoading(false); });
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSearch = () => loadUsers(search);

  const openEdit = (u: AdminUser) => {
    setEditUser(u);
    setEditForm({ name: u.name || "", email: u.email, username: u.username, isAdmin: u.isAdmin });
  };

  const saveEdit = async () => {
    if (!editUser) return;
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: editUser.id, updates: editForm }),
    });
    setEditUser(null);
    loadUsers(search);
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Delete this user and all their data?")) return;
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    loadUsers(search);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-white">Users</h1>
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by name, email, or username..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0c0c10]/80 backdrop-blur-xl border border-white/[0.06] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 bg-cyan-400/10 text-cyan-400 rounded-xl text-sm font-medium hover:bg-cyan-400/20 transition-colors border border-cyan-400/15"
        >
          Search
        </button>
      </div>

      {loading ? (
        <TabSkeleton />
      ) : (
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-left text-slate-500 border-b border-white/[0.06]">
                  <th className="p-4">User</th>
                                    <th className="p-4 text-center">Email</th>
                  <th className="p-4 text-center">Links</th>
                  <th className="p-4 text-center">Clicks</th>
                  <th className="p-4 text-center">Admin</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/[0.03] hover:bg-[#1e1e24] transition-colors duration-200">
                    <td className="p-4">
                      <div className="text-white font-medium truncate max-w-[200px]">{u.name || "—"}</div>
                      <div className="text-slate-500 text-xs truncate max-w-[200px]">{u.email} · @{u.username}</div>
                    </td>
                    <td className="p-4 text-center">
                      {u.emailVerified ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center text-slate-300">{u._count.links}</td>
                    <td className="p-4 text-center text-cyan-400">{u._count.clickEvents}</td>
                    <td className="p-4 text-center">
                      {u.isAdmin ? (
                        <Crown className="w-4 h-4 text-amber-400 mx-auto" />
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.04] transition-colors"
                        title="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/[0.04] transition-colors ml-1"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditUser(null)}>
          <div className="w-full max-w-md bg-[#16161c] border border-white/[0.08] rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Edit User</h2>
              <button onClick={() => setEditUser(null)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Name</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 bg-[#0c0c10] border border-white/[0.06] rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3 py-2 bg-[#0c0c10] border border-white/[0.06] rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Username</label>
                <input type="text" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} className="w-full px-3 py-2 bg-[#0c0c10] border border-white/[0.06] rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400" />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="isAdmin" checked={editForm.isAdmin} onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })} className="w-4 h-4 rounded border-white/[0.06] bg-[#0c0c10] text-cyan-400 focus:ring-cyan-400" />
                <label htmlFor="isAdmin" className="text-sm text-slate-300">Admin</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditUser(null)} className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={saveEdit} className="px-5 py-2 rounded-lg text-sm font-medium bg-cyan-400/10 text-cyan-400 border border-cyan-400/15 hover:bg-cyan-400/20 transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────────
function SettingsTab() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    maxLinksPerUser: "50",
    maintenanceMode: false,
    registrationOpen: true,
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPass: "",
    analyticsEnabled: true,
    requireEmailVerification: false,
    verificationMethod: "link",
    rateLimiting: true,
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        setSettings({
          siteName: data.siteName || "",
          siteDescription: data.siteDescription || "",
          maxLinksPerUser: data.maxLinksPerUser || "50",
          maintenanceMode: data.maintenanceMode === "true",
          registrationOpen: data.registrationOpen === "true",
          smtpHost: data.smtpHost || "",
          smtpPort: data.smtpPort || "587",
          smtpUser: data.smtpUser || "",
          smtpPass: data.smtpPass || "",
          analyticsEnabled: data.analyticsEnabled === "true",
          requireEmailVerification: data.requireEmailVerification === "true",
          verificationMethod: data.verificationMethod || "link",
          rateLimiting: data.rateLimiting === "true",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      // Convert booleans to strings for DB
      const payload: Record<string, string> = {};
      for (const [k, v] of Object.entries(settings)) {
        payload[k] = String(v);
      }
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <TabSkeleton />;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-cyan-400/10 text-cyan-400 border border-cyan-400/15 hover:bg-cyan-400/20 transition-colors disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Platform */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Platform</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Site Name" value={settings.siteName} onChange={(v) => handleChange("siteName", v)} />
          <Field label="Max Links/User" value={settings.maxLinksPerUser} onChange={(v) => handleChange("maxLinksPerUser", v)} type="number" />
          <div className="sm:col-span-2">
            <Field label="Site Description" value={settings.siteDescription} onChange={(v) => handleChange("siteDescription", v)} />
          </div>
        </div>
      </GlassCard>

      {/* Features */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <Database className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Features</h2>
        </div>
        <div className="space-y-3">
          <Toggle label="Open Registration" description="Allow new users to register" checked={settings.registrationOpen} onChange={(v) => handleChange("registrationOpen", v)} />
          <Toggle label="Maintenance Mode" description="Show maintenance page to non-admins" checked={settings.maintenanceMode} onChange={(v) => handleChange("maintenanceMode", v)} />
          <Toggle label="Analytics" description="Track clicks and page views" checked={settings.analyticsEnabled} onChange={(v) => handleChange("analyticsEnabled", v)} />
        </div>
      </GlassCard>

      {/* Email / SMTP */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Email (SMTP)</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="SMTP Host" value={settings.smtpHost} onChange={(v) => handleChange("smtpHost", v)} placeholder="smtp.gmail.com" />
          <Field label="SMTP Port" value={settings.smtpPort} onChange={(v) => handleChange("smtpPort", v)} type="number" />
          <Field label="SMTP User" value={settings.smtpUser} onChange={(v) => handleChange("smtpUser", v)} placeholder="you@gmail.com" />
          <Field label="SMTP Password" value={settings.smtpPass} onChange={(v) => handleChange("smtpPass", v)} type="password" />
        </div>
      </GlassCard>

      {/* Security */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <Key className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Security</h2>
        </div>
        <div className="space-y-3">
          <Toggle label="Require Email Verification" description="Users must verify email before accessing dashboard" checked={settings.requireEmailVerification} onChange={(v) => handleChange("requireEmailVerification", v)} />
          {settings.requireEmailVerification && (
            <div className="ml-3 pl-3 border-l border-white/[0.06]">
              <p className="text-xs text-slate-400 mb-2">Verification Method</p>
              <div className="flex gap-2">
                {(["link", "otp"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => handleChange("verificationMethod", m)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      settings.verificationMethod === m
                        ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/15"
                        : "bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:text-white"
                    }`}
                  >
                    {m === "link" ? "Email Link" : "OTP Code"}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Toggle label="Rate Limiting" description="Limit API requests per IP" checked={settings.rateLimiting} onChange={(v) => handleChange("rateLimiting", v)} />
        </div>
      </GlassCard>

      {/* Account */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Account</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">Sign out dari admin panel.</p>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-red-400/10 text-red-400 border border-red-400/15 hover:bg-red-400/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </GlassCard>
    </div>
  );
}

// ─── Field Component ─────────────────────────────────────────────────
function Field({ label, value, onChange, type = "text", placeholder, selectOptions }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; selectOptions?: string[] }) {
  return (
    <label className="block">
      <span className="text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 block">{label}</span>
      {selectOptions ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 sm:h-11 px-3 sm:px-4 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
        >
          {selectOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-[#0c0c10]">{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 sm:h-11 px-3 sm:px-4 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-slate-600"
        />
      )}
    </label>
  );
}

// ─── Toggle Component ────────────────────────────────────────────────
function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-slate-500">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
          checked ? "bg-cyan-400" : "bg-white/[0.1]"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}