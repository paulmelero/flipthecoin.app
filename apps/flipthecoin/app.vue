<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { link } from 'fs';

const TITLE = 'FlipTheCoin.app - Do you need a coin?';
const DESCRIPTION =
  "The place where coins fairly flip. What is random? What is your fait? Please don't leave a coin decide it.";
useHead({
  title: TITLE,
  titleTemplate: (title) => (title ? `${title} -- ${TITLE}` : TITLE),
  meta: [
    { name: 'description', content: DESCRIPTION },
    { property: 'og:title', content: TITLE },
    { property: 'og:description', content: DESCRIPTION },
    // TODO
    // { property: 'og:image', content: '/img/social-preview.jpg' },
    // { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://flipthecoin.app',
    },
  ],
});

const colorMode = useColorMode();
</script>
