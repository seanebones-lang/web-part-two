import Link from "next/link";

import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from "@/lib/contact";
import { SOCIAL_LINKS } from "@/lib/social";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-semibold tracking-tight text-[var(--text-primary)]">
            NextEleven
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
            We build AI systems that ship — custom applications, enterprise agents, and
            production-grade assistants your team can actually own.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-[var(--text-primary)]">Explore</span>
            <FooterLink href="/products">Products</FooterLink>
            <FooterLink href="/portfolio">Portfolio</FooterLink>
            <FooterLink href="/dev-updates">Dev updates</FooterLink>
            <FooterLink href="/studio">Content Studio</FooterLink>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-[var(--text-primary)]">Company</span>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/services">Services</FooterLink>
            <FooterLink href="/links">Links</FooterLink>
            <FooterLink href="/#contact">Contact</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="break-all text-[var(--text-muted)] transition hover:text-[var(--accent)]"
            >
              {CONTACT_EMAIL}
            </a>
            <a
              href={CONTACT_PHONE_HREF}
              className="text-[var(--text-muted)] transition hover:text-[var(--accent)]"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-[var(--text-primary)]">Follow</span>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex items-center gap-2 text-[var(--text-muted)] transition hover:text-[var(--accent)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d={link.iconPath} />
                </svg>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border-subtle)] px-4 py-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
          Next.js · React · Headless CMS · Tailwind · AI SDK · xAI
        </p>
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} NextEleven. Enterprise AI that actually works.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[var(--text-muted)] transition hover:text-[var(--accent)]"
    >
      {children}
    </Link>
  );
}
