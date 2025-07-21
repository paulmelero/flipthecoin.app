<template>
  <div class="grid grid-rows-[auto,1fr,auto] min-h-[100dvh]">
    <LayoutFHeader />
    <main class="py-20">
      <slot />
    </main>
    <LayoutFFooter />
  </div>
</template>
