import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      initialValue: "NextEleven",
    }),
    defineField({
      name: "defaultDescription",
      title: "Default SEO description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "url", type: "url", title: "URL" },
          ],
        },
      ],
    }),
  ],
});
