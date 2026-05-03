"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

import { siteNavItems } from "@/lib/nav-items";

export function MobileNav() {
  const pathname = usePathname();
  return <MobileNavPanel key={pathname} />;
}

function MobileNavPanel() {
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <details
      className="relative md:hidden"
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary className="inline-flex min-h-[44px] min-w-[44px] list-none items-center justify-center rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-muted)] [&::-webkit-details-marker]:hidden">
        Menu
      </summary>
      <div className="absolute right-0 z-50 mt-2 w-[min(13rem,calc(100vw-1rem))] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-2 shadow-xl">
        {siteNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-white/5"
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/#contact"
          className="neon-hover mt-1 block rounded-lg bg-[var(--accent)] px-3 py-2 text-center text-sm font-medium text-[var(--bg-deep)]"
          onClick={closeMenu}
        >
          Contact
        </Link>
      </div>
    </details>
  );
}
