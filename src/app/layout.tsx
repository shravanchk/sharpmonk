import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import AdSenseLoader from "@/components/AdSenseLoader";
import Analytics from "@/components/Analytics";
import SiteStructuredData from "@/components/SiteStructuredData";
import { themeInitScript } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://sharpmonk.com";
const title = "Sharpmonk — Exam Photo & Signature Resizer, to the Exact KB";
const description =
  "Resize exam photos, signatures and thumb impressions to the exact pixels, KB and DPI in the official notification — IBPS, NEET, JEE. Runs in your browser; nothing is uploaded.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Sharpmonk" },
  description,
  openGraph: { title, description, url: siteUrl, siteName: "Sharpmonk", type: "website" },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#05070d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <SiteStructuredData />
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
        <CookieConsent />
        <AdSenseLoader />
        <Analytics />
      </body>
    </html>
  );
}
