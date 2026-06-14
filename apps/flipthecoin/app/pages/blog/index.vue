<script setup lang="ts">
import type {
  AuthorsCollectionItem,
  BlogCollectionItem,
  SeriesCollectionItem,
} from '@nuxt/content';

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

const { data: series } = await useAsyncData(
  () => `blog-series-${locale.value}`,
  () => queryCollection('series').where('_locale', '=', locale.value).all(),
  { watch: [locale] },
);

const seriesBySlug = computed(() => {
  const map: Record<string, SeriesCollectionItem> = {};
  for (const s of series.value ?? []) {
    if (s.slug) map[s.slug] = s;
  }
  return map;
});

const items = computed(() => useGroupedPosts(posts.value, seriesBySlug.value));

const { data: authors } = await useAsyncData('blog-authors', () =>
  queryCollection('authors').all(),
);

const authorsBySlug = computed(() => {
  const map: Record<string, AuthorsCollectionItem> = {};
  for (const a of authors.value ?? []) {
    const slug = String(a.stem ?? '')
      .split('/')
      .pop();
    if (slug) map[slug] = a;
  }
  return map;
});

const authorFor = (post: BlogCollectionItem) => {
  const slug = (post.meta?.author as string | undefined) ?? 'paul-melero';
  return authorsBySlug.value[slug] ?? authors.value?.[0];
};

useSeoMeta({
  title: () => String($t('blog.seoTitle')),
  description: () => String($t('blog.seoDescription')),
});
</script>

<template>
  <div class="container mx-auto mb-16 max-w-4xl">
    <FTitle>{{ $t('blog.title') }}</FTitle>

    <p>{{ $t('blog.subtitle') }}</p>
  </div>

  <section class="container mx-auto">
    <p v-if="!posts || posts.length === 0">{{ $t('blog.empty') }}</p>
    <div v-else class="flex flex-col gap-10 max-w-4xl mx-auto">
      <template
        v-for="(item, index) in items"
        :key="item.type === 'series' ? `series-${item.slug}` : item.post.path"
      >
        <hr
          v-if="item.type === 'series' && index !== 0"
          class="border-base-content/10 mt-16"
        />
        <BlogSeriesBlock
          v-if="item.type === 'series'"
          :series="item.meta"
          :slug="item.slug"
          :members="item.members"
          :author-for="authorFor"
        />
        <template v-else>
          <hr
            v-if="index !== 0 && items[index - 1]?.type === 'series'"
            class="border-base-content/10 mt-16"
          />
          <BlogPost :post="item.post" :author="authorFor(item.post)" />
        </template>
      </template>
    </div>
  </section>
</template>

<style scoped></style>
