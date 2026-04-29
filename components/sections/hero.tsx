"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const focusAreas = [
  "AI development & consulting",
  "Software",
  "RAG & knowledge systems",
  "AI assistants",
  "Custom web — modern stacks & UX",
  "Mobile apps",
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const orbYA = useTransform(scrollYProgress, [0, 1], [0, -56]);
  const orbYB = useTransform(scrollYProgress, [0, 1], [0, -38]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden mesh-hero">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden>
        <motion.div
          style={{ y: orbYA }}
          className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-[var(--mesh-1)] blur-[100px]"
        />
        <motion.div
          style={{ y: orbYB }}
          className="absolute right-1/4 top-40 h-72 w-72 rounded-full bg-[var(--mesh-2)] blur-[110px]"
        />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]"
          >
            NextEleven · AI Systems & Software Studio
          </motion.p>
          <h1 className="font-display mt-4 text-3xl font-semibold leading-[1.06] tracking-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl lg:text-6xl">
            Enterprise AI That{" "}
            <span className="text-gradient-animated">Actually Works</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg"
          >
            We design and build AI-powered software — custom assistants, RAG pipelines, production APIs,
            modern web experiences, and native mobile apps — from first prototype to the thing your team
            actually runs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {focusAreas.map((label) => (
              <span
                key={label}
                className="rounded-full border border-[var(--border-subtle)] bg-white/[0.04] px-3 py-1 text-xs font-medium text-[var(--text-muted)]"
              >
                {label}
              </span>
            ))}
            <span className="rounded-full border border-dashed border-[var(--border-subtle)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]/80">
              + more
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/#contact"
              className="neon-hover inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-[var(--bg-deep)] shadow-[0_0_36px_var(--accent-glow)]"
            >
              Start a conversation
            </Link>
            <Link
              href="/portfolio"
              className="neon-hover inline-flex items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white/5 px-8 py-3 text-sm font-medium text-[var(--text-primary)] backdrop-blur hover:border-[var(--accent)]/40 hover:bg-white/10"
            >
              View portfolio
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="hero-gradient-ring relative w-full max-w-md lg:w-[380px]"
        >
          <div className="glass-panel glass-panel--static relative rounded-[15px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/85 p-6 shadow-none backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                What we ship
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/40">
                Production-ready
              </span>
            </div>
            <ul className="mt-5 space-y-4 text-sm text-[var(--text-muted)]">
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
                Strategy → working software: APIs, UIs, assistants, and observability you can run.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--violet)] shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
                Web and mobile surfaces built with current-gen tooling — fast, accessible, maintainable.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                RAG, grounding, and evaluation when model behavior has to hold up in production.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                Shipped work includes dealership inventory intelligence, email routing automation, and mobile customer workflows.
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
