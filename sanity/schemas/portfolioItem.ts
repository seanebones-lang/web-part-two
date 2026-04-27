import { defineField, defineType } from "sanity";

export default defineType({
  name: "portfolioItem",
  title: "Portfolio",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "metrics",
      title: "Outcome metrics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "value", type: "string", title: "Value" },
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "vertical",
      title: "Vertical",
      type: "string",
      options: {
        list: [
          { title: "Finance", value: "finance" },
          { title: "Healthcare", value: "healthcare" },
          { title: "SaaS", value: "saas" },
          { title: "Legal", value: "legal" },
          { title: "Other", value: "other" },
        ],
      },
      initialValue: "other",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
