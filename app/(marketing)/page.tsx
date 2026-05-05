import {
  bannerAnnouncementQuery,
  linksQuery,
  portfolioListQuery,
  productsQuery,
} from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/client";
import type {
  SanityAnnouncement,
  SanityLink,
  SanityPortfolioItem,
  SanityProduct,
} from "@/lib/sanity-types";
import {
  filterMobileStoreLinks,
  productNamesFromSanity,
  uniquePortfolioVerticalLabels,
} from "@/lib/sanity-marketing-context";

import { AnnouncementBanner } from "@/components/sections/announcement-banner";
import { CtaSection } from "@/components/sections/cta-section";
import { Hero } from "@/components/sections/hero";
import { ProductsSection } from "@/components/sections/products-section";
import { SocialProof } from "@/components/sections/social-proof";
import { Team } from "@/components/sections/team";
import { UseCases } from "@/components/sections/use-cases";
import { WhyNextEleven } from "@/components/sections/why-nexteleven";

export default async function HomePage() {
  const [productsResult, bannerResult, linksResult, portfolioResult] = await Promise.all([
    sanityFetch<SanityProduct[]>(productsQuery),
    sanityFetch<SanityAnnouncement | null>(bannerAnnouncementQuery),
    sanityFetch<SanityLink[]>(linksQuery),
    sanityFetch<SanityPortfolioItem[]>(portfolioListQuery),
  ]);

  const products = productsResult ?? [];
  const banner = bannerResult ?? undefined;
  const links = linksResult ?? [];
  const portfolio = portfolioResult ?? [];

  const productNames = productNamesFromSanity(products);
  const mobileLinks = filterMobileStoreLinks(links);
  const industries = uniquePortfolioVerticalLabels(portfolio);

  const stats = [
    { label: "Products (Studio)", value: String(products.length) },
    { label: "Links (Studio)", value: String(links.length) },
    { label: "Portfolio cases", value: String(portfolio.length) },
    { label: "Mobile store links", value: String(mobileLinks.length) },
  ];

  const mobileTitles = mobileLinks.map((l) => l.title.trim()).filter(Boolean);

  return (
    <>
      <AnnouncementBanner announcement={banner} />
      <Hero />
      <SocialProof industries={industries} stats={stats} />
      <WhyNextEleven productNames={productNames} mobileStoreLinkTitles={mobileTitles} />
      <UseCases />
      <ProductsSection products={products} />
      <Team />
      <CtaSection />
    </>
  );
}
