import Link from "next/link";
import type { Metadata } from "next";

import type { SanityPortfolioItem } from "@/lib/sanity-types";
import { pickPortfolioSpotlight } from "@/lib/sanity-marketing-context";
import { portfolioListQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom AI systems, RAG pipelines, production software, mobile apps, and consulting — described here; highlights under Portfolio and Products come from Content Studio.",
};

export default async function ServicesPage() {
  const portfolio = (await sanityFetch<SanityPortfolioItem[]>(portfolioListQuery)) ?? [];
  const spotlight = pickPortfolioSpotlight(portfolio);
  const spotlightHref =
    spotlight?.slug?.current != null && spotlight.slug.current !== ""
      ? `/portfolio/${spotlight.slug.current}`
      : "/portfolio";

  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        Services
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
        How We Work
      </h1>
      <p className="mt-6 text-[var(--text-muted)]">
        NextEleven combines AI consulting with hands-on engineering — from discovery and architecture through shipping software your team can own. Offerings and case summaries you want public-facing live under Products and Portfolio in Content Studio.
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
          composed into larger programs or deployed as focused additions to what you already run. Tiles on{" "}
          <Link href="/products" className="text-[var(--accent)] hover:underline">
            Products
          </Link>{" "}
          mirror your Sanity Product documents.
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
              Native and cross-platform apps connected to your APIs, auth providers, and offline requirements — storefront URLs you want surfaced publicly belong in{" "}
              <Link href="/links" className="text-[var(--accent)] hover:underline">
                Links
              </Link>{" "}
              so they stay centralized with the rest of your curated destinations.
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
            {spotlight ? "Spotlight from Portfolio" : "Portfolio-driven examples"}
          </h3>
          {spotlight ? (
            <>
              {spotlight.client ? (
                <p className="mt-2 text-xs uppercase tracking-wider text-[var(--text-muted)]">{spotlight.client}</p>
              ) : null}
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                {spotlight.summary ??
                  "Open this case study for the full narrative, metrics, and outcomes — edited in Content Studio."}
              </p>
              <Link
                href={spotlightHref}
                className="mt-6 inline-flex text-sm font-medium text-[var(--accent)] hover:underline"
              >
                Read case study →
              </Link>
            </>
          ) : (
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              Add Portfolio entries (mark one featured if you want it prioritized) to surface a concrete implementation story here automatically.
            </p>
          )}
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
