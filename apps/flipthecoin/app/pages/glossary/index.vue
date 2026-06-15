<script setup lang="ts">
const BASE = 'https://flipthecoin.app';

const { $getLocale, $t, localePath } = useI18n();
const locale = computed(() => $getLocale());

const { data } = await useAsyncData(
  () => `glossary-index-${locale.value}`,
  () => queryCollection('glossary').where('_locale', '=', locale.value).all(),
  { watch: [locale] },
);

const terms = computed(() =>
  [...(data.value ?? [])].sort((a, b) =>
    String(a.title).localeCompare(String(b.title), locale.value),
  ),
);

const ogImage = computed(
  () => `${BASE}/img/og/glossary/index-${locale.value}.png`,
);

useSeoMeta({
  title: () => $t('glossary.seoTitle') as string,
  description: () => $t('glossary.seoDescription') as string,
  ogType: 'website',
  ogImage: () => ogImage.value,
  twitterImage: () => ogImage.value,
  twitterCard: 'summary_large_image',
});

// DefinedTermSet groups every term so search engines see them as one glossary.
useHead(
  computed(() => {
    const setUrl = `${BASE}${locale.value === 'es' ? '/es' : ''}/glossary/`;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: $t('glossary.title'),
      description: $t('glossary.seoDescription'),
      url: setUrl,
      hasDefinedTerm: terms.value.map((t) => ({
        '@type': 'DefinedTerm',
        name: t.title,
        description: t.description,
        url: `${setUrl}${t.slug}/`,
      })),
    };
    return {
      script: [
        {
          key: 'glossary-set-schema',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema),
        },
      ],
    };
  }),
);
</script>

<template>
  <div class="container mx-auto mb-16 max-w-4xl px-4">
    <header class="mb-10 flex flex-col gap-3">
      <span
        class="text-xs font-semibold uppercase tracking-wider text-primary/80"
      >
        {{ $t('glossary.eyebrow') }}
      </span>
      <FTitle as="h1">{{ $t('glossary.title') }}</FTitle>
      <p class="text-base-content/70">{{ $t('glossary.subtitle') }}</p>
    </header>

    <dl
      v-if="terms.length"
      class="flex flex-col divide-y divide-base-content/10"
    >
      <div
        v-for="term in terms"
        :key="term.slug"
        class="grid gap-1 py-5 md:grid-cols-[minmax(0,14rem)_1fr] md:gap-6"
      >
        <dt class="font-semibold">
          <NuxtLink
            :to="localePath(`/glossary/${term.slug}`)"
            class="transition-colors hover:text-primary"
          >
            {{ term.title }}
          </NuxtLink>
        </dt>
        <dd class="text-sm text-base-content/70">
          {{ term.description }}
        </dd>
      </div>
    </dl>

    <p v-else class="text-base-content/70">{{ $t('glossary.empty') }}</p>
  </div>
</template>
