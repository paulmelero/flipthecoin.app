<script setup lang="ts">
const slug = useRoute().params.page
const { data: page } = await useAsyncData(() => queryCollection('content').path(`/${slug}`).first())

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <div v-else>page not found</div>
</template>