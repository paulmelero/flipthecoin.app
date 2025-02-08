<template>
  <component :is="as" :class="classes" class="font-serif font-light mb-[0.5em]"
    ><slot
  /></component>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ as?: string }>(), { as: 'h1' });

const classes = computed(() => {
  const size =
    props.as === 'h1' ? 'text-3xl' : props.as === 'h2' ? 'text-2xl' : '';

  return [size];
});
</script>
