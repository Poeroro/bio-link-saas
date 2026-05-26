import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { AppProvider } from "@/components/providers/app-provider";
import { SessionProviderWrapper } from "@/components/providers/session-provider";
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

export const metadata: Metadata = {
  title: {
    default: "LinkPilot - Bio Link SaaS untuk Creator Indonesia",
    template: "%s | LinkPilot",
  },
  description:
    "Satu halaman untuk semua link penting. Dashboard realtime, 14+ tema, analytics, QR code, dan export data. Gratis!",
  keywords: ["bio link", "linktree", "link in bio", "creator tools", "indonesia"],
  authors: [{ name: "LinkPilot" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "LinkPilot",
    title: "LinkPilot - Bio Link SaaS untuk Creator Indonesia",
    description:
      "Satu halaman untuk semua link penting. Dashboard realtime, 14+ tema, analytics, QR code, dan export data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkPilot - Bio Link SaaS",
    description: "Satu halaman untuk semua link penting. Gratis!",
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
      <body className="min-h-full">
        <SessionProviderWrapper>
          <AppProvider>{children}</AppProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
