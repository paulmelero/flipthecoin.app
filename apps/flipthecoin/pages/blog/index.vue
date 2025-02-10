<script setup lang="ts">
const { data } = await useContentList();
</script>

<template>
  <ContentFJumbo>
    <ContentFTitle>Blog Posts</ContentFTitle>
    <ul>
      <li v-for="post in data?.posts" :key="post.fileName">
        <nuxt-link
          :to="{
            name: 'blog-post',
            params: { post: post.fileName },
          }"
          >{{ post.title }}</nuxt-link
        >
      </li>
    </ul>
  </ContentFJumbo>
</template>

<style scoped></style>
