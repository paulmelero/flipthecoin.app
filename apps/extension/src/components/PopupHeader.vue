<script setup lang="ts">
import BrandMark from './BrandMark.vue';
import { useTheme } from '../composables/useTheme';

const { theme, toggle } = useTheme();
</script>

<template>
  <header
    class="flex items-center justify-between px-3 h-9 border-b border-base-content/10 bg-base-100"
  >
    <div class="flex items-center gap-2">
      <BrandMark :size="20" />
      <a
        href="https://flipthecoin.app"
        target="_blank"
        class="font-[Archivo] font-semibold text-sm tracking-tight text-base-content"
        >Flip The Coin</a
      >
    </div>
    <button
      class="btn btn-ghost btn-xs btn-square"
      :aria-label="
        theme === 'fantasy' ? 'Switch to dark theme' : 'Switch to light theme'
      "
      @click="toggle"
    >
      <svg
        v-if="theme === 'fantasy'"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        />
      </svg>
    </button>
  </header>
</template>
