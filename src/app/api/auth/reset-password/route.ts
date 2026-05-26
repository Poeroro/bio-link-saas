import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  const { token, email, password } = await req.json();

  if (!token || !email || !password) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Find the token
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: normalizedEmail, token } },
  });

  if (!record) {
    return NextResponse.json({ error: "Token tidak valid" }, { status: 400 });
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { identifier_token: { identifier: normalizedEmail, token } } });
    return NextResponse.json({ error: "Token sudah kedaluwarsa" }, { status: 400 });
  }

  // Update password
  const hashed = await hash(password, 12);
  await prisma.user.update({
    where: { email: normalizedEmail },
    data: { password: hashed },
  });

  // Delete used token
  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: normalizedEmail, token } },
  });

  return NextResponse.json({ ok: true });
}
