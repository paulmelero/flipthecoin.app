<template>
  <article class="card bg-primary text-primary-content">
    <figure v-if="img">
      <img :src="img.src" :alt="img.alt" />
    </figure>
    <div class="card-body justify-between">
      <h2 class="card-title">{{ title }}</h2>
      <p v-if="subtitle" class="text-opacity-80 text-sm">{{ subtitle }}</p>
      <slot />
      <div class="card-actions justify-end">
        <slot name="actions" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  img?: {
    src: string;
    alt: string;
  };
  title: string;
  subtitle?: string;
}>();

defineSlots<{
  default: any;
  actions: any;
}>();
</script>
