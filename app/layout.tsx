import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { CONTACT_EMAIL, CONTACT_PHONE_HREF } from "@/lib/contact";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Display-only — hero headlines; keeps UI body in Geist */
const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mothership-ai.com"),
  title: {
    default: "NextEleven — Enterprise AI That Actually Works",
    template: "%s · NextEleven",
  },
  description:
    "We build AI systems that ship — custom assistants, RAG pipelines, production APIs, and native mobile apps from first prototype to production.",
  openGraph: {
    title: "NextEleven — Enterprise AI That Actually Works",
    description:
      "Custom AI systems, RAG pipelines, and production software — from first build to the thing your team actually runs.",
    siteName: "NextEleven",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NextEleven — Enterprise AI That Actually Works" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextEleven — Enterprise AI That Actually Works",
    description: "Custom AI systems, RAG pipelines, and production software — from first build to the thing your team actually runs.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/newlogo.png",
    shortcut: "/newlogo.png",
    apple: "/newlogo.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NextEleven",
  alternateName: "Mothership AI",
  url: "https://mothership-ai.com",
  logo: "https://mothership-ai.com/newlogo.png",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: CONTACT_PHONE_HREF.replace("tel:", ""),
    email: CONTACT_EMAIL,
    contactType: "customer service",
  },
  sameAs: [
    "https://www.linkedin.com/in/mothership-ai",
    "https://x.com/nextelevendev",
    "https://github.com/seanebones-lang",
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
      className={`dark ${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="noise-overlay bg-[var(--bg-deep)] font-sans text-[var(--text-primary)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
