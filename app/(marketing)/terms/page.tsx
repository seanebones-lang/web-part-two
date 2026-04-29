import type { Metadata } from "next";

import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the NextEleven and Mothership AI website and AI assistant.",
};

export default function TermsPage() {
  const updated = "May 1, 2026";

  return (
    <main className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
        Legal
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
        Terms of Use
      </h1>
      <p className="mt-3 text-sm text-[var(--text-muted)]">Last updated: {updated}</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-[var(--text-muted)]">
        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">1. Acceptance</h2>
          <p>
            By accessing or using mothership-ai.com (the "Site"), you agree to these Terms of Use. If
            you do not agree, please do not use the Site. These terms apply to all visitors, users, and
            others who access the Site.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">2. Use of the Site</h2>
          <p>You agree to use the Site only for lawful purposes. You must not:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Attempt to gain unauthorized access to any part of the Site or its infrastructure.</li>
            <li>Use the Site to transmit spam, malware, or any harmful content.</li>
            <li>Scrape or harvest content from the Site in bulk without written permission.</li>
            <li>Use the AI chat assistant to generate content that is illegal, defamatory, or otherwise harmful.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">3. AI assistant disclaimer</h2>
          <p>
            The AI chat assistant on this Site is powered by large language models (currently Grok by
            xAI). AI outputs may be inaccurate, incomplete, or misleading. They do not constitute
            professional legal, financial, medical, or technical advice. We make no warranties about the
            accuracy or reliability of AI-generated responses.
          </p>
          <p className="mt-3">
            You are responsible for independently verifying any AI-generated information before acting
            on it.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">4. Intellectual property</h2>
          <p>
            All content on the Site — including text, design, code, images, and the AI assistant
            interface — is owned by NextEleven or its licensors and is protected by applicable
            intellectual property laws.
          </p>
          <p className="mt-3">
            Work we create under client contracts is governed by those individual agreements, which
            supersede these general terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">5. Third-party links</h2>
          <p>
            The Site may contain links to third-party websites. We are not responsible for the content
            or practices of those sites. Links do not constitute an endorsement.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">6. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, NextEleven is not liable for any indirect,
            incidental, special, or consequential damages arising from your use of the Site or the AI
            assistant. The Site is provided "as is" without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">7. Changes to these terms</h2>
          <p>
            We may revise these terms at any time. The "last updated" date reflects the most recent
            version. Continued use of the Site after changes are posted constitutes your acceptance of
            the updated terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">8. Governing law</h2>
          <p>
            These terms are governed by the laws of the United States. Any disputes shall be resolved
            in the appropriate courts of competent jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">9. Contact</h2>
          <p>
            Questions about these terms? Email us at{" "}
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
