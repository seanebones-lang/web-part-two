import { SectionEyebrow } from "@/components/ui/section-eyebrow";

const moats = [
  {
    title: "Speed to production",
    body:
      "Dozens of App Store-ready apps and production AI systems shipped — while structured enterprise programs hold to 8–16 week delivery rails.",
    badge: "Velocity",
  },
  {
    title: "Hallucination-aware defaults",
    body:
      "Guardrails are baked in from day one — sub-50ms detection with layered governance so unsafe responses never silently reach users.",
    badge: "Safety",
  },
  {
    title: "Flexible deployment",
    body:
      "Same architectures extend across clouds, VPCs, regulated environments, and air-gapped estates — infrastructure stays yours.",
    badge: "Control",
  },
  {
    title: "Forward-deployed builders",
    body:
      "Engineers who write the code, not just the pitch — hands-on from architecture through production monitoring.",
    badge: "Craft",
  },
  {
    title: "Composable modules",
    body:
      "Modular building blocks — safety layers, vertical templates, fine-tuning pipelines, and pre-built UI surfaces — that slot into existing systems without rewriting what already works.",
    badge: "Architecture",
  },
];

export function WhyNextEleven() {
  return (
    <section id="why" className="scroll-mt-24 border-y border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionEyebrow>01 · Differentiators</SectionEyebrow>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Why teams choose NextEleven
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
          Five reasons teams keep choosing us — backed by working software, not decks.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {moats.map((m) => (
            <article key={m.title} className="glass-panel rounded-2xl p-6">
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] ring-1 ring-[var(--border-subtle)]">
                {m.badge}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{m.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{m.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
