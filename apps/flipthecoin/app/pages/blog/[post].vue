<script setup lang="ts">
const BASE = 'https://flipthecoin.app';

definePageMeta({
  layout: 'blogpost',
});

const route = useRoute();
const { $getLocale, $t } = useI18n();

const locale = computed(() => $getLocale());
const slug = computed(() => String(route.params.post ?? ''));

const { data: post } = await useAsyncData(
  () => `blog-post-${locale.value}-${slug.value}`,
  async () => {
    if (!slug.value) return null;
    return queryCollection('blog')
      .where('slug', '=', slug.value)
      .where('_locale', '=', locale.value)
      .first();
  },
  { watch: [slug, locale] },
);

// Fetch sibling posts to build correct cross-locale hreflang URLs
const { data: siblings } = await useAsyncData(
  () => `blog-siblings-${locale.value}-${slug.value}`,
  async () => {
    const stem = post.value?.stem;
    if (!stem) return null;
    const baseStem = String(stem).replace(/\.[a-z]{2}$/i, '');
    const rows = await queryCollection('blog')
      .where('stem', 'LIKE', `${baseStem}.%`)
      .all();
    const map: Record<string, string> = {};
    for (const row of rows) {
      if (row._locale && row.slug) {
        map[row._locale as string] = row.slug as string;
      }
    }
    return map;
  },
  { watch: [slug, locale] },
);

// Resolve the post's author from the authors data collection.
const { data: authors } = await useAsyncData('post-authors', () =>
  queryCollection('authors').all(),
);

const author = computed(() => {
  const list = authors.value ?? [];
  const slug =
    (post.value?.meta?.author as string | undefined) ?? 'paul-melero';
  return (
    list.find(
      (a) =>
        String(a.stem ?? '')
          .split('/')
          .pop() === slug,
    ) ?? list[0]
  );
});

// The hero now shows the title, so strip the leading H1 from the rendered
// body to avoid duplicating it. The body tree is a Nuxt Content v3 minimal
// tree: `{ type, value: [["h1", props, ...], ...] }`.
const renderDoc = computed(() => {
  const p = post.value;
  const body = p?.body as { type?: string; value?: unknown[] } | undefined;
  if (!Array.isArray(body?.value)) return p;
  const isH1 = (n: unknown) => Array.isArray(n) && n[0] === 'h1';
  const value = body.value.filter((n, i) => !(i === 0 && isH1(n)));
  return { ...p, body: { ...body, value } };
});

// Per-post OG image generated locally by scripts/generate-blog-og-images.mjs
// (named `{slug}-{locale}.png`). This overrides the site-wide og:image set in
// app/app.vue.
const ogImage = computed(() =>
  post.value?.slug
    ? `${BASE}/img/og/blog/${post.value.slug}-${locale.value}.png`
    : undefined,
);

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description,
  ogType: 'article',
  ogImage: () => ogImage.value,
  twitterImage: () => ogImage.value,
  twitterCard: 'summary_large_image',
});

useHead(
  computed(() => {
    const enSlug = siblings.value?.['en'];
    const esSlug = siblings.value?.['es'];
    const hreflangLinks =
      enSlug && esSlug
        ? [
            {
              key: 'hreflang-en',
              rel: 'alternate',
              hreflang: 'en',
              href: `${BASE}/blog/${enSlug}/`,
            },
            {
              key: 'hreflang-es',
              rel: 'alternate',
              hreflang: 'es',
              href: `${BASE}/es/blog/${esSlug}/`,
            },
            {
              key: 'hreflang-xdefault',
              rel: 'alternate',
              hreflang: 'x-default',
              href: `${BASE}/blog/${enSlug}/`,
            },
          ]
        : [];

    const articleSchema = post.value
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.value.title,
          description: post.value.description,
          image: ogImage.value,
          datePublished: String(post.value.date ?? '').split('T')[0],
          author: {
            '@type': 'Organization',
            name: 'FlipTheCoin.app',
            url: BASE,
          },
          publisher: {
            '@type': 'Organization',
            name: 'FlipTheCoin.app',
            url: BASE,
            logo: `${BASE}/icon-512.png`,
          },
          url:
            locale.value === 'es'
              ? `${BASE}/es/blog/${post.value.slug}/`
              : `${BASE}/blog/${post.value.slug}/`,
        }
      : null;

    return {
      link: hreflangLinks,
      script: articleSchema
        ? [
            {
              key: 'article-schema',
              type: 'application/ld+json',
              innerHTML: JSON.stringify(articleSchema),
            },
          ]
        : [],
    };
  }),
);
</script>

<template>
  <div class="mb-16" v-if="post && renderDoc">
    <BlogPostHero :post="post" :author="author" class="mb-12" />
    <ContentRenderer :value="renderDoc" />
  </div>
  <div class="mb-16" v-else>
    <p>{{ $t('blog.notFound') }}</p>
  </div>

  <div class="mb-16">
    <BlogGoToBlogCTA />
  </div>
</template>
