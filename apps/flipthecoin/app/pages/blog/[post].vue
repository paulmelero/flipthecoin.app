<script setup lang="ts">
definePageMeta({
  layout: 'blogpost',
});

const route = useRoute();
const { $getLocale, $t } = useI18n();

const locale = computed(() => $getLocale());
const slug = computed(() => String(route.params.post ?? ''));

const { data: post } = await useAsyncData(
  () => `blog-post-${locale.value}-${slug.value}`,
  async () => {
    if (!slug.value) return null;
    return queryCollection('blog')
      .where('slug', '=', slug.value)
      .where('_locale', '=', locale.value)
      .first();
  },
  { watch: [slug, locale] },
);

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description,
});
</script>

<template>
  <div class="mb-16" v-if="post && post.body">
    <ContentRenderer :value="post" />
  </div>
  <div class="mb-16" v-else>
    <p>{{ $t('blog.notFound') }}</p>
  </div>

  <div class="mb-16">
    <BlogGoToBlogCTA />
  </div>
</template>
