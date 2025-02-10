<template>
  <component
    :id="props.id"
    :is="as"
    :class="classes"
    class="font-headings font-[500] mb-[0.5em]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ as?: string; id?: string }>(), {
  as: 'h1',
  id: '',
});

const classes = computed(() => {
  const size =
    props.as === 'h1'
      ? 'md:text-3xl text-2xl'
      : props.as === 'h2'
      ? 'md:text-2xl text-xl'
      : '';

  return [size];
});

const { headings } = useRuntimeConfig().public.mdc;
const generate = computed(
  () =>
    props.id &&
    ((typeof headings?.anchorLinks === 'boolean' &&
      headings?.anchorLinks === true) ||
      (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h1))
);
</script>
