import Link from "next/link";
import Image from "next/image";

import { MobileNav } from "@/components/layout/mobile-nav";
import { siteNavItems } from "@/lib/nav-items";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-deep)]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden">
            <Image
              src="/newlogo.png"
              alt="NextEleven logo"
              width={32}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="text-[var(--text-primary)]">NextEleven</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {siteNavItems.map((item) => (
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
            className="neon-hover hidden rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg-deep)] shadow-[0_0_24px_var(--accent-glow)] sm:inline-flex"
          >
            Contact
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
