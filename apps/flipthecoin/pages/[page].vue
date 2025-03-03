<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData(() =>
  queryCollection('pages').path(`/pages${route.path}`).first(),
);

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
});
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <div v-else>page not found</div>
</template>
