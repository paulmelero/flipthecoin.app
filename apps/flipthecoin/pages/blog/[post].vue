<script setup lang="ts">
definePageMeta({
  layout: 'blogpost',
});

const route = useRoute();

const { data: post } = await useAsyncData(route.path, async () => {
  const res = await queryCollection('blog').path(route.path).first();

  console.log({ res });

  return res;
});

useSeoMeta({
  title: post.value?.title,
  description: post.value?.description,
});
</script>

<template>
  <div v-if="post && post.body">
    <ContentRenderer :value="post" />
  </div>
</template>
