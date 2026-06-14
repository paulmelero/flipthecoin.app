import { defineContentConfig, defineCollection, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: 'pages/**/*.md',
      schema: z.object({
        slug: z.string().min(1),
        title: z.string().min(1),
        description: z.string().optional(),
        _locale: z.enum(['en', 'es']),
      }),
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        slug: z.string().min(1),
        title: z.string().min(3),
        description: z.string().min(10),
        published: z.boolean().optional(),
        date: z.string(),
        _locale: z.enum(['en', 'es']),
        author: z.string().optional(),
        excerpt: z.object({
          type: z.string(),
          children: z.any(),
        }),
        tags: z.array(z.string()).optional(),
        level: z.enum(['beginner', 'intermediate', 'advanced']),
        series: z.string().optional(),
        seriesOrder: z.number().optional(),
      }),
    }),
    series: defineCollection({
      type: 'data',
      source: 'series/**.yml',
      schema: z.object({
        slug: z.string().min(1),
        title: z.string().min(1),
        description: z.string(),
        // Optional: pins the series block's position in the blog list. When set,
        // it overrides the default "anchor at newest member" sorting.
        date: z.string().optional(),
        _locale: z.enum(['en', 'es']),
      }),
    }),
    authors: defineCollection({
      type: 'data',
      source: 'authors/**.yml',
      schema: z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        url: z.string().url(),
        avatar: z.string(),
      }),
    }),
  },
});
