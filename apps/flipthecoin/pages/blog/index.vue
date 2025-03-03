<script setup lang="ts">
const { data } = await useAsyncData('blogindex', () => {
  return queryCollection('blog').all();
});
</script>

<template>
  <ContentFJumbo>
    <ContentFTitle>Blog Posts</ContentFTitle>
    <ul>
      <li v-for="post in data" :key="post.path">
        <nuxt-link :to="post.path">{{ post.title }}</nuxt-link>
      </li>
    </ul>
  </ContentFJumbo>
</template>

<style scoped></style>
