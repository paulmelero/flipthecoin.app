<script setup lang="ts">
const { $t, $getLocale } = useI18n();
const locale = computed(() => $getLocale());

const { data } = await useAsyncData(
  () => `blogindex-${locale.value}`,
  () =>
    queryCollection('blog')
      .where('_locale', '=', locale.value)
      .order('date', 'DESC')
      .all(),
  { watch: [locale] },
);

const posts = computed(() =>
  data.value?.filter((post) => post.meta.published !== false),
);

useSeoMeta({
  title: () => String($t('blog.seoTitle')),
  description: () => String($t('blog.seoDescription')),
});
</script>

<template>
  <div class="container mx-auto mb-16">
    <FTitle>{{ $t('blog.title') }}</FTitle>

    <p>{{ $t('blog.subtitle') }}</p>
  </div>

  <section class="container mx-auto">
    <p v-if="!posts || posts.length === 0">{{ $t('blog.empty') }}</p>
    <ul v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <BlogPost v-for="post in posts" :key="post.path" :post="post" />
    </ul>
  </section>
</template>

<style scoped></style>
