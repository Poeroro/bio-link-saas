import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, verificationEmailHtml, otpEmailHtml } from "@/lib/email";

export async function POST(req: NextRequest) {
  const reqOrigin = req.headers.get("origin") || req.nextUrl.origin;
  // Allow authenticated or email-in-body for pre-login verification
  const session = await auth();
  let email = session?.user?.email || "";

  // Normalize email
  email = email.trim().toLowerCase();

  if (!email) {
    try {
      const body = await req.json();
      if (body.email) email = body.email;
    } catch {
      // no body
    }
  }

  // Normalize email
  email = email.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check settings
  const [reqVerify, method] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "requireEmailVerification" } }),
    prisma.setting.findUnique({ where: { key: "verificationMethod" } }),
  ]);

  if (reqVerify?.value !== "true") {
    return NextResponse.json({ required: false });
  }

  const verificationMethod = method?.value || "link";
  const siteSetting = await prisma.setting.findUnique({ where: { key: "siteName" } });
  const siteName = siteSetting?.value || "LinkPilot";

  // Delete old tokens
  await prisma.verificationToken.deleteMany({ where: { identifier: `verify:${email}` } });

  if (verificationMethod === "otp") {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.verificationToken.create({
      data: { identifier: `verify:${email}`, token: otp, expires },
    });

    try {
      await sendEmail(email, `Kode Verifikasi — ${siteName}`, otpEmailHtml(siteName, otp));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[send-verification] email error:", msg);
      return NextResponse.json({ error: "Gagal mengirim email", detail: msg }, { status: 500 });
    }

    return NextResponse.json({ ok: true, required: true, method: "otp" });
  } else {
    // Link verification
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: { identifier: `verify:${email}`, token, expires },
    });

    const origin = reqOrigin;
    const verifyUrl = `${origin}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    try {
      await sendEmail(email, `Verifikasi Email — ${siteName}`, verificationEmailHtml(siteName, verifyUrl));
    } catch (e) {
      console.error("[send-verification] email error:", e);
      return NextResponse.json({ error: "Gagal mengirim email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, required: true, method: "link" });
  }
}
