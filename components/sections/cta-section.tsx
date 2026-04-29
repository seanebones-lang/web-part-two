import Link from "next/link";

import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from "@/lib/contact";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export function CtaSection() {
  return (
    <section id="contact" className="scroll-mt-24 pb-28 pt-8">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="glass-panel relative overflow-hidden rounded-3xl px-4 py-12 ring-1 ring-[var(--accent)]/30 sm:px-6 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,211,238,0.15),transparent_55%)]" />
          <div className="relative">
            <SectionEyebrow centered>05 · Contact</SectionEyebrow>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Ready for AI that ships — safely — on your rails?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--text-muted)]">
              Tell us about your use case, compliance requirements, and timeline — we&apos;ll map a clear path from first build to production.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href={`mailto:${CONTACT_EMAIL}`}
                className="neon-hover inline-flex rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-[var(--bg-deep)] shadow-[0_0_36px_var(--accent-glow)]"
              >
                Email us
              </Link>
              <Link
                href={CONTACT_PHONE_HREF}
                className="neon-hover inline-flex rounded-full border border-[var(--border-subtle)] px-8 py-3 text-sm font-medium text-[var(--text-primary)] hover:bg-white/5"
              >
                Call {CONTACT_PHONE_DISPLAY}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
