<script setup lang="ts">
const BASE = 'https://flipthecoin.app';

const route = useRoute();
const { $getLocale, $t, localePath } = useI18n();

const locale = computed(() => $getLocale());
const slug = computed(() => String(route.params.term ?? ''));

// Fetch the locale's terms once and resolve by slug, falling back to an `aka`
// alias so /glossary/clt/ resolves to central-limit-theorem if ever linked.
const { data: term } = await useAsyncData(
  () => `glossary-term-${locale.value}-${slug.value}`,
  async () => {
    if (!slug.value) return null;
    const all = await queryCollection('glossary')
      .where('_locale', '=', locale.value)
      .all();
    const needle = slug.value.toLowerCase();
    return (
      all.find((t) => t.slug === slug.value) ??
      all.find(
        (t) =>
          String(t.slug).toLowerCase() === needle ||
          ((t.aka as string[] | undefined) ?? []).some(
            (a) => a.toLowerCase() === needle,
          ),
      ) ??
      null
    );
  },
  { watch: [slug, locale] },
);

// Terms use per-locale slugs (en: `gamblers-fallacy`, es: `falacia-del-jugador`)
// but share one filename stem across locales — so pair en↔es by stem to build
// correct hreflang URLs, mirroring pages/blog/[post].vue.
const { data: siblings } = await useAsyncData(
  () => `glossary-siblings-${locale.value}-${slug.value}`,
  async () => {
    const stem = term.value?.stem;
    if (!stem) return null;
    const baseStem = String(stem).replace(/\.[a-z]{2}$/i, '');
    const rows = await queryCollection('glossary')
      .where('stem', 'LIKE', `${baseStem}.%`)
      .all();
    const map: Record<string, string> = {};
    for (const row of rows) {
      if (row._locale && row.slug)
        map[row._locale as string] = row.slug as string;
    }
    return map;
  },
  { watch: [slug, locale] },
);

const found = computed(() => !!term.value);

const ogImage = computed(() =>
  term.value
    ? `${BASE}/img/og/glossary/${term.value.slug}-${locale.value}.png`
    : undefined,
);

useSeoMeta({
  title: () => term.value?.title,
  description: () => term.value?.description,
  ogType: 'article',
  ogImage: () => ogImage.value,
  twitterImage: () => ogImage.value,
  twitterCard: 'summary_large_image',
});

useHead(
  computed(() => {
    if (!term.value) return {};
    const t = term.value;
    // Per-locale slugs: fall back to this page's own slug if a sibling locale
    // is missing, so hreflang always resolves to a real URL.
    const enSlug =
      siblings.value?.['en'] ?? (locale.value === 'en' ? t.slug : null);
    const esSlug =
      siblings.value?.['es'] ?? (locale.value === 'es' ? t.slug : null);
    const enHref = enSlug ? `${BASE}/glossary/${enSlug}/` : null;
    const esHref = esSlug ? `${BASE}/es/glossary/${esSlug}/` : null;
    const selfUrl = locale.value === 'es' ? esHref : enHref;
    const setUrl = `${BASE}${locale.value === 'es' ? '/es' : ''}/glossary/`;

    const definedTermSchema = {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: t.title,
      description: t.description,
      url: selfUrl,
      ...(t.aka && (t.aka as string[]).length ? { alternateName: t.aka } : {}),
      ...(t.link ? { sameAs: t.link } : {}),
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: $t('glossary.title'),
        url: setUrl,
      },
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: String($t('nav.glossary')),
          item: setUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t.title,
          item: selfUrl,
        },
      ],
    };

    return {
      link: [
        enHref && {
          key: 'hreflang-en',
          rel: 'alternate',
          hreflang: 'en',
          href: enHref,
        },
        esHref && {
          key: 'hreflang-es',
          rel: 'alternate',
          hreflang: 'es',
          href: esHref,
        },
        enHref && {
          key: 'hreflang-xdefault',
          rel: 'alternate',
          hreflang: 'x-default',
          href: enHref,
        },
      ].filter(Boolean),
      script: [
        {
          key: 'definedterm-schema',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(definedTermSchema),
        },
        {
          key: 'glossary-breadcrumb-schema',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  }),
);
</script>

<template>
  <div class="container mx-auto mb-16 max-w-3xl px-4">
    <template v-if="found && term">
      <header
        class="mb-8 flex flex-col gap-3 rounded-[2rem] border border-primary/20 bg-primary/5 p-6 md:p-8"
      >
        <nav
          class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-base-content/60"
          aria-label="Breadcrumb"
        >
          <nuxt-link
            :to="localePath('/glossary')"
            class="transition-colors hover:text-primary"
          >
            {{ $t('nav.glossary') }}
          </nuxt-link>
          <span class="text-primary/40" aria-hidden="true">›</span>
          <span class="text-base-content/80">{{ term.title }}</span>
        </nav>

        <div class="flex flex-wrap items-center gap-2">
          <span class="badge badge-md badge-soft badge-primary">
            {{ $t('glossary.definitionPill') }}
          </span>
        </div>

        <FTitle as="h1">{{ term.title }}</FTitle>

        <p
          v-if="term.aka && term.aka.length"
          class="text-sm text-base-content/60"
        >
          {{ $t('glossary.aka') }}
          <span class="font-medium text-base-content/80">{{
            term.aka.join(', ')
          }}</span>
        </p>
      </header>

      <p class="text-lg leading-relaxed">{{ term.description }}</p>

      <div class="mt-8 flex flex-wrap justify-between items-center gap-4">
        <nuxt-link :to="localePath('/glossary')" class="btn btn-primary">
          ← {{ $t('glossary.backToIndex') }}
        </nuxt-link>
        <BlogExternalLink
          v-if="term.link"
          :href="term.link"
          :has-icon="true"
          class="link link-primary text-sm font-semibold"
        >
          {{ $t('glossary.sourceLink') }}
        </BlogExternalLink>
      </div>
    </template>

    <p v-else>{{ $t('glossary.notFound') }}</p>
  </div>

  <hr class="my-8 border-base-content/10" />

  <div class="container mx-auto mb-16 max-w-3xl px-4">
    <BlogGoToBlogCTA />
  </div>
</template>
