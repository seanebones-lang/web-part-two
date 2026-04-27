export const productsQuery = `*[_type == "product"] | order(order asc, name asc) {
  _id,
  name,
  slug,
  tagline,
  description,
  cta,
  iconOrImage
}`;

export const bannerAnnouncementQuery = `*[_type == "announcement" && priority == "banner"] | order(publishedAt desc)[0]{
  _id,
  title,
  slug,
  publishedAt,
  expiresAt,
  body
}`;

export const devUpdatesListQuery = `*[_type == "devUpdate"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  "previewImage": featuredImage
}`;

export const devUpdateBySlugQuery = `*[_type == "devUpdate" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  body,
  tags,
  featuredImage
}`;

export const portfolioListQuery = `*[_type == "portfolioItem"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  client,
  summary,
  vertical,
  featured
}`;

export const portfolioBySlugQuery = `*[_type == "portfolioItem" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  client,
  summary,
  body,
  metrics,
  vertical
}`;

export const linksQuery = `*[_type == "link"] | order(order asc, title asc) {
  _id,
  title,
  url,
  category,
  description,
  pinned
}`;

export const announcementBySlugQuery = `*[_type == "announcement" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  expiresAt,
  priority,
  body
}`;
