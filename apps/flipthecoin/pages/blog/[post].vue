<script setup lang="ts">
import type { MDCParserResult } from '@nuxtjs/mdc';

definePageMeta({
  layout: 'blogpost',
});

const route = useRoute();
const postFileName = route.params.post as string;

if (!postFileName) {
  throw createError('Post not found');
}

const { data: post } = (await useContent(postFileName)) as {
  data: Ref<Partial<MDCParserResult>>;
};

useSeoMeta({
  title: post.value.data?.title,
  description: post.value?.data?.description,
});
</script>

<template>
  <div v-if="post && post.body">
    <MDCRenderer :body="post.body" :data="post.data" />
  </div>
</template>
