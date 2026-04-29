import type { MetadataRoute } from "next";

import { sanityFetch } from "@/sanity/lib/client";
import { portfolioListQuery, devUpdatesListQuery } from "@/sanity/lib/queries";
import type { SanityPortfolioItem, SanityDevUpdateListItem } from "@/lib/sanity-types";

const BASE = "https://mothership-ai.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [portfolio, devUpdates] = await Promise.all([
    sanityFetch<SanityPortfolioItem[]>(portfolioListQuery).catch(() => []),
    sanityFetch<SanityDevUpdateListItem[]>(devUpdatesListQuery).catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/dev-updates`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/links`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const portfolioRoutes: MetadataRoute.Sitemap = (portfolio ?? [])
    .filter((item) => item.slug?.current)
    .map((item) => ({
      url: `${BASE}/portfolio/${item.slug.current}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const devUpdateRoutes: MetadataRoute.Sitemap = (devUpdates ?? [])
    .filter((item) => item.slug?.current)
    .map((item) => ({
      url: `${BASE}/dev-updates/${item.slug.current}`,
      lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [...staticRoutes, ...portfolioRoutes, ...devUpdateRoutes];
}
