<script setup lang="ts">
definePageMeta({
  layout: 'blogpost',
});

const route = useRoute();
const postFileName = route.params.post as string;

if (!postFileName) {
  throw createError('Post not found');
}

const { data: post } = await useAsyncData(postFileName, () => {
  return queryCollection('blog').path(postFileName).first();
});

useSeoMeta({
  title: post.value?.title,
  description: post.value?.description,
});
</script>

<template>
  <div v-if="post && post.body">
    <MDCRenderer :body="post.body" :data="post" />
  </div>
</template>
