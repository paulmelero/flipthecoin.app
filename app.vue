<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'Flip The Coin - The Online Coin Flip Game',
  meta: [
    { name: 'description', content: 'A fair and random online coin flip game with 3D animation. Perfect for making decisions or just having fun!' },
    { property: 'og:title', content: 'Flip The Coin - The Online Coin Flip Game' },
    { property: 'og:description', content: 'A fair and random online coin flip game with 3D animation' },
    // TODO
    // { property: 'og:image', content: '/img/social-preview.jpg' },
    // { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>
