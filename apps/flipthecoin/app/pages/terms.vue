<script setup lang="ts">
const { data: page } = await useAsyncData('terms', () => {
  return queryCollection('pages').path('/pages/terms-and-conditions').first();
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
  </div>
</template>
