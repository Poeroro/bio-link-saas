import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [setting, user] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "requireEmailVerification" } }),
    prisma.user.findUnique({
      where: { email: session.user.email },
      select: { emailVerified: true },
    }),
  ]);

  const required = setting?.value === "true";
  const verified = !!user?.emailVerified;

  return NextResponse.json({
    required,
    verified,
    needsVerification: required && !verified,
  });
}
