import type { Metadata } from "next";

import type { SanityProduct } from "@/lib/sanity-types";
import { productsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/client";

import { ProductsSection } from "@/components/sections/products-section";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Platforms and modules we ship alongside custom builds.",
};

export default async function ProductsPage() {
  const products = (await sanityFetch<SanityProduct[]>(productsQuery)) ?? [];

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pb-4 pt-16 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Built to Ship With You
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
          Standalone tools and modules that extend or anchor any custom AI program.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-[var(--text-muted)]">
          Flagship focus: production-grade chat systems and RAG-backed assistants that integrate with your
          existing web, mobile, and internal software surfaces.
        </p>
      </div>
      <ProductsSection products={products} showIntro={false} />
    </div>
  );
}
