import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { formatOxfordList } from "@/lib/sanity-marketing-context";

type Props = {
  productNames: string[];
  mobileStoreLinkTitles: string[];
};

export function WhyNextEleven({ productNames, mobileStoreLinkTitles }: Props) {
  const shownProducts = productNames.slice(0, 8);
  const productList = formatOxfordList(shownProducts);
  const mobileList = formatOxfordList(mobileStoreLinkTitles.slice(0, 4));

  const velocityBody =
    productNames.length > 0
      ? `Studio offerings highlighted here include ${productList}${productNames.length > shownProducts.length ? ", with additional entries under Products" : ""}. We pair those published surfaces with custom builds grounded in your stack and timelines.`
      : `We ship AI systems and production software end-to-end. Publish offerings and storefront links in Content Studio so this site stays aligned with what you want highlighted.`;

  const mobileBody =
    mobileStoreLinkTitles.length > 0
      ? `Mobile storefront listings we surface include ${mobileList}${mobileStoreLinkTitles.length > 4 ? ", and more under Links" : ""}.`
      : `Store listings and reference URLs you add as Links documents surface under Links — keeping mobile destinations centralized alongside Products.`;

  const moats = [
    {
      title: "Speed to production",
      body: velocityBody,
      badge: "Velocity",
    },
    {
      title: "Hallucination-aware defaults",
      body:
        "Guardrails are designed in from day one — layered checks, evaluation hooks, and governance patterns so unsafe or unsourced answers are far less likely to reach users.",
      badge: "Safety",
    },
    {
      title: "Flexible deployment",
      body:
        "Architectures can extend across clouds, VPCs, regulated environments, and tighter estates — your infrastructure remains yours.",
      badge: "Control",
    },
    {
      title: "Forward-deployed builders",
      body:
        "Engineers who write the code and own delivery — hands-on from architecture through production monitoring.",
      badge: "Craft",
    },
    {
      title: "Composable modules",
      body:
        "Modular building blocks — safety layers, retrieval templates, evaluation workflows, and UI surfaces — that slot into existing systems without rewriting what already works.",
      badge: "Architecture",
    },
    {
      title: "Mobile & links in sync",
      body: mobileBody,
      badge: "Surfaces",
    },
  ];

  return (
    <section id="why" className="scroll-mt-24 border-y border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionEyebrow>01 · Differentiators</SectionEyebrow>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Why teams choose NextEleven
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
          Practical reasons teams keep choosing us — backed by shipped software and Content Studio–published highlights.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {moats.map((m) => (
            <article key={m.title} className="glass-panel rounded-2xl p-6">
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] ring-1 ring-[var(--border-subtle)]">
                {m.badge}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{m.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{m.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
