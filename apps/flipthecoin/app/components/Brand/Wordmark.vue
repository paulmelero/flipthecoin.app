<template>
  <span class="brand-wordmark">
    <span class="brand-wordmark__main">Flip The Coin</span>
    <span class="brand-wordmark__dot" aria-hidden="true">·</span>
    <span class="brand-wordmark__tld">app</span>
  </span>
</template>

<style scoped>
.brand-wordmark {
  font-family: 'Archivo', system-ui, sans-serif;
  font-weight: 600;
  font-stretch: 125%;
  letter-spacing: -0.01em;
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  line-height: 1;
}

.brand-wordmark__main {
  font-size: 1.05em;
}

.brand-wordmark__dot {
  color: oklch(var(--p, 75% 0.18 80) / 0.7);
  font-weight: 400;
}

.brand-wordmark__tld {
  font-size: 0.7em;
  font-weight: 500;
  text-transform: lowercase;
  opacity: 0.65;
}
</style>
