<script setup lang="ts">
const { $t, $getLocale } = useI18n();
const locale = computed(() => $getLocale());

definePageMeta({
  name: 'extension',
  layout: 'default',
});

const { data: page } = await useAsyncData(
  () => `page-extension-${locale.value}`,
  () =>
    queryCollection('pages')
      .where('slug', '=', 'extension')
      .where('_locale', '=', locale.value)
      .first(),
  { watch: [locale] },
);

useSeoMeta({
  title: () => page.value?.title,
  description: () =>
    page.value?.description ?? ($t('app.description') as string),
});
</script>

<template>
  <div>
    <ExtensionHero />
    <div class="prose dark:prose-invert container mx-auto px-4 py-16 font-body">
      <ContentRenderer v-if="page" :value="page" />
      <div class="divider" />
      <NewsletterForm />
    </div>
  </div>
</template>
