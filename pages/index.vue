<template>
  <Jumbo class="bg-yellow-500 text-black min-h-[100dvh] relative overflow-hidden">
    <div class="self-center">
      <canvas ref="canvasRef" class="w-screen h-[80dvh] mt-0 absolute top-0 left-0" :class="{
        'cursor-pointer': !isFlipping,
        'cursor-grab': isIntersecting && !isFlipping,
      }"></canvas>
      <div class="isolate z-10">
        <PrimitivesFTitle>"Flip The Coin", the online game</PrimitivesFTitle>
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
  </Jumbo>
  <Jumbo class="min-h-[400px] prose dark:prose-invert">
    <PrimitivesFTitle as="h2">Simply –flip the coin</PrimitivesFTitle>
    <p>
      The game of uncertainty: Tossing a coin gives us roughly 50% chance of it
      landing heads and 50% chance landing tails, but until the coin lands we
      don't know what it will be!
    </p>
    <p>
      Interestingly, real-world coin flips aren't always perfectly fair. Studies have shown that a coin has about a 51%
      chance of landing on the same face it started on. Factors like air resistance, the coin's weight distribution, and
      even the mechanical motion of flipping can affect the outcome. For instance, a <a
        href="https://drive.google.com/file/d/13EB5xfJV1wpdELI1i7jFOY-qNndB9uFz/view" target="_blank">2007 study by
        mathematician Persi
        Diaconis</a> found the chances on landing the same face was 51% for natural coin tosses.
    </p>
    <p>
      Theorically, a coin is fair and the outcome is random. But in practice, it's not.
    </p>
    <p>
      Each coin toss is an independent "event" and the outcome of the previous
      toss does not affect the probability of the next toss. But, as we described,
      the real-world coin toss is not as fair as we'd like.
    </p>
    <p>In flipthecoin.app, we try to make the coin toss as fair as possible
      by introducing a component of randomness so it's non-deterministic. The game
      cannot be rigged as easily.
    </p>
    <p>
      Want to know more about the science of coin flips? Stay tuned for more
      articles and resources. Sign up for our newsletter to get notified when we
      launch.
    </p>

    <NewsletterForm />
  </Jumbo>
  <Jumbo class="flex justify-between items-center gap-4 min-h-[400px]">
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
  </Jumbo>
  <!-- <Jumbo class="min-h-[400px]">
    <PrimitivesFTitle as="h2">How to play?</PrimitivesFTitle>
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
  </Jumbo> -->
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
</script>
