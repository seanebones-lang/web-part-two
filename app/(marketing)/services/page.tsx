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
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
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

      <section id="rag-solutions" className="scroll-mt-28 mt-16 border-t border-[var(--border-subtle)] pt-12">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">RAG solutions in practice</h2>
        <p className="mt-4 text-[var(--text-muted)]">
          Our RAG systems combine retrieval with generation so outputs stay grounded in your live business
          data, documents, and operational context.
        </p>
        <div className="mt-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Featured implementation: dealership intelligence system
          </h3>
          <ul className="mt-4 space-y-3 text-[var(--text-muted)]">
            <li>
              <strong className="text-[var(--text-primary)]">Intelligent email routing:</strong> incoming
              customer emails are triaged by urgency and routine inquiries are answered automatically.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Multi-location graph inventory:</strong>{" "}
              vehicle stock is tracked across 7 dealership locations with near real-time visibility.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Proactive stock alerts:</strong> management is
              notified early when inventory trends low to reduce missed sales.
            </li>
          </ul>
        </div>
      </section>

      <section id="chat-systems" className="scroll-mt-28 mt-16 border-t border-[var(--border-subtle)] pt-12">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Chat systems & bots</h2>
        <p className="mt-4 text-[var(--text-muted)]">
          We build custom conversational systems trained on your documentation, policies, and product data
          — from customer support to internal workflow automation.
        </p>
        <ul className="mt-6 space-y-3 text-[var(--text-muted)]">
          <li>
            <strong className="text-[var(--text-primary)]">Deployment surfaces:</strong> website widgets,
            mobile apps, and team workflows across channels.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Business logic:</strong> escalation paths, human
            handoff, and domain-specific response behavior tuned to your operation.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Measurement:</strong> response quality, latency,
            and conversion/support outcomes with iterative tuning.
          </li>
        </ul>
      </section>

      <section id="mobile-details" className="scroll-mt-28 mt-16 border-t border-[var(--border-subtle)] pt-12">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">iOS & Android delivery details</h2>
        <p className="mt-4 text-[var(--text-muted)]">
          We support native and cross-platform paths (Swift/SwiftUI, Kotlin/Compose, React Native, and
          Flutter) with full backend integration and release pipeline support.
        </p>
      </section>
    </article>
  );
}
