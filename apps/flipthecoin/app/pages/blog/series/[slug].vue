<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

const BASE = 'https://flipthecoin.app';

const route = useRoute();
const { $getLocale, $t, localePath } = useI18n();

const locale = computed(() => $getLocale());
const slug = computed(() => String(route.params.slug ?? ''));

// Fetch the series meta + its published, ordered members for the current locale.
const { data: seriesData } = await useAsyncData(
  () => `blog-series-page-${locale.value}-${slug.value}`,
  async () => {
    if (!slug.value) return null;
    const [meta, members] = await Promise.all([
      queryCollection('series')
        .where('slug', '=', slug.value)
        .where('_locale', '=', locale.value)
        .first(),
      queryCollection('blog')
        .where('series', '=', slug.value)
        .where('_locale', '=', locale.value)
        .all(),
    ]);
    const published = (members ?? []).filter((m) => m.meta.published !== false);
    // `seriesOrder` may land top-level or under `.meta` — read both, mirroring
    // the defensive pattern in pages/blog/[post].vue.
    const orderOf = (m: (typeof published)[number]) =>
      (m.meta?.seriesOrder ??
        (m as { seriesOrder?: number }).seriesOrder ??
        Number.MAX_SAFE_INTEGER) as number;
    published.sort((a, b) => orderOf(a) - orderOf(b));
    return { meta, members: published };
  },
  { watch: [slug, locale] },
);

const meta = computed(() => seriesData.value?.meta ?? null);
const members = computed(() => seriesData.value?.members ?? []);
const found = computed(() => !!meta.value && members.value.length > 0);

// Resolve authors so we can show the series author once (derived from the first
// member), reusing the same lookup as pages/blog/index.vue.
const { data: authors } = await useAsyncData('series-page-authors', () =>
  queryCollection('authors').all(),
);

const authorsBySlug = computed(() => {
  const map: Record<string, { name: string; url?: string; avatar?: string }> =
    {};
  for (const a of authors.value ?? []) {
    const s = String(a.stem ?? '')
      .split('/')
      .pop();
    if (s) map[s] = a;
  }
  return map;
});

const authorFor = (post: BlogCollectionItem) => {
  const s = (post.meta?.author as string | undefined) ?? 'paul-melero';
  return authorsBySlug.value[s] ?? authors.value?.[0];
};

const seriesAuthor = computed(() =>
  members.value.length ? authorFor(members.value[0]!) : undefined,
);

const authorInitials = computed(() =>
  (seriesAuthor.value?.name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join(''),
);

const slugOf = (member: BlogCollectionItem) =>
  ((member.meta?.slug ?? member.slug) as string | undefined) ?? '';

// ── SEO ──────────────────────────────────────────────────────────────────────
const ogImage = computed(() =>
  slug.value
    ? `${BASE}/img/og/series/${slug.value}-${locale.value}.png`
    : undefined,
);

useSeoMeta({
  title: () => meta.value?.title,
  description: () => meta.value?.description,
  ogType: 'website',
  ogImage: () => ogImage.value,
  twitterImage: () => ogImage.value,
  twitterCard: 'summary_large_image',
});

useHead(
  computed(() => {
    if (!found.value) return {};
    // Series share one slug across locales, so hreflang pairs are direct.
    const enHref = `${BASE}/blog/series/${slug.value}/`;
    const esHref = `${BASE}/es/blog/series/${slug.value}/`;
    const selfUrl = locale.value === 'es' ? esHref : enHref;

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
          item: `${BASE}${locale.value === 'es' ? '/es' : ''}/blog/series/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: meta.value?.title,
          item: selfUrl,
        },
      ],
    };

    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: meta.value?.title,
      description: meta.value?.description,
      itemListElement: members.value.map((m, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE}${locale.value === 'es' ? '/es' : ''}/blog/${slugOf(m)}/`,
        name: m.title,
      })),
    };

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
      script: [
        {
          key: 'series-breadcrumb-schema',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(breadcrumbSchema),
        },
        {
          key: 'series-itemlist-schema',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(itemListSchema),
        },
      ],
    };
  }),
);
</script>

<template>
  <div class="container mx-auto mb-16 max-w-4xl px-4">
    <template v-if="found && meta">
      <header
        class="mb-10 flex flex-col gap-3 rounded-[2rem] border border-primary/20 bg-primary/5 p-6 md:p-8"
      >
        <!-- breadcrumb cross-links back to the blog + series hub -->
        <nav
          class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-base-content/60"
          aria-label="Breadcrumb"
        >
          <nuxt-link
            :to="localePath('/blog')"
            class="transition-colors hover:text-primary"
          >
            {{ $t('nav.blog') }}
          </nuxt-link>
          <span class="text-primary/40" aria-hidden="true">›</span>
          <nuxt-link
            :to="localePath('/blog/series')"
            class="transition-colors hover:text-primary"
          >
            {{ $t('blog.series.breadcrumbSeries') }}
          </nuxt-link>
          <span class="text-primary/40" aria-hidden="true">›</span>
          <span class="text-base-content/80">{{ meta.title }}</span>
        </nav>

        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            class="text-xs font-semibold uppercase tracking-wider text-primary/80"
          >
            {{ $t('blog.series.count', { n: members.length }) }}
          </span>
          <span v-if="seriesAuthor" class="text-primary/40" aria-hidden="true"
            >·</span
          >
          <span
            v-if="seriesAuthor"
            class="flex items-center gap-1.5 text-xs text-base-content/60"
          >
            <span
              class="avatar"
              :class="{ 'avatar-placeholder': !seriesAuthor.avatar }"
            >
              <span
                class="size-5 rounded-full bg-slate-100/20 text-base-content/70 dark:bg-base-300/20"
                :class="{ 'ring-1 ring-base-content/10': seriesAuthor.avatar }"
              >
                <img
                  v-if="seriesAuthor.avatar"
                  :src="seriesAuthor.avatar"
                  :alt="seriesAuthor.name"
                  loading="lazy"
                />
                <span v-else class="text-[0.6rem] font-semibold">{{
                  authorInitials
                }}</span>
              </span>
            </span>
            {{ $t('blog.writtenBy') }} {{ seriesAuthor.name }}
          </span>
        </div>

        <FTitle as="h1">{{ meta.title }}</FTitle>
        <p v-if="meta.description" class="text-base-content/70">
          {{ meta.description }}
        </p>
      </header>

      <ol class="flex flex-col gap-6">
        <li
          v-for="(member, i) in members"
          :key="member.path"
          class="flex flex-col gap-2"
        >
          <span
            class="pl-2 text-xs font-semibold uppercase tracking-wider text-primary/70"
          >
            {{ $t('blog.series.partOf', { n: i + 1, total: members.length }) }}
          </span>
          <BlogPost :post="member" :in-series="true" />
        </li>
      </ol>
    </template>

    <p v-else>{{ $t('blog.notFound') }}</p>
  </div>

  <div class="container mx-auto mb-16 max-w-4xl px-4">
    <BlogGoToBlogCTA />
  </div>
</template>
