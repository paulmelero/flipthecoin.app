<template>
  <HomeHero id="hero" />
  <HomeFeaturesTriptych />
  <HomeRecentArticles />
  <HomeMathMotifDivider />
  <FJumbo class="prose dark:prose-invert">
    <ContentRenderer v-if="home" :value="home" />
  </FJumbo>
  <HomeExtensionPromo />
  <FJumbo class="flex flex-col items-center gap-4">
    <BlogGoToBlogCTA />
  </FJumbo>
  <div class="divider" />
  <FJumbo class="min-h-[400px]">
    <NewsletterForm />
  </FJumbo>
</template>

<script setup lang="ts">
const { $getLocale } = useI18n();
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
  description: () => home.value?.description,
});
</script>
