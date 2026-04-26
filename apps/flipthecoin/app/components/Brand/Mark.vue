<script setup lang="ts">
import CoinMark from '@brand/favicon.svg?component';

withDefaults(
  defineProps<{
    size?: number | string;
    title?: string;
  }>(),
  {
    size: 32,
    title: 'Flip The Coin',
  },
);
</script>

<template>
  <CoinMark :width="size" :height="size" role="img" :aria-label="title" />
</template>
