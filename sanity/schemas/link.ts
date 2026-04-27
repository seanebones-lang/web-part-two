import { defineField, defineType } from "sanity";

export default defineType({
  name: "link",
  title: "Links",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "pinned",
      title: "Pinned",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      initialValue: 0,
    }),
  ],
});
