import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Products",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "pricingHint",
      title: "Legacy field (hidden)",
      type: "string",
      hidden: true,
      description: "Deprecated — not shown on the public site.",
    }),
    defineField({
      name: "cta",
      title: "Primary CTA label",
      type: "string",
    }),
    defineField({
      name: "iconOrImage",
      title: "Icon or image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
