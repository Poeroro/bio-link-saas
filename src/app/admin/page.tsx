"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  BarChart3,
  Globe2,
  Settings,
  Shield,
  Trash2,
  Search,
  Crown,
  Activity,
  Link2,
  MousePointerClick,
  Eye,
  EyeOff,
} from "lucide-react";
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
  plan: string;
  isAdmin: boolean;
  createdAt: string;
  _count: { links: number; clickEvents: number };
}

interface DomainEntry {
  id: string;
  domain: string;
  verified: boolean;
  createdAt: string;
  user: { id: string; name: string | null; email: string; username: string };
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

// ─── Page ────────────────────────────────────────────────────────────
type Tab = "overview" | "users" | "domains" | "settings";

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
        <GlassCard className="relative z-10 p-8 text-center max-w-md">
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
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto relative z-10">
        {/* Tab nav */}
        <div className="flex gap-1 mb-8 bg-[#0c0c10]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-1 w-fit">
          {(["overview", "users", "domains", "settings"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-cyan-400/10 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.12)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && <OverviewTab />}
        {tab === "users" && <UsersTab />}
        {tab === "domains" && <DomainsTab />}
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
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <GlassCard
            key={c.label}
            className={`p-6 ${c.borderColor}`}
            glow={c.glow}
            style={{ animation: "fadeSlideUp 0.4s ease both", animationDelay: `calc(${i} * 0.06s)` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <c.icon className={`w-5 h-5 ${c.color}`} />
              <span className="text-sm text-slate-400">{c.label}</span>
            </div>
            <div className="text-3xl font-bold text-white">{c.value.toLocaleString()}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-6">
        <h2 className="text-lg font-bold text-white mb-4">New This Week: {stats.newUsersWeek}</h2>
        <h3 className="text-sm font-medium text-slate-400 mb-3">Top Users by Clicks</h3>
        <table className="w-full text-sm">
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
                  <Crown className="w-4 h-4 text-amber-400" />
                  {u.name || u.email}
                </td>
                <td className="py-2 text-slate-400">@{u.username}</td>
                <td className="py-2 text-right text-cyan-400 font-medium">{u.totalClicks.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}

// ─── Users Tab ───────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = (q?: string) => {
    setLoading(true);
    const params = q ? `?search=${encodeURIComponent(q)}` : "";
    fetch(`/api/admin/users${params}`)
      .then((r) => r.json())
      .then((data) => { setUsers(data); setLoading(false); });
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSearch = () => loadUsers(search);

  const toggleAdmin = async (userId: string, current: boolean) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, field: "isAdmin", value: !current }),
    });
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Users</h1>
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
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-white/[0.06]">
                <th className="p-4">User</th>
                <th className="p-4">Plan</th>
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
                    <div className="text-white font-medium">{u.name || "—"}</div>
                    <div className="text-slate-500 text-xs">{u.email} · @{u.username}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-white/[0.04] border border-white/[0.06] text-slate-300">
                      {u.plan}
                    </span>
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
                      onClick={() => toggleAdmin(u.id, u.isAdmin)}
                      className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.04] transition-colors"
                      title={u.isAdmin ? "Remove admin" : "Make admin"}
                    >
                      {u.isAdmin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
        </GlassCard>
      )}
    </div>
  );
}

// ─── Domains Tab ─────────────────────────────────────────────────────
function DomainsTab() {
  const [domains, setDomains] = useState<DomainEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDomains = () => {
    setLoading(true);
    fetch("/api/admin/domains")
      .then((r) => r.json())
      .then((data) => { setDomains(data); setLoading(false); });
  };

  useEffect(() => { loadDomains(); }, []);

  const toggleVerify = async (domainId: string, current: boolean) => {
    await fetch("/api/admin/domains", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domainId, verified: !current }),
    });
    loadDomains();
  };

  const deleteDomain = async (domainId: string) => {
    if (!confirm("Delete this domain?")) return;
    await fetch("/api/admin/domains", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domainId }),
    });
    loadDomains();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Custom Domains</h1>
      {loading ? (
        <TabSkeleton />
      ) : domains.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <Globe2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No custom domains yet.</p>
        </GlassCard>
      ) : (
        <GlassCard className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-white/[0.06]">
                <th className="p-4">Domain</th>
                <th className="p-4">User</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.id} className="border-b border-white/[0.03] hover:bg-[#1e1e24] transition-colors duration-200">
                  <td className="p-4 text-white font-medium">{d.domain}</td>
                  <td className="p-4 text-slate-400">{d.user.name || d.user.email}</td>
                  <td className="p-4 text-center">
                    {d.verified ? (
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/15">Verified</span>
                    ) : (
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-amber-400/10 text-amber-400 border border-amber-400/15">Pending</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleVerify(d.id, d.verified)}
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-white/[0.04] transition-colors"
                      title={d.verified ? "Mark unverified" : "Mark verified"}
                    >
                      {d.verified ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteDomain(d.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/[0.04] transition-colors ml-1"
                      title="Delete domain"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────────
function SettingsTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <GlassCard className="p-8 text-center">
        <Settings className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">Admin settings coming soon.</p>
      </GlassCard>
    </div>
  );
}
