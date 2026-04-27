import Link from "next/link";

const lines = [
  {
    title: "Custom AI & software",
    subtitle: "Full-stack delivery",
    points: [
      "Consulting through implementation — architecture, data, and production rollout",
      "Agents, RAG, multimodal workflows, and integrations with your stack",
      "Focused iterations from prototype to hardened releases",
    ],
    href: "/services#line-a",
    accent: "from-cyan-500/30 to-transparent",
  },
  {
    title: "Modular platforms",
    subtitle: "Composable product layer",
    points: [
      "Modules you can ship alone or embed in larger programs",
      "Runtime safety, packaged surfaces, copilots, and tuning workflows",
      "Same engineering standards as bespoke builds",
    ],
    href: "/products",
    accent: "from-violet-500/25 to-transparent",
  },
  {
    title: "Web, mobile & enablement",
    subtitle: "Channels & ongoing support",
    points: [
      "Marketing and product sites — SEO, conversion paths, AI-powered UX where it fits",
      "Native and cross-platform apps wired to backends and identity",
      "Consulting on performance, data design, and retrieval quality",
    ],
    href: "/services#line-svc",
    accent: "from-emerald-500/20 to-transparent",
  },
];

export function BusinessLines() {
  return (
    <section id="lines" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            How we work with teams
          </h2>
          <p className="mt-4 text-[var(--text-muted)]">
            Three lenses on the same discipline — deep AI and software delivery, repeatable platform
            pieces, and the web and mobile surfaces that users actually touch.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {lines.map((line) => (
            <article
              key={line.title}
              className="glass-panel relative overflow-hidden rounded-2xl p-8 transition hover:border-[var(--accent)]/35"
            >
              <div
                className={`pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-gradient-to-br ${line.accent} blur-3xl`}
              />
              <div className="relative flex h-full flex-col gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    {line.subtitle}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{line.title}</h3>
                </div>
                <ul className="flex flex-1 flex-col gap-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  {line.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  href={line.href}
                  className="mt-2 inline-flex text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  Explore →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
