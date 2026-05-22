<script setup lang="ts">
import type { CoinResult } from '@flipthecoin/coin-engine';

definePageMeta({ layout: 'play' });

const { $t } = useI18n();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isFlipping = ref(false);
const result = ref('');
const tossCount = ref(0);
const previousTossCount = ref(0);
const isIntersecting = ref(false);

const history = useFlipHistory();

const {
  setup,
  disposeSceneResources,
  flipCoin,
  isReady: sceneReady,
} = useThreeJsCoin(
  canvasRef,
  isFlipping,
  result,
  tossCount,
  previousTossCount,
  isIntersecting,
  {
    size: 'element',
    enableOrbitControls: true,
    onResult: (r: CoinResult) => {
      void history.record(r);
    },
  },
);

const loading = computed(() => !(sceneReady.value && history.isReady.value));

onMounted(async () => {
  await nextTick();
  setup();
  void history.load();
});

onBeforeUnmount(() => {
  disposeSceneResources();
});

useSeoMeta({
  title: () => $t('play.seoTitle') as string,
  description: () => $t('play.seoDescription') as string,
});

useHead({
  script: [
    {
      key: 'webapp-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Flip a Coin',
        url: 'https://flipthecoin.app/play',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description:
          'Free online 3D coin flipper. Get a fair heads or tails result instantly — powered by real physics simulation.',
      }),
    },
  ],
});
</script>

<template>
  <div
    class="grid grid-rows-[auto_auto] lg:grid-rows-[1fr_auto] gap-4 lg:gap-6 lg:min-h-[calc(100dvh-7rem)]"
  >
    <div
      class="relative rounded-3xl overflow-hidden border border-base-content/5 aspect-square lg:aspect-auto"
      :class="{
        'cursor-pointer': !isFlipping,
        'cursor-grab': isIntersecting && !isFlipping,
      }"
    >
      <ClientOnly>
        <canvas ref="canvasRef" class="w-full h-full block"></canvas>
      </ClientOnly>
    </div>

    <GameHistoryStrip
      :recent="history.recent.value"
      :stats="history.stats.value"
      :is-flipping="isFlipping"
      :result="result"
      @flip="flipCoin"
      @clear="history.clear"
    />

    <Transition name="fade">
      <GameLoadingScreen v-if="loading" />
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
