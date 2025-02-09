<template>
  <component
    :is="as"
    class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8"
    :class="{ 'rounded-3xl': rounded }"
    ><slot
  /></component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string;
    rounded?: boolean;
  }>(),
  {
    as: 'section',
    rounded: true,
  }
);
</script>
