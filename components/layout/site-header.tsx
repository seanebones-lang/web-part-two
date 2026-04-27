import Link from "next/link";

import { cn } from "@/lib/utils";

const nav = [
  { href: "/#lines", label: "Offerings" },
  { href: "/#why", label: "Why us" },
  { href: "/products", label: "Products" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/dev-updates", label: "Dev updates" },
  { href: "/links", label: "Links" },
  { href: "/services", label: "Services" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-deep)]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-dim)] ring-1 ring-[var(--accent)]/30 transition group-hover:ring-[var(--accent)]/60">
            <span className="text-sm font-bold text-[var(--accent)]">11</span>
          </span>
          <span className="text-[var(--text-primary)]">NextEleven</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] transition",
                "hover:bg-white/5 hover:text-[var(--text-primary)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/#contact"
            className="hidden rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg-deep)] shadow-[0_0_24px_var(--accent-glow)] transition hover:brightness-110 sm:inline-flex"
          >
            Contact
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <details className="relative md:hidden">
      <summary className="list-none rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-muted)] [&::-webkit-details-marker]:hidden">
        Menu
      </summary>
      <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-2 shadow-xl">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-white/5"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/#contact"
          className="mt-1 block rounded-lg bg-[var(--accent)] px-3 py-2 text-center text-sm font-medium text-[var(--bg-deep)]"
        >
          Contact
        </Link>
      </div>
    </details>
  );
}
