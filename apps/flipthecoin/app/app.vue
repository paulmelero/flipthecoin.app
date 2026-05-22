<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const BASE = 'https://flipthecoin.app';
const TITLE = 'FlipTheCoin.app - Flip a Coin Online, Heads or Tails';

const { $t, $getLocale } = useI18n();
const route = useRoute();

const description = computed(() => $t('app.description'));
const ogImage = computed(() => `${BASE}/img/og/home-${$getLocale()}.png`);

// Dynamic URLs for canonical and hreflang
const currentPath = computed(() => route.path);
const isBlogPost = computed(() => /\/blog\/[^/]+/.test(currentPath.value));

const canonicalUrl = computed(() => `${BASE}${currentPath.value}`);

const enUrl = computed(() => {
  const path = currentPath.value;
  if (path === '/es') return `${BASE}/`;
  if (path.startsWith('/es/')) return `${BASE}${path.slice(3)}`;
  return `${BASE}${path}`;
});

const esUrl = computed(() => {
  const path = currentPath.value;
  if (path.startsWith('/es')) return `${BASE}${path}`;
  if (path === '/') return `${BASE}/es`;
  return `${BASE}/es${path}`;
});

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FlipTheCoin.app',
  url: BASE,
  logo: `${BASE}/icon-512.png`,
};

useHead({
  title: TITLE,
  titleTemplate: (title) => (title ? `${title} -- FlipTheCoin.app` : TITLE),
  meta: [
    { name: 'description', content: description.value as string },
    { property: 'og:title', content: TITLE },
    { property: 'og:description', content: description.value as string },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: ogImage },
    { property: 'og:url', content: canonicalUrl },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: TITLE },
    { name: 'twitter:description', content: description.value as string },
    { name: 'twitter:image', content: ogImage },
  ],
  link: computed(() => [
    { key: 'canonical', rel: 'canonical', href: canonicalUrl.value },
    // hreflang only for non-blog-post pages; blog/[post].vue sets correct pairs per post
    ...(isBlogPost.value
      ? []
      : [
          {
            key: 'hreflang-en',
            rel: 'alternate',
            hreflang: 'en',
            href: enUrl.value,
          },
          {
            key: 'hreflang-es',
            rel: 'alternate',
            hreflang: 'es',
            href: esUrl.value,
          },
          {
            key: 'hreflang-xdefault',
            rel: 'alternate',
            hreflang: 'x-default',
            href: enUrl.value,
          },
        ]),
  ]),
  script: [
    {
      key: 'org-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify(organizationSchema),
    },
  ],
});

useColorMode();
</script>
