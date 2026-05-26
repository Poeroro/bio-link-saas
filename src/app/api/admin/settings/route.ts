import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-helpers";

// ─── Default settings ────────────────────────────────────────────────
const DEFAULTS: Record<string, string> = {
  siteName: "LinkPilot",
  siteDescription: "Satu halaman untuk semua link penting.",
  maxLinksPerUser: "50",
  maintenanceMode: "false",
  registrationOpen: "true",
  smtpHost: "",
  smtpPort: "587",
  smtpUser: "",
  smtpPass: "",
  analyticsEnabled: "true",
  requireEmailVerification: "false",
  verificationMethod: "link",
  rateLimiting: "true",
};

// ─── GET /api/admin/settings ─────────────────────────────────────────
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Fetch all rows, merge with defaults
  const rows = await prisma.setting.findMany();
  const map: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) {
    map[row.key] = row.value;
  }

  return NextResponse.json(map);
}

// ─── PUT /api/admin/settings ─────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();

  // Upsert each key
  const entries = Object.entries(body).filter(
    ([k]) => k in DEFAULTS
  ) as [string, string][];

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );

  return NextResponse.json({ ok: true, updated: entries.length });
}
