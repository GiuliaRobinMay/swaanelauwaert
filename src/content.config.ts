import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const common = {
  title: z.string(),
  wpSlug: z.string(),
  path: z.string(),
  lang: z.enum(["en", "nl", "fr"]),
  date: z.coerce.date(),
  modified: z.coerce.date().optional(),
  excerpt: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  imageWidth: z.number().optional(),
  imageHeight: z.number().optional(),
  ogImage: z.string().optional(),
  wpId: z.number(),
  originalUrl: z.string(),
  hasRawHtml: z.boolean().optional(),
  bodySource: z.string().optional(),
  inlineCss: z.string().optional(),
};

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    ...common,
    isHome: z.boolean().optional(),
    parent: z.number().optional(),
    menuOrder: z.number().optional(),
    template: z.string().optional(),
    bodyClass: z.string().optional(),
    translations: z.record(z.string()).optional(),
    showTitle: z.boolean().optional(),
    showFeatured: z.boolean().optional(),
    protected: z.boolean().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    ...common,
    author: z.string().optional(),
    categories: z.array(z.string()).default([]),
    categorySlugs: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    tagSlugs: z.array(z.string()).default([]),
    sticky: z.boolean().optional(),
    format: z.string().optional(),
    commentStatus: z.string().optional(),
  }),
});

export const collections = { pages, posts };
