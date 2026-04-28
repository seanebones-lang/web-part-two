import { SectionEyebrow } from "@/components/ui/section-eyebrow";

const stories = [
  {
    title: "Finance",
    desc:
      "Portfolio analytics copilots pulling strictly governed datasets — retrieval proofs emitted alongside answers so traders trust automation.",
  },
  {
    title: "Healthcare",
    desc:
      "Clinical workflows with PHI-aware pipelines — guardrails layered across multimodal intake without sacrificing bedside latency.",
  },
  {
    title: "SaaS",
    desc:
      "Embedded intelligence across core business systems — governed UI layers when every interaction needs audit trails.",
  },
  {
    title: "Legal",
    desc:
      "Citation-heavy drafting assistants — deterministic refusal paths until grounding thresholds clear privileged corpuses.",
  },
];

export function UseCases() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionEyebrow>02 · Verticals</SectionEyebrow>
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Use cases — regulated & mission-critical AI
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
          Four repeatable vertical patterns — each tuned for audit trails, grounded retrieval, and deployment realism.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {stories.map((s) => (
            <article key={s.title} className="glass-panel rounded-2xl p-8 transition hover:border-[var(--accent)]/30">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
