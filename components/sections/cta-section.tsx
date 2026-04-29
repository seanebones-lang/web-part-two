"use client";

import { useState } from "react";

import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from "@/lib/contact";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";

type FormState = "idle" | "sending" | "success" | "error";

export function CtaSection() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      company: (form.elements.namedItem("company") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        setState("success");
        form.reset();
      } else {
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again or email us directly.");
      setState("error");
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 pb-28 pt-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="glass-panel relative overflow-hidden rounded-3xl px-4 py-12 ring-1 ring-[var(--accent)]/30 sm:px-8 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,211,238,0.15),transparent_55%)]" />
          <div className="relative">
            <SectionEyebrow centered>05 · Contact</SectionEyebrow>
            <h2 className="text-center text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Ready for AI that ships — safely — on your rails?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-[var(--text-muted)]">
              Tell us about your use case and timeline. We&apos;ll map a clear path from first build to production.
            </p>

            {state === "success" ? (
              <div className="mx-auto mt-10 max-w-md rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-6 py-8 text-center">
                <p className="text-lg font-semibold text-[var(--text-primary)]">We&apos;ll be in touch.</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Thanks for reaching out — we typically reply within one business day.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-10 grid max-w-lg gap-4"
                noValidate
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-medium text-[var(--text-muted)]">
                      Name <span className="text-[var(--accent)]">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Jane Smith"
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]/50 focus:border-[var(--accent)]/60 focus:ring-1 focus:ring-[var(--accent)]/40"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-[var(--text-muted)]">
                      Email <span className="text-[var(--accent)]">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="jane@company.com"
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]/50 focus:border-[var(--accent)]/60 focus:ring-1 focus:ring-[var(--accent)]/40"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="company" className="text-xs font-medium text-[var(--text-muted)]">
                    Company <span className="text-[var(--text-muted)]/50">(optional)</span>
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Acme Corp"
                    className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]/50 focus:border-[var(--accent)]/60 focus:ring-1 focus:ring-[var(--accent)]/40"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-medium text-[var(--text-muted)]">
                    Message <span className="text-[var(--accent)]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us what you're trying to build or solve..."
                    className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]/50 focus:border-[var(--accent)]/60 focus:ring-1 focus:ring-[var(--accent)]/40"
                  />
                </div>

                {state === "error" && (
                  <p className="text-center text-sm text-red-400">{errorMsg}</p>
                )}

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="neon-hover inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-[var(--bg-deep)] shadow-[0_0_36px_var(--accent-glow)] disabled:opacity-60 sm:w-auto"
                  >
                    {state === "sending" ? "Sending…" : "Send message"}
                  </button>
                  <a
                    href={CONTACT_PHONE_HREF}
                    className="neon-hover inline-flex w-full items-center justify-center rounded-full border border-[var(--border-subtle)] px-8 py-3 text-sm font-medium text-[var(--text-primary)] hover:bg-white/5 sm:w-auto"
                  >
                    Call {CONTACT_PHONE_DISPLAY}
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
