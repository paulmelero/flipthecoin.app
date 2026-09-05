<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** The 3D coin canvas is desktop-only. LazyHomeCoinCanvas is an async
 * component, so its chunk (coin-engine + three.js coin code + textures)
 * is never fetched on mobile. */
const showCanvas = ref(false);

let arcTrigger: ScrollTrigger | null = null;

/** Section pin (scroll hijack) + background gradient. The pin runs on
 * desktop AND mobile — the section must stay in view while the stars
 * rotate and the --illumination sunrise gradient scrubs. What mobile
 * skips is only the 3D coin motion, which lives in CoinCanvas
 * (desktop-only, lazily loaded). */
const setupScroll = () => {
  const section = document.getElementById('flip-the-unknown');
  if (!section) return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  if (reduceMotion) return;

  arcTrigger = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=140%',
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      section.style.setProperty('--illumination', String(self.progress));
    },
    onLeaveBack: () => {
      section.style.setProperty('--illumination', '0');
    },
    onRefresh: () => {
      section.style.setProperty('--illumination', '0');
    },
  });
};

onMounted(() => {
  showCanvas.value =
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(min-width: 768px)').matches;
  // Wait two frames so the pinned layout is settled before measuring.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => requestAnimationFrame(setupScroll)),
  );
});

onBeforeUnmount(() => {
  if (arcTrigger) {
    arcTrigger.kill();
    arcTrigger = null;
  }
});
</script>

<template>
  <div class="relative">
    <!-- Coin: sticky canvas, below content. Desktop only, lazily loaded
         so mobile never downloads the 3D coin engine chunk. -->
    <div
      class="sticky top-0 h-[100dvh] z-[1] pointer-events-none"
      style="background: transparent"
    >
      <LazyHomeCoinCanvas v-if="showCanvas" />
    </div>
    <div class="relative z-10 -mt-[100dvh]">
      <slot />
    </div>
  </div>
</template>
