import type { Metadata } from "next";

import type { SanityProduct } from "@/lib/sanity-types";
import { productsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/client";

import { ProductsSection } from "@/components/sections/products-section";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Offerings published from Content Studio — synced with your Sanity Product documents.",
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
          This page reflects your Product documents in Content Studio — edit there to update titles, descriptions, imagery, and outbound links.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-[var(--text-muted)]">
          For App Store and Play listings, use Links documents (storefront URLs); this grid stays dedicated to Product entries.
        </p>
      </div>
      <ProductsSection products={products} showIntro={false} />
    </div>
  );
}
