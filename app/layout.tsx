import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NextEleven — Enterprise AI That Actually Works",
    template: "%s · NextEleven",
  },
  description:
    "AI Systems Builder & Operator Studio — custom AI applications, hallucination-safe agents, RAG pipelines, and full deployment ownership.",
  openGraph: {
    title: "NextEleven — Enterprise AI That Actually Works",
    description:
      "Custom builds. Hallucination-safe. Your control. Proof of concept to production in days.",
    siteName: "NextEleven",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="noise-overlay bg-[var(--bg-deep)] font-sans text-[var(--text-primary)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
