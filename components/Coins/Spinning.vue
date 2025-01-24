<template>
  coin
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: number;
  }>(),
  {
    size: 400,
  }
);

onMounted(() => {

})
</script>

<style scoped></style>