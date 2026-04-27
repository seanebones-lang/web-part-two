import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortableBody } from "@/components/portable-text";
import type { SanityAnnouncement } from "@/lib/sanity-types";
import { announcementBySlugQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/client";

type Doc = SanityAnnouncement & {
  body?: unknown;
  priority?: string;
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = await sanityFetch<Doc | null>(announcementBySlugQuery, { slug });
  if (!doc) return { title: "Announcement" };
  return { title: doc.title };
}

export default async function AnnouncementDetailPage(props: Props) {
  const { slug } = await props.params;
  const doc = await sanityFetch<Doc | null>(announcementBySlugQuery, { slug });

  if (!doc) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <Link href="/" className="text-sm text-[var(--accent)] hover:underline">
        ← Home
      </Link>
      <header className="mt-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
          Announcement{" "}
          {doc.publishedAt
            ? ` · ${new Date(doc.publishedAt).toLocaleDateString(undefined, {
                dateStyle: "long",
              })}`
            : ""}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
          {doc.title}
        </h1>
      </header>
      <div className="mt-12">
        <PortableBody value={doc.body} />
      </div>
    </article>
  );
}
