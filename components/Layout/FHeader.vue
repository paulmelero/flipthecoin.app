import { _height } from '#tailwind-config/theme';
<template>
  <header class="py-5">
    <UContainer class="flex justify-between items-center">
      <nuxt-link to="/" class="flex items-center">
        <Logo />
      </nuxt-link>
      <nav class="flex gap-2">
        <nuxt-link to="/">Home</nuxt-link>
      </nav>
    </UContainer>
  </header>
</template>
