<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCoinNarrative } from '@flipthecoin/coin-engine';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasWrapRef = ref<HTMLDivElement | null>(null);

const reduceMotion = ref(false);
const isDesktop = ref(false);
const didSetup = ref(false);

const FLY_END = 0.15;

const mapTimeline = (scrollP: number) => {
  if (scrollP < FLY_END) {
    return { leg: 'fly' as const, p: scrollP / FLY_END };
  }
  return { leg: 'travel' as const, p: (scrollP - FLY_END) / (1 - FLY_END) };
};

const {
  setup,
  dispose,
  setFlyProgress,
  setProgress,
  setIllumination,
  setIdle,
  isReady,
} = useCoinNarrative(canvasRef, { size: 'window' });

let scrollTrigger: ScrollTrigger | null = null;

const setupScroll = () => {
  if (reduceMotion.value || !isDesktop.value) return;
  const section = document.getElementById('flip-the-unknown');
  if (!section) return;

  scrollTrigger = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=140%',
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
      const { leg, p } = mapTimeline(self.progress);
      if (leg === 'fly') {
        setFlyProgress(p);
        setIllumination(0);
      } else {
        setProgress(p);
        setIllumination(p);
      }
      section.style.setProperty('--illumination', String(p));
    },
    onLeave: () => {
      if (canvasWrapRef.value) canvasWrapRef.value.style.opacity = '0';
    },
    onEnterBack: () => {
      if (canvasWrapRef.value) canvasWrapRef.value.style.opacity = '1';
    },
    onLeaveBack: () => {
      setIdle();
      section.style.setProperty('--illumination', '0');
      if (canvasWrapRef.value) canvasWrapRef.value.style.opacity = '1';
    },
    onRefresh: () => {
      setIdle();
      section.style.setProperty('--illumination', '0');
    },
  });
};

// The canvas lives inside <ClientOnly>, so the <canvas> element is not in the
// DOM during onMounted — it appears a tick later. Boot the scene only once
// the ref is actually populated.
const trySetup = () => {
  if (didSetup.value || !canvasRef.value) return;
  if (reduceMotion.value || !isDesktop.value) return;
  didSetup.value = true;
  setup();
};

watch(canvasRef, () => {
  nextTick(trySetup);
});

watch(
  isReady,
  (ready) => {
    if (!ready) return;
    if (canvasWrapRef.value) canvasWrapRef.value.style.opacity = '1';
    document.documentElement.dataset.coinReady = 'true';
    setTimeout(setupScroll, 400);
  },
  { immediate: false },
);

onMounted(() => {
  reduceMotion.value = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  isDesktop.value = window.matchMedia('(min-width: 768px)').matches;
  nextTick(trySetup);
});

onBeforeUnmount(() => {
  if (scrollTrigger) {
    scrollTrigger.kill();
    scrollTrigger = null;
  }
  dispose();
  delete document.documentElement.dataset.coinReady;
});
</script>

<template>
  <ClientOnly>
    <div
      ref="canvasWrapRef"
      class="coin-canvas-wrap fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style="background: transparent"
    >
      <canvas
        ref="canvasRef"
        class="block w-full h-full"
        style="background: transparent"
      />
    </div>
    <template #fallback>
      <span class="hidden" />
    </template>
  </ClientOnly>
</template>

<style scoped>
.coin-canvas-wrap {
  opacity: 0;
  transition: opacity 0.8s ease;
  background: transparent;
}
.coin-canvas-wrap canvas {
  background: transparent;
}
</style>
