import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortableBody } from "@/components/portable-text";
import type { SanityPortfolioItem } from "@/lib/sanity-types";
import { portfolioBySlugQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/client";

type Doc = SanityPortfolioItem & {
  body?: unknown;
  metrics?: { label?: string; value?: string }[];
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = await sanityFetch<Doc | null>(portfolioBySlugQuery, { slug });
  if (!doc) return { title: "Case study" };
  return {
    title: doc.title,
    description: doc.summary ?? undefined,
  };
}

export default async function PortfolioDetailPage(props: Props) {
  const { slug } = await props.params;
  const doc = await sanityFetch<Doc | null>(portfolioBySlugQuery, { slug });

  if (!doc) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <Link href="/portfolio" className="text-sm text-[var(--accent)] hover:underline">
        ← Portfolio
      </Link>
      <header className="mt-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
          {doc.vertical ?? "Engagement"}
          {doc.client ? ` · ${doc.client}` : ""}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          {doc.title}
        </h1>
        {doc.summary ? (
          <p className="mt-6 text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">{doc.summary}</p>
        ) : null}
        {doc.liveUrl ? (
          <p className="mt-4">
            <a
              href={doc.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Visit live site →
            </a>
          </p>
        ) : null}
      </header>

      {doc.metrics?.length ? (
        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
          {doc.metrics.map((m, i) =>
            m.label && m.value ? (
              <div key={`${m.label}-${i}`} className="glass-panel rounded-xl p-4 text-center">
                <dt className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  {m.label}
                </dt>
                <dd className="mt-2 font-mono text-lg font-semibold text-[var(--accent)]">
                  {m.value}
                </dd>
              </div>
            ) : null,
          )}
        </dl>
      ) : null}

      <div className="mt-12">
        <PortableBody value={doc.body} />
      </div>
    </article>
  );
}
