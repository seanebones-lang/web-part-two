import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI development and consulting, software and RAG systems, assistants, custom web experiences, mobile apps, and integration.",
};

export default function ServicesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        Capabilities
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
        What we deliver
      </h1>
      <p className="mt-6 text-[var(--text-muted)]">
        NextEleven combines AI consulting with hands-on engineering — from discovery and architecture
        through shipping software your team can own.
      </p>

      <section id="line-a" className="scroll-mt-28 mt-16 border-t border-[var(--border-subtle)] pt-12">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          AI & software delivery
        </h2>
        <ul className="mt-6 space-y-3 text-[var(--text-muted)]">
          <li>
            <strong className="text-[var(--text-primary)]">Consulting:</strong> roadmap, stack choices,
            retrieval design, evaluation strategies, and rollout planning alongside your stakeholders.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Build:</strong> agents, RAG pipelines,
            multimodal workflows, APIs, and integrations aligned with your security and compliance needs.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Hands-off ready:</strong> documentation,
            observability hooks, and knowledge transfer so operations stay in your control.
          </li>
        </ul>
      </section>

      <section id="saas" className="scroll-mt-28 mt-16 border-t border-[var(--border-subtle)] pt-12">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          Platforms & reusable modules
        </h2>
        <p className="mt-4 text-[var(--text-muted)]">
          Packaged surfaces — safety tooling, vertical templates, copilots, fine-tuning workflows —
          composed into larger programs or deployed as focused additions to what you already run.
        </p>
      </section>

      <section id="line-svc" className="scroll-mt-28 mt-16 border-t border-[var(--border-subtle)] pt-12">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          Web, mobile & optimization
        </h2>
        <div className="mt-6 space-y-8 text-[var(--text-muted)]">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Custom websites & web apps
            </h3>
            <p className="mt-2">
              Conversion-focused marketing sites and product experiences — modern frameworks,
              performance budgets, accessibility, and AI-assisted UX where it genuinely helps visitors and
              admins.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Mobile applications
            </h3>
            <p className="mt-2">
              Native and cross-platform apps connected to your APIs, identity providers, and push /
              offline requirements — built for App Store and Play workflows.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Optimization & advisory
            </h3>
            <p className="mt-2">
              Performance tuning, data and indexing strategy, RAG quality reviews, and targeted fixes when
              models or pipelines underperform in production.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
