import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, code, token } = await req.json();

  if (!email || (!code && !token)) {
    return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const identifier = `verify:${normalizedEmail}`;

  // Find the token/OTP
  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier,
      ...(code ? { token: code } : { token }),
    },
  });

  if (!record) {
    return NextResponse.json({ error: "Kode/token tidak valid" }, { status: 400 });
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return NextResponse.json({ error: "Kode/token sudah kedaluwarsa" }, { status: 400 });
  }

  // Mark email as verified
  await prisma.user.update({
    where: { email: normalizedEmail },
    data: { emailVerified: new Date() },
  });

  // Clean up tokens
  await prisma.verificationToken.deleteMany({ where: { identifier } });

  return NextResponse.json({ ok: true });
}
