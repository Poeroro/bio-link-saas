import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail, resetPasswordEmailHtml } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  // Always return success to prevent email enumeration
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  // Generate token
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Delete old tokens for this email, then create new one
  await prisma.verificationToken.deleteMany({ where: { identifier: normalizedEmail } });
  await prisma.verificationToken.create({
    data: { identifier: normalizedEmail, token, expires },
  });

  // Get site name
  const siteSetting = await prisma.setting.findUnique({ where: { key: "siteName" } });
  const siteName = siteSetting?.value || "LinkPilot";

  // Build reset URL
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const resetUrl = `${origin}/reset-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;

  // Send email
  try {
    await sendEmail(
      normalizedEmail,
      `Reset Password — ${siteName}`,
      resetPasswordEmailHtml(siteName, resetUrl),
    );
  } catch (e) {
    console.error("[forgot-password] email send error:", e);
  }

  return NextResponse.json({ ok: true });
}
