<script setup lang="ts">
import type { CoinPose } from '@flipthecoin/coin-engine';

definePageMeta({ layout: false });

const route = useRoute();

const pose = computed<CoinPose>(() => {
  const v = String(route.query.pose ?? 'heads');
  if (v === 'heads' || v === 'tails' || v === 'edge' || v === 'mid') return v;
  return 'heads';
});

const sizePx = computed(() => {
  const v = Number(route.query.size ?? 1024);
  return Number.isFinite(v) && v > 0 ? Math.min(v, 2048) : 1024;
});

const bg = computed(() => String(route.query.bg ?? 'transparent'));

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isFlipping = ref(false);
const result = ref('');
const tossCount = ref(0);
const previousTossCount = ref(0);
const isIntersecting = ref(false);
const ready = ref(false);

const { setup, disposeSceneResources, setPose, setPaused, captureFrame } =
  useThreeJsCoin(
    canvasRef,
    isFlipping,
    result,
    tossCount,
    previousTossCount,
    isIntersecting,
    {
      size: 'element',
      enableOrbitControls: false,
    },
  );

onMounted(async () => {
  await nextTick();
  setup();
  // Allow font + textures + first paint to settle
  await new Promise((r) => setTimeout(r, 800));
  setPose(pose.value);
  setPaused(true);
  await nextTick();
  await new Promise((r) => setTimeout(r, 200));
  ready.value = true;
});

onBeforeUnmount(() => {
  disposeSceneResources();
});

const downloadFrame = async () => {
  const blob = await captureFrame();
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `coin-${pose.value}-${sizePx.value}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

if (typeof window !== 'undefined') {
  // Expose for Playwright driver
  (window as unknown as { __capture: () => Promise<Blob | null> }).__capture =
    () => captureFrame();
  (window as unknown as { __captureReady: () => boolean }).__captureReady =
    () => ready.value;
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center p-0 m-0"
    :class="bg === 'theme' ? 'bg-base-100' : 'bg-transparent'"
  >
    <div
      class="relative"
      :style="{ width: `${sizePx}px`, height: `${sizePx}px` }"
    >
      <canvas ref="canvasRef" class="block w-full h-full" />
    </div>
    <button
      v-if="ready"
      class="fixed top-4 right-4 px-3 py-1.5 rounded bg-black text-white text-xs"
      @click="downloadFrame"
    >
      Download {{ pose }} @ {{ sizePx }}px
    </button>
  </div>
</template>
