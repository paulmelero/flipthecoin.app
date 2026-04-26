<script setup lang="ts">
import { gsap } from 'gsap';

const { $t } = useI18n();
const logoRef = ref<HTMLDivElement | null>(null);

let tween: gsap.core.Tween | null = null;

onMounted(() => {
  if (!logoRef.value) return;
  tween = gsap.to(logoRef.value, {
    y: -10,
    duration: 0.7,
    repeat: -1,
    yoyo: true,
    ease: 'elastic.out(1, 0.4)',
  });
});

onBeforeUnmount(() => {
  tween?.kill();
  tween = null;
});
</script>

<template>
  <div
    class="fixed inset-0 z-50 grid place-items-center bg-base-200/85 backdrop-blur-md"
    role="status"
    aria-live="polite"
  >
    <div class="flex flex-col items-center gap-4">
      <div ref="logoRef" class="will-change-transform">
        <BrandMark :size="96" />
      </div>
      <p
        class="text-sm font-mono uppercase tracking-[0.2em] text-base-content/70"
      >
        {{ $t('play.loading') }}
      </p>
    </div>
  </div>
</template>
