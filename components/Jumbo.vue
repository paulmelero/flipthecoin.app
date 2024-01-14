<template>
  <UContainer
    :as="as"
    :ui="{
      constrained: '',
      padding: 'px-4 sm:px-6 lg:px-8 py-4 sm:py-8',
    }"
    ><slot
  /></UContainer>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string;
  }>(),
  {
    as: 'section',
  }
);
</script>
