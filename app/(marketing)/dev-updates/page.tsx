import Link from "next/link";
import type { Metadata } from "next";

import type { SanityDevUpdateListItem } from "@/lib/sanity-types";
import { devUpdatesListQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "Dev updates",
  description: "Engineering notes and changelog entries from NextEleven.",
};

export default async function DevUpdatesPage() {
  const items =
    (await sanityFetch<SanityDevUpdateListItem[]>(devUpdatesListQuery)) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
        What We&apos;re Building
      </h1>
      <p className="mt-4 text-[var(--text-muted)]">
        Notes from active development — features shipped, lessons learned, and what&apos;s next.
      </p>

      <ul className="mt-12 space-y-4">
        {items.length === 0 ? (
          <li className="glass-panel rounded-xl p-8 text-[var(--text-muted)]">
            No posts yet — create your first entry in{" "}
            <Link href="/studio" className="text-[var(--accent)] hover:underline">
              Content Studio
            </Link>
            .
          </li>
        ) : (
          items.map((post) => (
            <li key={post._id}>
              <Link
                href={`/dev-updates/${post.slug?.current ?? ""}`}
                className="glass-panel flex flex-col gap-2 rounded-xl p-6 transition hover:border-[var(--accent)]/35 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">{post.title}</h2>
                  {post.excerpt ? (
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--text-muted)]">
                      {post.excerpt}
                    </p>
                  ) : null}
                </div>
                {post.publishedAt ? (
                  <time
                    dateTime={post.publishedAt}
                    className="shrink-0 text-xs uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </time>
                ) : null}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
