<script setup lang="ts">
const { $t, $getLocale } = useI18n();
const locale = computed(() => $getLocale());

const { data: page } = await useAsyncData(
  () => `page-extension-${locale.value}`,
  () =>
    queryCollection('pages')
      .where('slug', '=', 'extension')
      .where('_locale', '=', locale.value)
      .first(),
  { watch: [locale] },
);

definePageMeta({
  layout: 'blogpost',
});

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description ?? $t('app.description'),
});
</script>

<template>
  <div class="prose dark:prose-invert">
    <ContentRenderer v-if="page" :value="page" />
    <div class="divider" />
    <NewsletterForm />
  </div>
</template>
