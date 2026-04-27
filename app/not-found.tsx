import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-[var(--text-primary)]">
        Page not found
      </h1>
      <p className="mt-4 text-[var(--text-muted)]">
        The route doesn&apos;t exist or content hasn&apos;t been published yet.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-[var(--bg-deep)]"
      >
        Back home
      </Link>
    </div>
  );
}
