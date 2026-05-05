import { SectionEyebrow } from "@/components/ui/section-eyebrow";

type Stat = { label: string; value: string };

type Props = {
  /** Industry / vertical chips — typically derived from Sanity portfolio verticals */
  industries: string[];
  /** Up to four headline stats; should be Sanity-grounded (counts), not speculative */
  stats: Stat[];
};

const FALLBACK_INDUSTRIES = ["Finance", "Healthcare", "Legal", "SaaS", "Automotive", "Real Estate"];

export function SocialProof({ industries, stats }: Props) {
  const chips = industries.length ? industries : FALLBACK_INDUSTRIES;

  return (
    <section className="border-y border-[var(--border-subtle)] bg-black/30 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionEyebrow centered>00 · Signal</SectionEyebrow>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">
          {industries.length ? "Verticals in our portfolio" : "Industries we often ship in"}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {chips.map((name) => (
            <span
              key={name}
              className="rounded-full border border-[var(--border-subtle)] bg-white/[0.04] px-4 py-1.5 text-sm font-medium tracking-wide text-[var(--text-muted)]/80"
            >
              {name}
            </span>
          ))}
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
          {stats.map((item) => (
            <div
              key={item.label}
              className="neon-surface rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 px-4 py-4 text-center"
            >
              <div className="font-mono text-xl font-semibold text-[var(--accent)] sm:text-2xl">{item.value}</div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">{item.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[10px] text-[var(--text-muted)]/70">
          Counts reflect what&apos;s published in Content Studio today — not marketing estimates.
        </p>
      </div>
    </section>
  );
}
