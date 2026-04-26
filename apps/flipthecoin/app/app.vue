<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const TITLE = 'FlipTheCoin.app - Do you need a coin?';
const DESCRIPTION =
  "The place where coins fairly flip. What is random? What is your fate? Please don't let a coin decide it.";
const { $getLocale } = useI18n();
const ogImage = computed(
  () => `https://flipthecoin.app/img/og/home-${$getLocale()}.png`,
);

useHead({
  title: TITLE,
  titleTemplate: (title) => (title ? `${title} -- ${TITLE}` : TITLE),
  meta: [
    { name: 'description', content: DESCRIPTION },
    { property: 'og:title', content: TITLE },
    { property: 'og:description', content: DESCRIPTION },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: ogImage },
    { property: 'og:url', content: 'https://flipthecoin.app' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: TITLE },
    { name: 'twitter:description', content: DESCRIPTION },
    { name: 'twitter:image', content: ogImage },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://flipthecoin.app',
    },
  ],
});

useColorMode();
</script>
