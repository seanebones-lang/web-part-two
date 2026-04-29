"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--bg-deep)] px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
        Error
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-sm text-sm text-[var(--text-muted)]">
        An unexpected error occurred. If the issue continues, please reach out to us
        directly.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[10px] text-[var(--text-muted)]/50">
          Ref: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={reset}
          className="inline-flex h-10 items-center rounded-full bg-[var(--accent)] px-6 text-sm font-medium text-[var(--bg-deep)] transition hover:opacity-90"
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex h-10 items-center rounded-full border border-[var(--border-subtle)] px-6 text-sm font-medium text-[var(--text-primary)] transition hover:bg-white/5"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
