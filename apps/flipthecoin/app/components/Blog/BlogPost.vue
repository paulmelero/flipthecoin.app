<template>
  <LayoutFCard :key="post.path" :title="post.title" :subtitle="formattedDate">
    <template #actions>
      <nuxt-link class="btn" :to="postPath">{{
        $t('blog.readMore')
      }}</nuxt-link>
    </template>
  </LayoutFCard>
</template>

<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

const props = defineProps<{
  post: BlogCollectionItem & { date?: string; slug?: string };
}>();

const { $t, $getLocale, localePath } = useI18n();

const localeToBcp = { en: 'en-US', es: 'es-ES' } as const;

const formattedDate = computed(() => {
  const raw = props.post.meta.date as string | undefined;
  if (!raw) return '';
  const bcp = localeToBcp[$getLocale() as keyof typeof localeToBcp] ?? 'en-US';
  return new Intl.DateTimeFormat(bcp, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(raw));
});

const postPath = computed(() => {
  const slug = (props.post.meta.slug ?? props.post.slug) as string | undefined;
  if (slug) return localePath(`/blog/${slug}`);
  return props.post.path;
});
</script>
