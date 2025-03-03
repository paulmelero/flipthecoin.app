import { defineContentConfig, defineCollection } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: 'pages/**/*.md',
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
    }),
  },
});
