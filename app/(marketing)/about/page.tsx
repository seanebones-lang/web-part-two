import type { Metadata } from "next";
import Link from "next/link";

import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about NextEleven and Mothership AI — who we are, how we build, and how Products, Links, and Portfolio stay synced via Content Studio.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
        About
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
        We build AI that ships.
      </h1>

      <p className="mt-6 text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
        NextEleven is a small, focused AI and software studio. We design and build
        production-grade AI systems — custom assistants, retrieval pipelines, APIs, and
        native mobile apps — for founders, operators, and enterprise teams who need real
        results, not demos. Highlights you see on this site — Products, curated Links (including storefront URLs when you add them), and Portfolio case studies — are authored in Content Studio so messaging stays consistent with what you approve.
      </p>

      {/* Two-brand explanation */}
      <div className="mt-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          NextEleven &amp; Mothership AI
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          <strong className="text-[var(--text-primary)]">NextEleven</strong> is the
          studio — the team, the craft, the relationships. We&apos;ve operated under this
          name since the beginning and it&apos;s where client work lives.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          <strong className="text-[var(--text-primary)]">Mothership AI</strong> is our
          product and platform identity — the domain name, the AI-facing brand, and the
          umbrella for the tools we&apos;re building as standalone products.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          Both brands represent the same people and the same commitment: ship real AI
          that solves real problems.
        </p>
      </div>

      {/* Philosophy */}
      <h2 className="mt-12 text-xl font-semibold text-[var(--text-primary)]">
        How we work
      </h2>

      <ul className="mt-4 space-y-4">
        {[
          {
            title: "We own the outcome, not just the ticket.",
            body: "When we take on a build, we treat it as our own product — from architecture to deployment to monitoring.",
          },
          {
            title: "Small team, focused attention.",
            body: "We don't spin up an agency farm. Your project gets senior-level attention from the people who built the system.",
          },
          {
            title: "AI-first but pragmatic.",
            body: "We know when to use a model and when a simpler solution is better. Hallucination-safe design isn't an upsell — it's the baseline.",
          },
          {
            title: "Speed without shortcuts.",
            body: "Proof of concept to production in days is a real target. We hit it by having done this before, many times, across many industries.",
          },
        ].map((item) => (
          <li
            key={item.title}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 px-5 py-4"
          >
            <p className="font-medium text-[var(--text-primary)]">{item.title}</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{item.body}</p>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-14 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 text-center sm:p-8">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Ready to build something real?
        </h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Tell us what you&apos;re trying to solve. We&apos;ll tell you if we can help.
        </p>
        <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/#contact"
            className="inline-flex h-10 items-center rounded-lg bg-[var(--accent)] px-6 text-sm font-medium text-black transition hover:opacity-90"
          >
            Start a conversation
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-sm text-[var(--text-muted)] transition hover:text-[var(--accent)]"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </main>
  );
}
