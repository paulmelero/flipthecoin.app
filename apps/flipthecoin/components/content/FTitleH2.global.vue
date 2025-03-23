<template>
  <FTitle as="h2" class="font-headings mb-[0.5em]" :id="props.id">
    <a v-if="props.id && generate" :href="`#${props.id}`" class="font-headings">
      <slot />
    </a>
    <slot v-else
  /></FTitle>
</template>

<script setup lang="ts">
const props = defineProps<{ id?: string }>();

const { headings } = useRuntimeConfig().public.mdc;
const generate = computed(
  () =>
    props.id &&
    ((typeof headings?.anchorLinks === 'boolean' &&
      headings?.anchorLinks === true) ||
      (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h2)),
);
</script>
