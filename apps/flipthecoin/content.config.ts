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
