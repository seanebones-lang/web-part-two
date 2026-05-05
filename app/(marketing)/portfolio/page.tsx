import Link from "next/link";
import type { Metadata } from "next";

import type { SanityPortfolioItem } from "@/lib/sanity-types";
import { portfolioVerticalLabel } from "@/lib/sanity-marketing-context";
import { portfolioListQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Case studies and shipped outcomes published from Content Studio.",
};

export default async function PortfolioPage() {
  const items =
    (await sanityFetch<SanityPortfolioItem[]>(portfolioListQuery)) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
        Work We&apos;ve Shipped
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
        Each entry mirrors your Sanity Portfolio documents — edit summaries and narratives in Content Studio to update what appears here.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {items.length === 0 ? (
          <div className="glass-panel rounded-xl p-10 text-[var(--text-muted)] md:col-span-2">
            No portfolio entries yet — add your first{" "}
            <Link href="/studio" className="text-[var(--accent)] hover:underline">
              Portfolio
            </Link>{" "}
            entry.
          </div>
        ) : (
          items.map((item) => {
            const verticalLabel = portfolioVerticalLabel(item.vertical);
            return (
              <Link
                key={item._id}
                href={`/portfolio/${item.slug?.current ?? ""}`}
                className="glass-panel flex flex-col rounded-2xl p-5 transition hover:border-[var(--accent)]/35 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {verticalLabel ? (
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] ring-1 ring-[var(--border-subtle)]">
                      {verticalLabel}
                    </span>
                  ) : null}
                  {item.featured ? (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/40">
                      Featured
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">{item.title}</h2>
                {item.client ? (
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{item.client}</p>
                ) : null}
                {item.summary ? (
                  <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-[var(--text-muted)]">
                    {item.summary}
                  </p>
                ) : null}
                {item.liveUrl ? (
                  <span className="mt-4 break-all text-xs text-[var(--text-muted)]">Live: {item.liveUrl}</span>
                ) : null}
                <span className="mt-6 text-sm font-medium text-[var(--accent)]">Read story →</span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
