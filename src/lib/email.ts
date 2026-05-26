import { prisma } from "@/lib/prisma";

async function getSmtpSettings() {
  const rows = await prisma.setting.findMany({
    where: { key: { in: ["smtpHost", "smtpPort", "smtpUser", "smtpPass", "smtpFrom", "siteName"] } },
  });
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return {
    host: map.smtpHost || "",
    port: parseInt(map.smtpPort || "587", 10),
    user: map.smtpUser || "",
    pass: map.smtpPass || "",
    from: map.smtpFrom || "",
    siteName: map.siteName || "LinkPilot",
  };
}

export async function sendEmail(to: string, subject: string, html: string) {
  const cfg = await getSmtpSettings();
  if (!cfg.host || !cfg.user) {
    console.warn("[email] SMTP not configured, skipping send to", to);
    return false;
  }

  const fromEmail = cfg.from || cfg.user;

  // Use Brevo REST API (avoids SMTP IP restrictions)
  if (cfg.host.includes("brevo.com") && (cfg.pass.startsWith("xkeysib-") || cfg.pass.startsWith("xsmtpsib-"))) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": cfg.pass,
        },
        body: JSON.stringify({
          sender: { name: cfg.siteName, email: fromEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("[email] Brevo API error:", res.status, err);
        return false;
      }
      return true;
    } catch (e) {
      console.error("[email] Brevo API error:", e);
      return false;
    }
  }

  // SMTP fallback (nodemailer)
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
  });

  try {
    await transporter.sendMail({
      from: `"${cfg.siteName}" <${fromEmail}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (e) {
    console.error("[email] SMTP error:", e);
    return false;
  }
}

export async function sendOtpEmail(to: string, code: string, siteName?: string) {
  const name = siteName || "LinkPilot";
  return sendEmail(
    to,
    `Kode Verifikasi ${name}`,
    otpEmailHtml(name, code)
  );
}

export function otpEmailHtml(siteName: string, code: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
    <h2 style="color:#06b6d4;margin:0 0 16px;">${siteName}</h2>
    <p style="color:#333;font-size:15px;">Gunakan kode berikut untuk verifikasi email kamu:</p>
    <div style="background:#f0fdfa;border:2px solid #06b6d4;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
      <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#0e7490;">${code}</span>
    </div>
    <p style="color:#666;font-size:13px;">Kode ini berlaku selama <strong>10 menit</strong>. Jangan bagikan kode ini ke siapapun.</p>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
    <p style="color:#999;font-size:12px;">Email ini dikirim oleh ${siteName}. Jika kamu tidak merasa mendaftar, abaikan email ini.</p>
  </div>`;
}

export function verificationEmailHtml(siteName: string, url: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
    <h2 style="color:#06b6d4;margin:0 0 16px;">${siteName}</h2>
    <p style="color:#333;font-size:15px;">Klik tombol di bawah untuk verifikasi email kamu:</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${url}" style="display:inline-block;background:#06b6d4;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;">Verifikasi Email</a>
    </div>
    <p style="color:#666;font-size:13px;">Link ini berlaku selama <strong>24 jam</strong>.</p>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
    <p style="color:#999;font-size:12px;">Email ini dikirim oleh ${siteName}. Jika kamu tidak merasa mendaftar, abaikan email ini.</p>
  </div>`;
}

export function resetPasswordEmailHtml(siteName: string, url: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
    <h2 style="color:#06b6d4;margin:0 0 16px;">${siteName}</h2>
    <p style="color:#333;font-size:15px;">Klik tombol di bawah untuk reset password kamu:</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${url}" style="display:inline-block;background:#06b6d4;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;">Reset Password</a>
    </div>
    <p style="color:#666;font-size:13px;">Link ini berlaku selama <strong>1 jam</strong>. Jika kamu tidak merasa minta reset, abaikan email ini.</p>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
    <p style="color:#999;font-size:12px;">Email ini dikirim oleh ${siteName}.</p>
  </div>`;
}
