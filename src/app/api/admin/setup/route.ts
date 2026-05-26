import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ONE-TIME admin setup — delete after use
export async function GET() {
  const email = "hafidh262001@gmail.com";
  const user = await prisma.user.update({
    where: { email },
    data: { isAdmin: true },
  });
  return NextResponse.json({ ok: true, user: { email: user.email, isAdmin: user.isAdmin } });
}
