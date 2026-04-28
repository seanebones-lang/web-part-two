import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export function Team() {
  return (
    <section className="border-y border-[var(--border-subtle)] bg-gradient-to-b from-transparent via-cyan-500/[0.06] to-transparent py-24">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <SectionEyebrow centered>04 · Operators</SectionEyebrow>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
          Builders, not talkers
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Operators shipping instrumentation — not slide decks
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[var(--text-muted)]">
          Forward-deployed engineers owning IDE → observability paths — 60+ production-grade surfaces shipped on compressed timelines while bespoke AI programs maintain enterprise-grade governance across multimodal + retrieval-heavy stacks.
        </p>
      </div>
    </section>
  );
}
