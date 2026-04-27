const logos = ["FinancialOS", "HealthScale", "CloudLedger", "LegalPilot", "DataMesh"];

export function SocialProof() {
  return (
    <section className="border-y border-[var(--border-subtle)] bg-black/30 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">
          Trusted patterns for regulated & high-stakes AI
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-90">
          {logos.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold tracking-tight text-[var(--text-muted)]/70 transition hover:text-[var(--text-muted)]"
            >
              {name}
            </span>
          ))}
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { label: "Apps shipped fast", value: "60+" },
            { label: "Typical custom cycle", value: "8–16 wks" },
            { label: "Hallucination guardrails", value: "<50ms*" },
            { label: "Deployment modes", value: "Any*" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 px-4 py-4 text-center"
            >
              <div className="font-mono text-2xl font-semibold text-[var(--accent)]">{item.value}</div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">{item.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[10px] text-[var(--text-muted)]/70">
          * Illustrative metrics — specifics depend on workload and environment.
        </p>
      </div>
    </section>
  );
}
