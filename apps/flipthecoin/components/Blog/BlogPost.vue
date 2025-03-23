<template>
  <LayoutFCard :key="post.path" :title="post.title" :subtitle="formattedDate">
    <template #actions>
      <nuxt-link class="btn" :to="post.path">Read More ➡️</nuxt-link>
    </template>
  </LayoutFCard>
</template>

<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

const props = defineProps<{
  post: BlogCollectionItem & { date?: string };
}>();

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const formattedDate = computed(() =>
  props.post.meta.date
    ? dateFormatter.format(new Date(props.post.meta.date as string))
    : '',
);
</script>
