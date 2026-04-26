<script setup lang="ts">
const { $t, localePath } = useI18n();
</script>

<template>
  <FTitle as="h2">{{ $t('blog.ctaTitle') }}</FTitle>
  <p>{{ $t('blog.ctaLead') }}</p>
  <p>
    <NuxtLink :to="localePath('/blog')" class="btn btn-primary">{{
      $t('blog.ctaButton')
    }}</NuxtLink>
  </p>
</template>
