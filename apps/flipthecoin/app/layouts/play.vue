<template>
  <div class="relative min-h-[100dvh] overflow-hidden bg-base-100">
    <LayoutFHeader
      class="!fixed top-0 inset-x-0 z-20 bg-base-100/60 backdrop-blur-md"
    />
    <main class="pt-24 bg-base-100">
      <slot />
    </main>
  </div>
</template>
