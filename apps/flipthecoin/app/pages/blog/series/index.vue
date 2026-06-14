<script setup lang="ts">
import type { SeriesCollectionItem } from '@nuxt/content';

const BASE = 'https://flipthecoin.app';

const { $t, $getLocale, localePath } = useI18n();
const locale = computed(() => $getLocale());

const { data } = await useAsyncData(
  () => `blog-series-hub-${locale.value}`,
  async () => {
    const [series, posts] = await Promise.all([
      queryCollection('series').where('_locale', '=', locale.value).all(),
      queryCollection('blog').where('_locale', '=', locale.value).all(),
    ]);
    // Count published members per series slug.
    const counts: Record<string, number> = {};
    for (const post of posts ?? []) {
      if (post.meta.published === false) continue;
      const s = (post.meta?.series ?? (post as { series?: string }).series) as
        | string
        | undefined;
      if (s) counts[s] = (counts[s] ?? 0) + 1;
    }
    const list = (series ?? [])
      .map((s) => ({ series: s, count: counts[s.slug] ?? 0 }))
      .filter((entry) => entry.count > 0)
      // Newest series first, by the series' own `date` (ISO compares lexically).
      .sort((a, b) =>
        String(b.series.date ?? '').localeCompare(String(a.series.date ?? '')),
      );
    return list;
  },
  { watch: [locale] },
);

const seriesList = computed(
  () => data.value ?? ([] as { series: SeriesCollectionItem; count: number }[]),
);

useSeoMeta({
  title: () => String($t('blog.series.indexSeoTitle')),
  description: () => String($t('blog.series.indexSeoDescription')),
});

useHead(
  computed(() => {
    const enHref = `${BASE}/blog/series/`;
    const esHref = `${BASE}/es/blog/series/`;
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: String($t('nav.blog')),
          item: `${BASE}${locale.value === 'es' ? '/es' : ''}/blog/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: String($t('blog.series.breadcrumbSeries')),
          item: locale.value === 'es' ? esHref : enHref,
        },
      ],
    };
    return {
      // app.vue cedes hreflang for /blog/* paths, so the hub must emit its own.
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
      script: [
        {
          key: 'series-hub-breadcrumb-schema',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  }),
);
</script>

<template>
  <div class="container mx-auto mb-10 max-w-4xl px-4">
    <nav
      class="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-base-content/60"
      aria-label="Breadcrumb"
    >
      <nuxt-link
        :to="localePath('/blog')"
        class="transition-colors hover:text-primary"
      >
        {{ $t('nav.blog') }}
      </nuxt-link>
      <span class="text-primary/40" aria-hidden="true">›</span>
      <span class="text-base-content/80">{{
        $t('blog.series.breadcrumbSeries')
      }}</span>
    </nav>

    <FTitle>{{ $t('blog.series.indexTitle') }}</FTitle>
    <p class="text-base-content/70">{{ $t('blog.series.indexSubtitle') }}</p>
  </div>

  <section class="container mx-auto">
    <p v-if="!seriesList.length" class="mx-auto max-w-4xl px-4">
      {{ $t('blog.empty') }}
    </p>
    <div v-else class="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-2">
      <nuxt-link
        v-for="entry in seriesList"
        :key="entry.series.slug"
        :to="localePath('/blog/series/' + entry.series.slug)"
        class="group flex flex-col gap-3 rounded-[2rem] border border-primary/20 bg-primary/5 p-6 transition hover:border-primary/40 hover:shadow-lg md:p-8"
      >
        <span
          class="text-xs font-semibold uppercase tracking-wider text-primary/80"
        >
          {{ $t('blog.series.count', { n: entry.count }) }}
        </span>
        <FTitle
          as="h2"
          class="!mb-0 transition-colors group-hover:text-primary"
        >
          {{ entry.series.title }}
        </FTitle>
        <p v-if="entry.series.description" class="text-base-content/70">
          {{ entry.series.description }}
        </p>
        <span class="mt-auto pt-2 text-sm font-semibold text-primary">
          {{ $t('blog.series.viewSeries') }}
        </span>
      </nuxt-link>
    </div>
  </section>
</template>
