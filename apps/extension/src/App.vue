<template>
  <main class="flex flex-col w-[360px] h-[460px] bg-neutral-900 text-white">
    <div class="relative flex-1 overflow-hidden">
      <canvas
        ref="canvasRef"
        class="w-full h-full block"
        :class="{ 'cursor-pointer': !isFlipping }"
      ></canvas>
    </div>
    <div class="p-3 flex flex-col items-center gap-2 bg-neutral-950">
      <output
        class="text-sm text-neutral-300 min-h-[1.25rem]"
        aria-live="polite"
      >
        <template v-if="result"
          >Result: <strong>{{ result }}</strong></template
        >
      </output>
      <button
        class="w-full py-2 rounded-md bg-yellow-400 text-black font-semibold hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed transition"
        @click="flipCoin"
        :disabled="isFlipping"
      >
        {{ isFlipping ? 'Flipping…' : 'Flip the coin' }}
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useThreeJsCoin } from '@flipthecoin/coin-engine';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isFlipping = ref(false);
const result = ref('');
const tossCount = ref(0);
const previousTossCount = ref(0);
const isIntersecting = ref(false);

const { setup, disposeSceneResources, flipCoin } = useThreeJsCoin(
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
});

onBeforeUnmount(() => {
  disposeSceneResources();
});
</script>
