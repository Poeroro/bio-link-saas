import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "siteName" } });
    return NextResponse.json({ name: setting?.value || "LinkPilot" });
  } catch {
    return NextResponse.json({ name: "LinkPilot" });
  }
}
