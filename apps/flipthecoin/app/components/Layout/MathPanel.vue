<template>
  <div
    class="relative px-8 pt-8 pb-6 lg:px-12 lg:pt-12 lg:pb-8 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-secondary/10 border border-primary/10 overflow-hidden"
  >
    <!-- Math backdrop decorations -->
    <span
      aria-hidden="true"
      class="absolute left-6 bottom-8 text-xs font-mono opacity-[0.08] dark:opacity-[0.12] -rotate-6 select-none"
    >
      P(k) = ½
    </span>
    <span
      aria-hidden="true"
      class="absolute right-6 lg:right-1/2 top-8 text-xs font-mono opacity-[0.08] dark:opacity-[0.12] rotate-3 select-none"
    >
      σ = √(np(1−p))
    </span>

    <slot />
  </div>
</template>
