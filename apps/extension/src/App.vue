<template>
  <main class="flex flex-col w-[380px] h-[560px] bg-base-100 text-base-content">
    <PopupHeader />

    <div class="relative h-[260px] overflow-hidden bg-base-200/30">
      <canvas
        ref="canvasRef"
        class="w-full h-full block"
        :class="{ 'cursor-pointer': !isFlipping }"
      ></canvas>
    </div>

    <div
      class="px-3 py-2 flex items-center gap-2 border-t border-base-content/10"
    >
      <output class="text-sm flex-1 min-w-0" aria-live="polite">
        <template v-if="result">
          <span class="text-base-content/60">Result:</span>
          <strong class="ml-1 text-primary">{{ result }}</strong>
        </template>
        <template v-else>
          <span class="text-base-content/40 text-xs">Press flip to begin</span>
        </template>
      </output>
      <button
        class="btn btn-primary btn-sm"
        @click="flipCoin"
        :disabled="isFlipping"
      >
        <span
          v-if="isFlipping"
          class="loading loading-spinner loading-xs"
        ></span>
        {{ isFlipping ? 'Flipping…' : 'Flip' }}
      </button>
    </div>

    <FlipHistory :entries="history" @clear="clear" />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useThreeJsCoin } from '@flipthecoin/coin-engine';
import PopupHeader from './components/PopupHeader.vue';
import FlipHistory from './components/FlipHistory.vue';
import { useFlipHistory } from './composables/useFlipHistory';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isFlipping = ref(false);
const result = ref('');
const tossCount = ref(0);
const previousTossCount = ref(0);
const isIntersecting = ref(false);

const { history, push, clear } = useFlipHistory();

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
    onResult: (r) => push(r),
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
