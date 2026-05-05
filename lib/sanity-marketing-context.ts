import type { SanityLink, SanityPortfolioItem, SanityProduct } from "@/lib/sanity-types";

/** App Store / Play Store URLs saved as Sanity `link` documents */
const MOBILE_STORE_URL_RE =
  /(apps\.apple\.com|itunes\.apple\.com|play\.google\.com)/i;

export function isMobileStoreUrl(url: string): boolean {
  return MOBILE_STORE_URL_RE.test(url);
}

export function filterMobileStoreLinks(links: SanityLink[]): SanityLink[] {
  return links.filter((l) => l.url && isMobileStoreUrl(l.url));
}

/** Human-readable labels for `portfolioItem.vertical` schema values */
const PORTFOLIO_VERTICAL_LABEL: Record<string, string> = {
  websites: "Websites",
  "mobile-apps": "Mobile Apps",
  finance: "Finance",
  healthcare: "Healthcare",
  saas: "SaaS",
  legal: "Legal",
  other: "Other",
};

export function portfolioVerticalLabel(code: string | undefined): string | null {
  if (!code?.trim()) return null;
  return PORTFOLIO_VERTICAL_LABEL[code] ?? code;
}

/** Unique portfolio vertical labels for marketing chips (stable sort) */
export function uniquePortfolioVerticalLabels(items: SanityPortfolioItem[]): string[] {
  const labels = new Set<string>();
  for (const item of items) {
    const label = portfolioVerticalLabel(item.vertical);
    if (label) labels.add(label);
  }
  return [...labels].sort((a, b) => a.localeCompare(b));
}

export function formatOxfordList(names: string[]): string {
  const n = names.map((s) => s.trim()).filter(Boolean);
  if (n.length === 0) return "";
  if (n.length === 1) return n[0]!;
  if (n.length === 2) return `${n[0]} and ${n[1]}`;
  return `${n.slice(0, -1).join(", ")}, and ${n.at(-1)!}`;
}

export function productNamesFromSanity(products: SanityProduct[]): string[] {
  return products.map((p) => p.name.trim()).filter(Boolean);
}

/** Spotlight story for Services page: featured first, else most recently listed */
export function pickPortfolioSpotlight(items: SanityPortfolioItem[]): SanityPortfolioItem | null {
  if (!items.length) return null;
  const featured = items.find((i) => i.featured);
  return featured ?? items[0]!;
}
