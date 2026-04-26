<template>
  <div class="container mx-auto px-4 lg:px-8 py-10" aria-hidden="true">
    <div
      class="relative h-32 sm:h-40 rounded-2xl bg-gradient-to-br from-primary/5 via-base-200/40 to-secondary/5 overflow-hidden flex items-center justify-center select-none"
    >
      <div
        class="absolute inset-0 flex items-center justify-around font-mono text-base-content/30 text-sm sm:text-base whitespace-nowrap"
      >
        <span class="-rotate-3">P(H) = ½</span>
        <span class="rotate-2">E[X] = np</span>
        <span class="-rotate-1">σ = √(np(1−p))</span>
        <span class="rotate-3">∑P(X = k) = 1</span>
      </div>
      <div
        class="absolute inset-0 bg-gradient-to-r from-base-100 via-transparent to-base-100"
      ></div>
    </div>
  </div>
</template>
