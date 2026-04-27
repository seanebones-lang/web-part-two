import Link from "next/link";

export function CtaSection() {
  return (
    <section id="contact" className="scroll-mt-24 pb-28 pt-8">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="glass-panel relative overflow-hidden rounded-3xl px-6 py-16 ring-1 ring-[var(--accent)]/30">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,211,238,0.15),transparent_55%)]" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Ready for AI that ships — safely — on your rails?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--text-muted)]">
              Tell us about workloads, compliance posture, and timing — we&apos;ll respond with an executable path from MVP to hardened production.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="mailto:hello@nexteleven.ai"
                className="inline-flex rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-[var(--bg-deep)] shadow-[0_0_36px_var(--accent-glow)] transition hover:brightness-110"
              >
                Email hello@nexteleven.ai
              </Link>
              <Link
                href="/studio"
                className="inline-flex rounded-full border border-[var(--border-subtle)] px-8 py-3 text-sm font-medium text-[var(--text-primary)] hover:bg-white/5"
              >
                Open Sanity Studio
              </Link>
            </div>
            <p className="mt-6 text-xs text-[var(--text-muted)]">
              Replace placeholder email with your production inbox via Sanity settings + deployment env.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
