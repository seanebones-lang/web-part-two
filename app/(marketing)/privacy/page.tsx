import type { Metadata } from "next";

import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How NextEleven and Mothership AI collect, use, and protect your information.",
};

export default function PrivacyPage() {
  const updated = "May 1, 2026";

  return (
    <main className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
        Legal
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-[var(--text-muted)]">Last updated: {updated}</p>

      <div className="prose-legal mt-10 space-y-8 text-sm leading-relaxed text-[var(--text-muted)]">
        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">1. Who we are</h2>
          <p>
            NextEleven (also operating as Mothership AI) is an AI and software studio. Our website is{" "}
            <strong className="text-[var(--text-primary)]">mothership-ai.com</strong>. References to
            "we," "us," or "our" in this policy refer to NextEleven.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">2. Information we collect</h2>
          <p>We may collect the following information when you use our site:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong className="text-[var(--text-primary)]">Contact form submissions</strong> — name,
              email address, company (optional), and your message when you fill out the contact form.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Chat assistant interactions</strong> — messages
              you send to our AI assistant. These may be processed by xAI (the model provider) and are
              not stored permanently on our servers.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Usage data</strong> — standard web server
              logs (IP address, browser type, pages visited) collected automatically by our hosting
              provider (Vercel).
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Files you upload</strong> — documents or
              images you attach to the chat assistant. These are processed in-session and are not stored.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">3. How we use your information</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>To respond to your contact form inquiries.</li>
            <li>To operate and improve the AI chat assistant on our site.</li>
            <li>To monitor site performance and security.</li>
          </ul>
          <p className="mt-3">
            We do not sell your personal information to third parties. We do not use your data for
            advertising.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">4. Third-party services</h2>
          <p>We use the following third-party services that may process your data:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong className="text-[var(--text-primary)]">Vercel</strong> — site hosting and edge
              functions. <a href="https://vercel.com/legal/privacy-policy" className="underline hover:text-[var(--accent)]" target="_blank" rel="noopener noreferrer">Privacy policy</a>.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">xAI (Grok)</strong> — AI model provider
              for the chat assistant. <a href="https://x.ai/legal/privacy-policy" className="underline hover:text-[var(--accent)]" target="_blank" rel="noopener noreferrer">Privacy policy</a>.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Sanity</strong> — headless CMS for site
              content management. <a href="https://www.sanity.io/legal/privacy" className="underline hover:text-[var(--accent)]" target="_blank" rel="noopener noreferrer">Privacy policy</a>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">5. Cookies</h2>
          <p>
            Our site uses minimal cookies. Vercel may set functional cookies for edge routing. We do
            not use tracking or advertising cookies. You can disable cookies in your browser settings
            without loss of core site functionality.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">6. Data retention</h2>
          <p>
            Contact form submissions are retained only as long as necessary to respond to your inquiry.
            Chat session data is not stored beyond the browser session. Server logs are retained
            according to Vercel&apos;s standard data retention policies.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">7. Your rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct, or delete your personal
            data. To exercise any of these rights, contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-[var(--accent)]">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">8. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The "last updated" date at the top reflects the
            most recent revision. Continued use of the site after changes constitutes acceptance of the
            updated policy.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">9. Contact</h2>
          <p>
            Questions about this policy? Email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-[var(--accent)]">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
