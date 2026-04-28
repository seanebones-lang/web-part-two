import {
  bannerAnnouncementQuery,
  productsQuery,
} from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/client";
import type {
  SanityAnnouncement,
  SanityProduct,
} from "@/lib/sanity-types";

import { AnnouncementBanner } from "@/components/sections/announcement-banner";
import { CtaSection } from "@/components/sections/cta-section";
import { Hero } from "@/components/sections/hero";
import { ProductsSection } from "@/components/sections/products-section";
import { SocialProof } from "@/components/sections/social-proof";
import { Team } from "@/components/sections/team";
import { UseCases } from "@/components/sections/use-cases";
import { WhyNextEleven } from "@/components/sections/why-nexteleven";

export default async function HomePage() {
  const [productsResult, bannerResult] = await Promise.all([
    sanityFetch<SanityProduct[]>(productsQuery),
    sanityFetch<SanityAnnouncement | null>(bannerAnnouncementQuery),
  ]);

  const products = productsResult ?? [];
  const banner = bannerResult ?? undefined;

  return (
    <>
      <AnnouncementBanner announcement={banner} />
      <Hero />
      <SocialProof />
      <WhyNextEleven />
      <UseCases />
      <ProductsSection products={products} />
      <Team />
      <CtaSection />
    </>
  );
}
