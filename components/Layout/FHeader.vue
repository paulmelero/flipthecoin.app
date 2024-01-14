import { _height } from '#tailwind-config/theme';
<template>
  <header class="py-5">
    <UContainer class="flex justify-between items-center">
      <nuxt-link to="/" class="flex items-center">
        <CoinsSpinning :size="20" />
        <span class="font-bold ml-1">Flip The Coin</span>
      </nuxt-link>
      <nav class="flex gap-2">
        <nuxt-link to="/">Home</nuxt-link>
        <nuxt-link to="/play">Play!</nuxt-link>
      </nav>
    </UContainer>
  </header>
</template>
