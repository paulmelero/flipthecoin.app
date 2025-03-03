<script setup lang="ts">
const { data: page } = await useContent('extension');

definePageMeta({
  layout: 'blogpost',
});

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
});
</script>

<template>
  <MDCRenderer :body="page?.body" :data="page?.data" />
</template>
