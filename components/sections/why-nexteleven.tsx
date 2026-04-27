const moats = [
  {
    title: "Speed to production",
    body:
      "Dense shipping cadence — dozens of App Store-ready surfaces and near-complete builds in compressed timelines while enterprise AI programs stay on 8–16 week rails.",
    badge: "Velocity",
  },
  {
    title: "Hallucination-aware defaults",
    body:
      "Guardrail telemetry built-in — sub-50ms detection narratives with layered governance so risky completions never silently ship.",
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
      "Operators who actually compile — not deck-heavy account pods — owning instrumentation from IDE to production observability.",
    badge: "Craft",
  },
  {
    title: "Composable modules",
    body:
      "Standalone product modules or bundled accelerators — runtime safety layers, packaged surfaces, vertical copilots, tuning pipelines — snapped together without rewriting cores.",
    badge: "Architecture",
  },
];

export function WhyNextEleven() {
  return (
    <section id="why" className="scroll-mt-24 border-y border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Why teams choose NextEleven
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
          Five differentiated pillars — each reinforced by operator-grade instrumentation instead of slide decks.
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
