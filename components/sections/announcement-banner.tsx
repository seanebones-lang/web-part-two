import Link from "next/link";

import type { SanityAnnouncement } from "@/lib/sanity-types";

function isExpired(expiresAt?: string) {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

export function AnnouncementBanner({
  announcement,
}: {
  announcement: SanityAnnouncement | null | undefined;
}) {
  if (!announcement || isExpired(announcement.expiresAt)) return null;

  const slug = announcement.slug?.current;

  return (
    <div className="border-b border-[var(--accent)]/25 bg-[var(--accent-dim)]/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--accent)]/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
            News
          </span>
          {slug ? (
            <Link
              href={`/announcements/${slug}`}
              className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)]"
            >
              {announcement.title}
            </Link>
          ) : (
            <span className="font-medium text-[var(--text-primary)]">{announcement.title}</span>
          )}
        </div>
        {slug ? (
          <Link
            href={`/announcements/${slug}`}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)]"
          >
            Read →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
