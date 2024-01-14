<template>
  <Jumbo class="bg-yellow-500 text-black min-h-[400px]">
    <div class="self-center">
      <PrimitivesFTitle>"Flip The Coin", the online game</PrimitivesFTitle>
      <p class="mb-3">
        Have you ever let fate decide for you? You certainly shouldn't!
      </p>
      <UButton color="white" to="/play" size="md">Play!</UButton>
    </div>
  </Jumbo>
  <Jumbo class="min-h-[400px]">
    <PrimitivesFTitle as="h2"
      >The game to flip coins and complete challenges.</PrimitivesFTitle
    >
    <p>
      The game of uncertainty: Tossing a coin gives us a 50% chance of it
      landing heads and 50% chance landing tails, but until the coin lands we
      don't know what it will be!
    </p>
    <p>
      Each coin toss is an independent "event" and the outcome of the previous
      toss does not affect the probability of the next toss.
    </p>
  </Jumbo>
  <Jumbo class="flex justify-between items-center gap-4 min-h-[400px]">
    <svg
      class="w-10 h-10 mb-3 text-gray-200 dark:text-gray-700"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 18 14"
    >
      <path
        d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"
      />
    </svg>
    <blockquote>
      <em
        >"You are what you are today because of the choices you made yesterday,
        and the choices you make today will make you what you are tomorrow."</em
      >
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
  <Jumbo class="min-h-[400px] flex">
    <canvas ref="canvas" class="w-full grow"></canvas>
  </Jumbo>
</template>

<script setup lang="ts">
import createCoin from '../coin';

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  createCoin(canvas.value!);
});
</script>
