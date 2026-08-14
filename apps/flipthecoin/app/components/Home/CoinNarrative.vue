<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCoinNarrative } from '@flipthecoin/coin-engine';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
const wrapRef = ref<HTMLElement | null>(null);

const {
  setup,
  dispose,
  setFlyProgress,
  setProgress,
  setIllumination,
  setIdle,
  setHeroPosition,
  screenToWorld,
  isReady,
} = useCoinNarrative(canvasRef, { size: 'window' });

let flyTrigger: ScrollTrigger | null = null;
let arcTrigger: ScrollTrigger | null = null;

/** Find the hero coin frame element and align the 3D coin to its centre. */
const alignToHero = () => {
  const frame = document.getElementById('hero-coin-frame');
  if (!frame) return;
  const rect = frame.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const world = screenToWorld(cx, cy);

  // The poster image is w-2/3 of the frame. Compute the world-space
  // radius that matches that pixel size, then scale the coin (base
  // radius 1) to match.
  const posterRadiusPx = (rect.width * (2 / 3)) / 2;
  const edgeWorld = screenToWorld(cx + posterRadiusPx, cy);
  const worldRadius = Math.abs(edgeWorld.x - world.x);
  const scale = worldRadius / 1;

  setHeroPosition(world, scale);
};

const setupScroll = () => {
  const section = document.getElementById('flip-the-unknown');
  const hero = document.getElementById('hero');
  if (!section || !hero) return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  if (reduceMotion || !isDesktop) return;

  // Phase 1 — Fly: starts as soon as the hero scrolls away. The coin
  // follows a bezier curve from its hero position to the left (night) end.
  flyTrigger = ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      setFlyProgress(self.progress);
    },
    onLeaveBack: () => {
      setIdle();
    },
    onRefresh: () => {
      alignToHero();
      setIdle();
    },
  });

  // Phase 2 — Arc: pin the flip section, coin arcs left→right with
  // one full revolution + illumination.
  arcTrigger = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=140%',
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      setProgress(self.progress);
      setIllumination(self.progress);
      section.style.setProperty('--illumination', String(self.progress));
    },
    onLeaveBack: () => {
      setIdle();
      section.style.setProperty('--illumination', '0');
    },
    onRefresh: () => {
      section.style.setProperty('--illumination', '0');
    },
  });
};

watch(isReady, (ready) => {
  if (!ready) return;
  // Align after layout settles (fonts, header height, etc.)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      alignToHero();
      document.documentElement.dataset.coinReady = 'true';
      requestAnimationFrame(() => requestAnimationFrame(setupScroll));
    });
  });
});

// Re-align on resize — the hero frame position shifts with viewport width.
const onResize = () => {
  if (isReady.value) alignToHero();
};
if (typeof window !== 'undefined') {
  window.addEventListener('resize', onResize);
}

onMounted(() => {
  if (!canvasRef.value) return;
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  if (reduceMotion || !isDesktop) return;

  try {
    setup();
  } catch (err) {
    console.error('[CoinNarrative] Three.js setup failed:', err);
  }

  // Re-align after fonts load (webfont swap shifts the hero layout).
  if (document.fonts) {
    document.fonts.ready.then(() => {
      if (isReady.value) alignToHero();
    });
  }
});

onBeforeUnmount(() => {
  if (flyTrigger) {
    flyTrigger.kill();
    flyTrigger = null;
  }
  if (arcTrigger) {
    arcTrigger.kill();
    arcTrigger = null;
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', onResize);
  }
  dispose();
  delete document.documentElement.dataset.coinReady;
});
</script>

<template>
  <div ref="wrapRef" class="relative">
    <div
      class="sticky top-0 h-[100dvh] z-0 pointer-events-none"
      style="background: transparent"
    >
      <canvas
        ref="canvasRef"
        class="block w-full h-full"
        style="background: transparent"
      />
    </div>
    <div class="relative z-10 -mt-[100dvh]">
      <slot />
    </div>
  </div>
</template>
