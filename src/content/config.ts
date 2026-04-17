import { defineCollection, z } from "astro:content";

const themes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    order: z.number(),
    summary: z.string(),
    durationMin: z.number().default(8),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { themes };
