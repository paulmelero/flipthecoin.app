<script setup lang="ts">
const { $t, localePath } = useI18n();

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

<template>
  <section class="relative isolate overflow-hidden bg-base-200/60 rounded-2xl">
    <HomeHeroMathBackdrop class="text-base-content" />

    <div
      class="container mx-auto px-4 lg:px-8 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10"
    >
      <div class="lg:col-span-7 order-2 lg:order-1">
        <p
          class="inline-flex items-center gap-2 text-sm font-mono text-base-content/60 mb-4"
        >
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
          flipthecoin.app
        </p>
        <FTitle class="!mb-4">{{ $t('hero.title') }}</FTitle>
        <p class="text-lg lg:text-xl text-base-content/80 mb-8 max-w-2xl">
          {{ $t('hero.lead') }}
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <button
            class="btn btn-primary btn-lg"
            @click="flipCoin"
            :disabled="isFlipping"
          >
            <span v-if="isFlipping" class="loading loading-spinner"></span>
            <span>
              {{ isFlipping ? $t('hero.flipping') : $t('hero.cta') }}
            </span>
          </button>
          <NuxtLink :to="localePath('/blog')" class="btn btn-ghost btn-lg">
            {{ $t('hero.secondaryCta') }}
          </NuxtLink>
        </div>
        <output class="mt-3 sr-only" v-if="result">
          {{ $t('hero.result', { result }) }}
        </output>
      </div>

      <div class="lg:col-span-5 order-1 lg:order-2">
        <div
          class="relative w-full max-w-[460px] aspect-square mx-auto"
          :class="{
            'cursor-pointer': !isFlipping,
            'cursor-grab': isIntersecting && !isFlipping,
          }"
        >
          <ClientOnly>
            <canvas ref="canvasRef" class="w-full h-full block"></canvas>
          </ClientOnly>
        </div>
      </div>
    </div>
  </section>
</template>
