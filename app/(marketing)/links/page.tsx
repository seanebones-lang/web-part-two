import Link from "next/link";
import type { Metadata } from "next";

import type { SanityLink } from "@/lib/sanity-types";
import { linksQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "Links",
  description: "Curated links — reports, launches, and references.",
};

export default async function LinksPage() {
  const links = (await sanityFetch<SanityLink[]>(linksQuery)) ?? [];

  const grouped = links.reduce<Record<string, SanityLink[]>>((acc, link) => {
    const cat = link.category?.trim() || "General";
    acc[cat] = acc[cat] ?? [];
    acc[cat].push(link);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">On Our Radar</h1>
      <p className="mt-4 text-[var(--text-muted)]">
        Resources, launches, and references we find worth sharing.
      </p>

      {links.length === 0 ? (
        <div className="glass-panel mt-12 rounded-xl p-10 text-[var(--text-muted)]">
          No links yet — add your first link in{" "}
          <Link href="/studio" className="text-[var(--accent)] hover:underline">
            Content Studio
          </Link>
          .
        </div>
      ) : (
        <div className="mt-12 space-y-14">
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                {cat}
              </h2>
              <ul className="mt-6 space-y-3">
                {grouped[cat]
                  ?.sort((a, b) => Number(b.pinned) - Number(a.pinned))
                  .map((link) => (
                    <li key={link._id}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-panel flex flex-col gap-1 rounded-xl px-5 py-4 transition hover:border-[var(--accent)]/35 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <span className="font-medium text-[var(--text-primary)]">
                            {link.title}
                            {link.pinned ? (
                              <span className="ml-2 rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                                Pinned
                              </span>
                            ) : null}
                          </span>
                          {link.description ? (
                            <p className="mt-1 text-sm text-[var(--text-muted)]">{link.description}</p>
                          ) : null}
                        </div>
                        <span className="shrink-0 text-xs text-[var(--accent)]">Visit →</span>
                      </a>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
