<script setup lang="ts">
const { data: page } = await useAsyncData('extension', () => {
  return queryCollection('pages').path('/pages/extension').first();
});

definePageMeta({
  layout: 'blogpost',
});

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
});
</script>

<template>
  <div class="prose dark:prose-invert">
    <ContentRenderer v-if="page" :value="page" />
    <div class="divider" />
    <NewsletterForm />
  </div>
</template>
