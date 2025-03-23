<script setup lang="ts">
const { data } = await useAsyncData('blogindex', () => {
  return queryCollection('blog').all();
});

const posts = computed(() => data.value?.filter((post) => post.meta.published));

useSeoMeta({
  title: 'Blog Posts',
  description:
    'Statistics curiosities, applied Mathematics, gaming ethics, and more. Stay tuned for the latest blog posts.',
});
</script>

<template>
  <div class="container mx-auto mb-16">
    <FTitle>Blog Posts</FTitle>

    <p>
      Statistics curiosities, applied Mathematics, gaming ethics, and more. Stay
      tuned for the latest blog posts.
    </p>
  </div>

  <section class="container mx-auto">
    <ul class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <BlogPost v-for="post in posts" :key="post.path" :post="post" />
    </ul>
  </section>
</template>

<style scoped></style>
