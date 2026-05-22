<template>
  <HomeHero id="hero" />
  <HomeFeaturesTriptych />
  <HomeRecentArticles />
  <HomeMathMotifDivider />
  <FJumbo class="prose dark:prose-invert">
    <ContentRenderer v-if="home" :value="home" />
  </FJumbo>
  <FJumbo class="flex flex-col items-center gap-4">
    <BlogGoToBlogCTA />
  </FJumbo>
  <HomeExtensionPromo />
  <HomeFaq />
  <div class="divider" />
  <FJumbo class="min-h-[400px]">
    <NewsletterForm />
  </FJumbo>
</template>

<script setup lang="ts">
const { $t, $getLocale } = useI18n();
const locale = computed(() => $getLocale());

const { data: home } = await useAsyncData(
  () => `home-${locale.value}`,
  () =>
    queryCollection('pages')
      .where('slug', '=', 'index')
      .where('_locale', '=', locale.value)
      .first(),
  { watch: [locale] },
);

useSeoMeta({
  title: () => home.value?.title,
  description: () => home.value?.description ?? $t('app.description'),
});

const faqSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: $t('faq.q1'),
      acceptedAnswer: { '@type': 'Answer', text: $t('faq.a1') },
    },
    {
      '@type': 'Question',
      name: $t('faq.q2'),
      acceptedAnswer: { '@type': 'Answer', text: $t('faq.a2') },
    },
    {
      '@type': 'Question',
      name: $t('faq.q3'),
      acceptedAnswer: { '@type': 'Answer', text: $t('faq.a3') },
    },
    {
      '@type': 'Question',
      name: $t('faq.q4'),
      acceptedAnswer: { '@type': 'Answer', text: $t('faq.a4') },
    },
  ],
}));

useHead(
  computed(() => ({
    script: [
      {
        key: 'faq-schema',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(faqSchema.value),
      },
    ],
  })),
);
</script>
