<script setup lang="ts">
const { data: page } = await useAsyncData(() => queryCollection('content').path('extension').first())

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <div v-else>page not found</div>
</template>