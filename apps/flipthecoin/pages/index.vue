<template>
  <FJumbo
    class="yellow-gradient text-black min-h-[80dvh] relative overflow-hidden"
    rounded
  >
    <div class="self-center">
      <ClientOnly>
        <canvas
          ref="canvasRef"
          class="w-screen h-[80dvh] mt-0 absolute top-0 left-0"
          :class="{
            'cursor-pointer': !isFlipping,
            'cursor-grab': isIntersecting && !isFlipping,
          }"
        ></canvas>
      </ClientOnly>
      <div class="isolate z-10">
        <FTitle>"Flip The Coin", the online game</FTitle>
        <p class="mb-3">
          Have you ever let fate decide for you? You certainly shouldn't!
        </p>
        <button
          class="btn btn-neutral btn-lg"
          @click="flipCoin"
          :disabled="isFlipping"
        >
          <span v-if="isFlipping" class="loading loading-spinner"></span>
          <span>
            {{ isFlipping ? 'Flipping...' : 'Flip the coin' }}
          </span>
        </button>
        <!-- Keep text for accessibility -->
        <output class="mt-3 sr-only" v-if="result">Result: {{ result }}</output>
      </div>
    </div>
  </FJumbo>
  <FJumbo class="prose dark:prose-invert">
    <ContentRenderer v-if="home" :value="home" />
  </FJumbo>
  <FJumbo class="flex flex-col items-center gap-4">
    <FTitle as="h2">Did you enjoy this story?</FTitle>
    <p>Visit the Blog</p>
    <p>
      <NuxtLink href="/blog" class="btn btn-primary"
        >Read more stories about coin tosses</NuxtLink
      >
    </p>
  </FJumbo>
  <div class="divider" />
  <FJumbo class="min-h-[400px]">
    <NewsletterForm />
  </FJumbo>
</template>

<script setup lang="ts">
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
);

onMounted(async () => {
  await nextTick(); // needed for the canvas to be defined
  setup();
});

onBeforeUnmount(() => {
  disposeSceneResources();
});

// Content
const { data: home } = await useAsyncData('home', () => {
  return queryCollection('pages').path('/pages/').first();
});

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
});
</script>

<style scoped>
.yellow-gradient {
  background-color: #ffc303ff;
  background-image:
    radial-gradient(49% 81% at 45% 27%, #fcc006ff 0%, #073aff00 100%),
    radial-gradient(142% 91% at 83% 7%, #ffc303ff 1%, #ff000000 99%),
    radial-gradient(142% 91% at -6% 74%, #ffab00ff 1%, #ff000000 99%),
    radial-gradient(142% 91% at 111% 84%, #ff7000ff 0%, #fff590ff 100%);
}
</style>
