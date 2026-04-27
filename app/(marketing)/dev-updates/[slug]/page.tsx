import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortableBody } from "@/components/portable-text";
import type { SanityDevUpdateListItem } from "@/lib/sanity-types";
import { devUpdateBySlugQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/client";

type Doc = SanityDevUpdateListItem & {
  body?: unknown;
  tags?: string[];
  featuredImage?: unknown;
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = await sanityFetch<Doc | null>(devUpdateBySlugQuery, { slug });
  if (!doc) return { title: "Post" };
  return {
    title: doc.title,
    description: doc.excerpt ?? undefined,
  };
}

export default async function DevUpdateDetailPage(props: Props) {
  const { slug } = await props.params;
  const doc = await sanityFetch<Doc | null>(devUpdateBySlugQuery, { slug });

  if (!doc) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <Link href="/dev-updates" className="text-sm text-[var(--accent)] hover:underline">
        ← Dev updates
      </Link>
      <header className="mt-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
          {doc.publishedAt
            ? new Date(doc.publishedAt).toLocaleDateString(undefined, {
                dateStyle: "long",
              })
            : ""}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
          {doc.title}
        </h1>
        {doc.excerpt ? (
          <p className="mt-6 text-lg leading-relaxed text-[var(--text-muted)]">{doc.excerpt}</p>
        ) : null}
      </header>
      <div className="mt-12">
        <PortableBody value={doc.body} />
      </div>
    </article>
  );
}
