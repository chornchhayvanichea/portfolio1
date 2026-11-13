import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: "page",
      source: "projects/*.md",
      schema: z.object({
        stack: z.array(z.string()).default([]),
        featured: z.number().default(99),
        repo: z.string().optional(),
        demo: z.string().optional(),
      }),
    }),
  },
});
