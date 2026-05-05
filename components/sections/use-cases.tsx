import { SectionEyebrow } from "@/components/ui/section-eyebrow";

const stories = [
  {
    title: "Finance",
    desc:
      "Portfolio analytics assistants grounded in governed datasets — with cited sources alongside every answer so traders can verify what the model says.",
  },
  {
    title: "Healthcare",
    desc:
      "Clinical workflows with privacy-aware pipelines — guardrails layered across document, voice, and image intake without adding bedside delay.",
  },
  {
    title: "SaaS",
    desc:
      "Embedded intelligence across core business systems — governed UI layers when every interaction needs a full audit trail.",
  },
  {
    title: "Legal",
    desc:
      "Citation-grounded drafting assistants — with hard refusal logic that blocks responses until sources clear your privileged document corpus.",
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
          Repeatable vertical patterns — each tuned for audit trails, grounded retrieval, and real-world deployment constraints.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-[var(--text-muted)]">
          Published case studies and summaries appear under Portfolio when you add them in Content Studio — keeping narratives aligned with what you choose to show publicly.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {stories.map((s) => (
            <article key={s.title} className="glass-panel rounded-2xl p-5 transition hover:border-[var(--accent)]/30 sm:p-8">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
