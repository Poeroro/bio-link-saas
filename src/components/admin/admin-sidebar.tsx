"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Users,
  Globe2,
  Settings,
  Shield,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/domains", label: "Domains", icon: Globe2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-[#0c0c10]/80 backdrop-blur-xl border-r border-white/[0.06] flex flex-col min-h-screen">
      <div className="p-6 flex items-center gap-2">
        <Shield className="w-6 h-6 text-cyan-400" />
        <span className="text-lg font-bold text-white">Admin Panel</span>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-cyan-400/10 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.12)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/[0.06]">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>
    </aside>
  );
}
