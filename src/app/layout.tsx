import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { AppProvider } from "@/components/providers/app-provider";
import { SessionProviderWrapper } from "@/components/providers/session-provider";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

async function getSiteName(): Promise<string> {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "siteName" } });
    return setting?.value || "LinkPilot";
  } catch {
    return "LinkPilot";
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const siteName = await getSiteName();
  const desc = "Satu halaman untuk semua link penting. Dashboard realtime, 14+ tema, analytics, QR code, dan export data. Gratis!";
  return {
    title: {
      default: `${siteName} - Bio Link SaaS untuk Creator Indonesia`,
      template: `%s | ${siteName}`,
    },
    description: desc,
    keywords: ["bio link", "linktree", "link in bio", "creator tools", "indonesia"],
    authors: [{ name: siteName }],
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName,
      title: `${siteName} - Bio Link SaaS untuk Creator Indonesia`,
      description: desc,
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} - Bio Link SaaS`,
      description: "Satu halaman untuk semua link penting. Gratis!",
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#06060a] text-white">
        <SessionProviderWrapper>
          <AppProvider>{children}</AppProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
