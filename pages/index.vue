<template>
  <FJumbo class="bg-yellow-500 text-black min-h-[100dvh] relative overflow-hidden">
    <div class="self-center">
      <canvas ref="canvasRef" class="w-screen h-[80dvh] mt-0 absolute top-0 left-0" :class="{
        'cursor-pointer': !isFlipping,
        'cursor-grab': isIntersecting && !isFlipping,
      }"></canvas>
      <div class="isolate z-10">
        <FTitle>"Flip The Coin", the online game</FTitle>
        <p class="mb-3">
          Have you ever let fate decide for you? You certainly shouldn't!
        </p>
        <UButton color="white" @click="flipCoin" :disabled="isFlipping" size="xl">
          {{ isFlipping ? 'Flipping...' : 'Flip the coin' }}
        </UButton>
        <!-- Keep text for accessibility -->
        <output class="mt-3 sr-only" v-if="result">Result: {{ result }}</output>
      </div>

    </div>
  </FJumbo>
  <FJumbo class="min-h-[400px] prose dark:prose-invert">
    <ContentRenderer v-if="home" :value="home" />
    <FTitle as="h2"></FTitle>


    <NewsletterForm />
  </FJumbo>
  <FJumbo class="flex justify-between items-center gap-4 min-h-[400px]">
    <svg class="w-10 h-10 mb-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
      fill="currentColor" viewBox="0 0 18 14">
      <path
        d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
    </svg>
    <blockquote>
      <em>"You are what you are today because of the choices you made yesterday,
        and the choices you make today will make you what you are tomorrow."</em>
      — Michael Josephson
    </blockquote>
  </FJumbo>
  <!-- <FJumbo class="min-h-[400px]">
    <FTitle as="h2">How to play?</FTitle>
    <p>
      The game is simple: you flip a coin and complete the challenge. If you
      don't like the challenge, you can skip it and flip the coin again.
    </p>
    <p>
      The game is played in turns. Each turn consists of flipping a coin and
      completing the challenge. If you don't like the challenge, you can skip it
      and flip the coin again.
    </p>
    <p>
      The game ends when you complete all the challenges or when you give up.
    </p>
  </FJumbo> -->
</template>

<script setup lang="ts">
import { useThreeJsCoin } from '~/composables/useThreeJsCoin';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isFlipping = ref(false);
const result = ref('');
const tossCount = ref(0);
const previousTossCount = ref(0);
const isIntersecting = ref(false);

const { setup, cleanup, flipCoin } = useThreeJsCoin(
  canvasRef,
  isFlipping,
  result,
  tossCount,
  previousTossCount,
  isIntersecting
);

onMounted(() => {
  setup();
});

onUnmounted(() => {
  cleanup();
});

// Content
const { data: home } = await useAsyncData(() => queryCollection('content').path('/').first())


useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
})
</script>
