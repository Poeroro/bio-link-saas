import { createTransport } from "nodemailer";
import { prisma } from "@/lib/prisma";

async function getSmtpSettings() {
  const rows = await prisma.setting.findMany({
    where: { key: { in: ["smtpHost", "smtpPort", "smtpUser", "smtpPass", "siteName"] } },
  });
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return {
    host: map.smtpHost || "",
    port: parseInt(map.smtpPort || "587", 10),
    user: map.smtpUser || "",
    pass: map.smtpPass || "",
    siteName: map.siteName || "LinkPilot",
  };
}

export async function sendEmail(to: string, subject: string, html: string) {
  const cfg = await getSmtpSettings();
  if (!cfg.host || !cfg.user) {
    console.warn("[email] SMTP not configured, skipping send to", to);
    return false;
  }

  const transporter = createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
  });

  await transporter.sendMail({
    from: `"${cfg.siteName}" <${cfg.user}>`,
    to,
    subject,
    html,
  });
  return true;
}

export function resetPasswordEmailHtml(siteName: string, resetUrl: string) {
  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
      <h2 style="margin:0 0 16px;color:#06060a;">Reset Password</h2>
      <p style="color:#52525b;line-height:1.6;">
        Kamu menerima email ini karena ada permintaan reset password untuk akun ${siteName} kamu.
      </p>
      <a href="${resetUrl}"
         style="display:inline-block;margin:20px 0;padding:12px 24px;background:#22d3ee;color:#06060a;font-weight:700;border-radius:16px;text-decoration:none;font-size:14px;">
        Reset Password
      </a>
      <p style="color:#a1a1aa;font-size:13px;line-height:1.6;">
        Link berlaku 1 jam. Jika kamu tidak meminta reset, abaikan email ini.
      </p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />
      <p style="color:#a1a1aa;font-size:12px;">${siteName}</p>
    </div>
  `;
}

export function verificationEmailHtml(siteName: string, verifyUrl: string) {
  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
      <h2 style="margin:0 0 16px;color:#06060a;">Verifikasi Email</h2>
      <p style="color:#52525b;line-height:1.6;">
        Selamat datang di ${siteName}! Klik tombol di bawah untuk verifikasi email kamu.
      </p>
      <a href="${verifyUrl}"
         style="display:inline-block;margin:20px 0;padding:12px 24px;background:#22d3ee;color:#06060a;font-weight:700;border-radius:16px;text-decoration:none;font-size:14px;">
        Verifikasi Email
      </a>
      <p style="color:#a1a1aa;font-size:13px;line-height:1.6;">
        Link berlaku 24 jam.
      </p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />
      <p style="color:#a1a1aa;font-size:12px;">${siteName}</p>
    </div>
  `;
}

export function otpEmailHtml(siteName: string, otp: string) {
  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
      <h2 style="margin:0 0 16px;color:#06060a;">Kode Verifikasi</h2>
      <p style="color:#52525b;line-height:1.6;">
        Gunakan kode berikut untuk verifikasi email kamu di ${siteName}:
      </p>
      <div style="margin:20px 0;padding:16px 32px;background:#f4f4f5;border-radius:12px;text-align:center;">
        <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#06060a;">${otp}</span>
      </div>
      <p style="color:#a1a1aa;font-size:13px;line-height:1.6;">
        Kode berlaku 10 menit. Jika kamu tidak meminta kode ini, abaikan email ini.
      </p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />
      <p style="color:#a1a1aa;font-size:12px;">${siteName}</p>
    </div>
  `;
}
