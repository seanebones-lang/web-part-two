import { defineField, defineType } from "sanity";

export default defineType({
  name: "devUpdate",
  title: "Dev Updates",
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
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "featuredImage",
      title: "Featured image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "title", date: "publishedAt" },
    prepare({ title, date }: { title?: string; date?: string }) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString() : "",
      };
    },
  },
});
