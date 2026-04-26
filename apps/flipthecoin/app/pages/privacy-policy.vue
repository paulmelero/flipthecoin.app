<script setup lang="ts">
const { $getLocale } = useI18n();
const locale = computed(() => $getLocale());

const { data: page } = await useAsyncData(
  () => `page-privacy-${locale.value}`,
  () =>
    queryCollection('pages')
      .where('slug', '=', 'privacy-policy')
      .where('_locale', '=', locale.value)
      .first(),
  { watch: [locale] },
);

definePageMeta({
  layout: 'blogpost',
});

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description,
});
</script>

<template>
  <div class="prose dark:prose-invert">
    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>
