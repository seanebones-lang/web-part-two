import Image from "next/image";
import Link from "next/link";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import type { SanityProduct } from "@/lib/sanity-types";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

type Props = {
  products: SanityProduct[];
  /** When false, hides intro block + section id (e.g. nested on /products). */
  showIntro?: boolean;
};

export function ProductsSection({
  products,
  showIntro = true,
}: Props) {
  const list = products ?? [];
  const hasProducts = list.length > 0;

  return (
    <section
      id={showIntro ? "products" : undefined}
      className={`mx-auto max-w-6xl px-4 sm:px-6 ${showIntro ? "py-24" : "pb-24 pt-4"}`}
    >
      {showIntro ? (
        <div className="max-w-2xl">
          <SectionEyebrow>03 · Platforms</SectionEyebrow>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Products published from Content Studio
          </h2>
          <p className="mt-4 text-[var(--text-muted)]">
            Each card below mirrors your Sanity Product documents — names, descriptions, CTAs, imagery, and outbound URLs stay aligned with what you edit in Studio.
          </p>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            App Store and Google Play destinations usually belong in Links (we detect common storefront URLs). Custom builds and engagements belong in Portfolio when you want a longer narrative.
          </p>
        </div>
      ) : null}

      {!hasProducts ? (
        <div className={cn(showIntro ? "mt-12" : "", "glass-panel rounded-2xl p-10 text-center")}>
          <p className="text-[var(--text-muted)]">
            No Product documents published yet — add your offerings in{" "}
            <Link href="/studio" className="font-medium text-[var(--accent)] hover:underline">
              Content Studio
            </Link>{" "}
            to populate this section automatically.
          </p>
        </div>
      ) : (
        <div
          className={
            showIntro ? "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {list.map((product, i) => (
            <article
              key={product._id}
              className={cn(
                "glass-panel group relative overflow-hidden rounded-2xl p-6 transition",
                "hover:border-[var(--accent)]/40 hover:shadow-[0_0_40px_-12px_var(--accent-glow)]",
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative z-10 flex flex-col gap-4">
                <ProductThumb product={product} />
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {product.name}
                  </h3>
                  {product.tagline ? (
                    <p className="mt-1 text-sm text-[var(--accent)]">{product.tagline}</p>
                  ) : null}
                </div>
                {product.description ? (
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                    {product.description}
                  </p>
                ) : null}
                <div className="mt-auto flex justify-end pt-2">
                  {product.productUrl ? (
                    <a
                      href={product.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[var(--accent)] transition group-hover:underline"
                    >
                      {product.cta ?? "View product"} →
                    </a>
                  ) : (
                    <Link
                      href="/#contact"
                      className="text-sm font-medium text-[var(--accent)] transition group-hover:underline"
                    >
                      {product.cta ?? "Learn more"} →
                    </Link>
                  )}
                </div>
              </div>
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-30 blur-3xl transition group-hover:opacity-50"
                style={{
                  background:
                    i % 2 === 0
                      ? "radial-gradient(circle, var(--accent-glow), transparent)"
                      : "radial-gradient(circle, rgba(167,139,250,0.5), transparent)",
                }}
              />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ProductThumb({ product }: { product: SanityProduct }) {
  const img = product.iconOrImage;

  if (
    img &&
    typeof img === "object" &&
    "_type" in img &&
    img._type === "image" &&
    "asset" in img &&
    img.asset
  ) {
    let src: string | null = null;
    try {
      src = urlFor(img).width(160).height(160).url();
    } catch {
      src = null;
    }
    if (src) {
      return (
        <div className="relative h-14 w-14 overflow-hidden rounded-xl ring-1 ring-[var(--border-subtle)]">
          <Image src={src} alt="" fill className="object-cover" sizes="56px" />
        </div>
      );
    }
  }

  const initials = (product.name ?? "PR").slice(0, 2).toUpperCase();

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--accent-dim)] font-mono text-xs font-bold text-[var(--accent)] ring-1 ring-[var(--accent)]/30">
      {initials}
    </div>
  );
}
