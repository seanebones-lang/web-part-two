import { defineField, defineType } from "sanity";

export default defineType({
  name: "announcement",
  title: "Announcements",
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
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      options: {
        list: [
          { title: "Banner (top strip)", value: "banner" },
          { title: "Archive / news", value: "archive" },
        ],
      },
      initialValue: "archive",
    }),
    defineField({
      name: "expiresAt",
      title: "Expires at",
      type: "datetime",
    }),
  ],
});
