<template>
  <div class="relative">
    <div class="glow"></div>
    <div class="coin"></div>
  </div>
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

<style scoped>
.glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 5, 0.5) 0%, rgba(255, 255, 255, 0) 70%);
}

.coin {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0, #d0d0d0);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  animation: spin 1s infinite linear;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>