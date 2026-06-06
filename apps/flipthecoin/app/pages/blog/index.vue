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

const { data: authors } = await useAsyncData('blog-authors', () =>
  queryCollection('authors').all(),
);

const authorsBySlug = computed(() => {
  const map: Record<string, (typeof authors.value)[number]> = {};
  for (const a of authors.value ?? []) {
    const slug = String(a.stem ?? '')
      .split('/')
      .pop();
    if (slug) map[slug] = a;
  }
  return map;
});

const authorFor = (post: (typeof posts.value)[number]) => {
  const slug = (post.meta?.author as string | undefined) ?? 'paul-melero';
  return authorsBySlug.value[slug] ?? authors.value?.[0];
};

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
    <ul v-else class="flex flex-col gap-6 max-w-4xl mx-auto">
      <BlogPost
        v-for="post in posts"
        :key="post.path"
        :post="post"
        :author="authorFor(post)"
      />
    </ul>
  </section>
</template>

<style scoped></style>
