<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const TITLE = 'FlipTheCoin.app - Do you need a coin?';
const { $t, $getLocale } = useI18n();
const description = computed(() => $t('app.description'));
const ogImage = computed(
  () => `https://flipthecoin.app/img/og/home-${$getLocale()}.png`,
);

useHead({
  title: TITLE,
  titleTemplate: (title) => (title ? `${title} -- ${TITLE}` : TITLE),
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: TITLE },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: ogImage },
    { property: 'og:url', content: 'https://flipthecoin.app' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: TITLE },
    { name: 'twitter:description', content: description },
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
