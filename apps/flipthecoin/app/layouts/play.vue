<template>
  <div class="relative min-h-[100dvh] overflow-hidden bg-base-100">
    <div class="!fixed top-0 inset-x-0 z-20 backdrop-blur-md bg-base-200/60">
      <LayoutFHeader class="" />
    </div>
    <main class="pt-24 bg-base-100">
      <slot />
    </main>
  </div>
</template>
