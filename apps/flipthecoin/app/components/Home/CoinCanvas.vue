<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCoinNarrative } from '@flipthecoin/coin-engine';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const canvasRef = ref<HTMLCanvasElement | null>(null);

const {
  setup,
  dispose,
  setFlyTrajectoryProgress,
  setArcTrajectoryProgress,
  setIllumination,
  setIdle,
  setHeroPosition,
  setArcBounds,
  screenToWorld,
  isReady,
} = useCoinNarrative(canvasRef, { size: 'window' });

let flyTrigger: ScrollTrigger | null = null;
let arcTrigger: ScrollTrigger | null = null;

/** Find the hero coin frame element and align the 3D coin to its centre.
 * Uses document-relative coordinates (rect + scroll) so the result is
 * stable regardless of how far the page has been scrolled. */
const alignToHero = () => {
  const frame = document.getElementById('hero-coin-frame');
  if (!frame) return;
  const rect = frame.getBoundingClientRect();
  // Document-relative centre — constant regardless of scroll position.
  const cx = rect.left + window.scrollX + rect.width / 2;
  const cy = rect.top + window.scrollY + rect.height / 2;
  const world = screenToWorld(cx, cy);

  // The poster image is w-2/3 of the frame. Compute the world-space
  // radius that matches that pixel size, then scale the coin (base
  // radius 1) to match.
  const posterRadiusPx = (rect.width * (2 / 3)) / 2;
  const edgeWorld = screenToWorld(cx + posterRadiusPx, cy);
  const worldRadius = Math.abs(edgeWorld.x - world.x);
  const scale = worldRadius / 1;

  setHeroPosition(world, scale);
  // Re-derive arc endpoints: the inset depends on the hero scale that
  // was just set (coin radius at arc size).
  alignArcBounds();
};

/** Align the coin's fly/arc travel endpoints to the flip section's real
 * horizontal bounds (document-relative, scroll-stable), so the coin
 * enters/exits at the section card's edges even when the card is not
 * full-width. */
const alignArcBounds = () => {
  const section = document.getElementById('flip-the-unknown');
  if (!section) return;
  const rect = section.getBoundingClientRect();
  const cy = rect.top + window.scrollY + rect.height / 2;
  const leftDocX = rect.left + window.scrollX;
  const rightDocX = rect.left + window.scrollX + rect.width;
  setArcBounds(screenToWorld(leftDocX, cy).x, screenToWorld(rightDocX, cy).x);
};

/** Desktop-only coin motion. The section pin + CSS gradient live in the
 * parent (CoinNarrative) so they also work on mobile; this component only
 * drives the 3D coin (fly from hero + arc across the flip section). */
const setupScroll = () => {
  const section = document.getElementById('flip-the-unknown');
  const hero = document.getElementById('hero');
  if (!section || !hero) return;

  alignArcBounds();

  // Phase 1 — Fly: starts as soon as the hero scrolls away. The coin
  // follows a bezier curve from its hero position to the left (night) end.
  flyTrigger = ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      // Recalculate origin every scroll tick — if the user scrolled
      // before the coin was ready, the initial alignment was stale.
      alignToHero();
      setFlyTrajectoryProgress(self.progress);
    },
    onLeaveBack: () => {
      alignToHero();
      setIdle();
    },
    onRefresh: () => {
      alignArcBounds();
      alignToHero();
      setIdle();
    },
  });

  // Phase 2 — Arc: the coin's trajectory + illumination light. Pinning
  // and the CSS --illumination gradient are handled by the parent.
  arcTrigger = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=140%',
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      setArcTrajectoryProgress(self.progress);
      setIllumination(self.progress);
    },
    onLeaveBack: () => {
      alignToHero();
      setIdle();
    },
    onRefresh: () => {
      alignArcBounds();
      alignToHero();
    },
  });
};

watch(isReady, (ready) => {
  if (!ready) return;
  // Align after layout settles (fonts, header height, etc.)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      alignToHero();
      setIdle();
      document.documentElement.dataset.coinReady = 'true';
      requestAnimationFrame(() => requestAnimationFrame(setupScroll));
    });
  });
});

// Re-align on resize — the hero frame position shifts with viewport width.
const onResize = () => {
  if (isReady.value) {
    alignArcBounds();
    alignToHero();
    setIdle();
  }
};
if (typeof window !== 'undefined') {
  window.addEventListener('resize', onResize);
}

onMounted(() => {
  if (!canvasRef.value) return;
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  if (reduceMotion) return;

  try {
    setup();
  } catch (err) {
    console.error('[CoinCanvas] Three.js setup failed:', err);
  }

  // Re-align after fonts load (webfont swap shifts the hero layout).
  if (document.fonts) {
    document.fonts.ready.then(() => {
      if (isReady.value) {
        alignToHero();
        setIdle();
      }
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
  <canvas
    ref="canvasRef"
    class="block w-full h-full"
    style="background: transparent"
  />
</template>
