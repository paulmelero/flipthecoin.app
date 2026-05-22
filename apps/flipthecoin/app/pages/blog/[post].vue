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

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description,
});

useHead(
  computed(() => {
    const enSlug = siblings.value?.['en'];
    const esSlug = siblings.value?.['es'];
    if (!enSlug || !esSlug) return {};
    const enHref = `${BASE}/blog/${enSlug}`;
    const esHref = `${BASE}/es/blog/${esSlug}`;
    return {
      link: [
        { key: 'hreflang-en', rel: 'alternate', hreflang: 'en', href: enHref },
        { key: 'hreflang-es', rel: 'alternate', hreflang: 'es', href: esHref },
        {
          key: 'hreflang-xdefault',
          rel: 'alternate',
          hreflang: 'x-default',
          href: enHref,
        },
      ],
    };
  }),
);
</script>

<template>
  <div class="mb-16" v-if="post && post.body">
    <ContentRenderer :value="post" />
  </div>
  <div class="mb-16" v-else>
    <p>{{ $t('blog.notFound') }}</p>
  </div>

  <div class="mb-16">
    <BlogGoToBlogCTA />
  </div>
</template>
