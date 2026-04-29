import type { PortableTextBlock } from "@portabletext/types";

export type Slug = { current?: string };

export type SanityProduct = {
  _id: string;
  name: string;
  slug: Slug;
  tagline?: string;
  description?: string;
  cta?: string;
  productUrl?: string;
  iconOrImage?: unknown;
};

export type SanityAnnouncement = {
  _id: string;
  title: string;
  slug: Slug;
  publishedAt?: string;
  expiresAt?: string;
  body?: PortableTextBlock[];
};

export type SanityDevUpdateListItem = {
  _id: string;
  title: string;
  slug: Slug;
  publishedAt?: string;
  excerpt?: string;
};

export type SanityPortfolioItem = {
  _id: string;
  title: string;
  slug: Slug;
  client?: string;
  summary?: string;
  vertical?: string;
  liveUrl?: string;
  featured?: boolean;
};

export type SanityLink = {
  _id: string;
  title: string;
  url: string;
  category?: string;
  description?: string;
  pinned?: boolean;
};
