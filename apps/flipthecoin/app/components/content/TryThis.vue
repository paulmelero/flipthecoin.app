<script setup lang="ts">
defineProps<{
  title: string;
}>();

const { $t } = useI18n();
</script>

<template>
  <div class="not-prose my-10">
    <div
      class="grid grid-cols-1 min-[560px]:grid-cols-[88px_1fr_88px] min-[560px]:items-end min-[560px]:-mx-6 relative"
    >
      <div
        class="hidden min-[560px]:flex min-[560px]:items-end min-[560px]:justify-center min-[560px]:overflow-hidden min-[560px]:z-[1] min-[560px]:relative min-[560px]:translate-x-1/4"
        aria-hidden="true"
      >
        <img
          src="/images/try-this/left2.svg"
          alt=""
          class="w-full h-auto max-h-[180px] object-contain object-bottom"
        />
      </div>

      <div
        class="relative overflow-hidden rounded-[1.75rem] border-2 border-warning/[0.45] bg-[color:color-mix(in_oklch,var(--color-warning,oklch(79%_0.18_86)),var(--color-base-100,oklch(97%_0.01_80))_82%)] py-6 px-7"
      >
        <img
          src="/images/try-this/left1.svg"
          alt=""
          class="pointer-events-none absolute -top-1.5 right-3.5 w-[52px] h-auto rotate-12 opacity-70"
          aria-hidden="true"
        />
        <p
          class="try-this-eyebrow mt-0 mb-2 font-['Archivo',sans-serif] font-black text-sm tracking-widest uppercase text-[color:color-mix(in_oklch,var(--color-warning,oklch(79%_0.18_86)),oklch(20%_0_0)_50%)]"
        >
          {{ $t('tryThis.label') }}
        </p>
        <h3
          class="mt-0 mb-4 font-['Archivo',sans-serif] font-bold text-[1.2rem] leading-[1.35] text-[color:color-mix(in_oklch,var(--color-base-content,oklch(38%_0.17_305)),var(--color-warning,oklch(79%_0.18_86))_20%)]"
        >
          {{ title }}
        </h3>
        <div
          class="try-this-body text-base-content text-[0.9rem] leading-[1.7]"
        >
          <slot />
        </div>
      </div>

      <div
        class="absolute min-[560px]:static right-3 -top-10 -z-[1] min-[560px]:z-[1] min-[560px]:-translate-x-1/4 min-[560px]:overflow-hidden"
        aria-hidden="true"
      >
        <img
          src="/images/try-this/right.svg"
          alt=""
          class="w-full h-auto max-h-[50px] min-[560px]:max-h-[200px] object-contain object-bottom"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Kawaii chunky outline — no Tailwind utility for these. */
.try-this-eyebrow {
  -webkit-text-stroke: 2.5px white;
  paint-order: stroke fill;
}

/* Slot content is rendered markdown — styled via :deep(). */
.try-this-body {
  color: var(--color-base-content, oklch(38% 0.17 305));
}

.try-this-body :deep(p) {
  margin: 0 0 0.65em;
}

.try-this-body :deep(p:last-child) {
  margin-bottom: 0;
}

.try-this-body :deep(ol) {
  list-style: decimal;
  list-style-position: outside;
  padding-left: 1.4em;
  margin: 0.4em 0 0.65em;
}

.try-this-body :deep(ul) {
  list-style: disc;
  list-style-position: outside;
  padding-left: 1.4em;
  margin: 0.4em 0 0.65em;
}

.try-this-body :deep(li) {
  margin: 0.25em 0;
}

.try-this-body :deep(strong) {
  font-weight: 700;
}

.try-this-body :deep(em) {
  font-style: italic;
}

.try-this-body :deep(a) {
  /* Lean the link toward base-content so it stays legible on the
     warm card in both light and dark themes, keeping a primary hue. */
  color: color-mix(
    in oklch,
    var(--color-primary, oklch(84% 0.143 165)),
    var(--color-base-content, oklch(38% 0.176 305)) 60%
  );
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.try-this-body :deep(a:hover) {
  text-decoration-thickness: 2px;
}
</style>
