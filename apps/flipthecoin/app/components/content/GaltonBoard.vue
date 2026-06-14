<script setup lang="ts">
/**
 * GaltonBoard — the article-facing demo. Authors embed it in markdown with:
 *
 *   ::galton-board
 *   ::
 *
 * It composes the reusable DemoFrame (title, caption, lazy-activation,
 * reduced-motion handling) and feeds the frame's scoped-slot lifecycle props
 * into the client-only GaltonCanvas.
 */
const { $t } = useI18n();
</script>

<template>
  <DemoFrame
    :title="$t('demo.galton.title') as string"
    :caption="$t('demo.galton.caption') as string"
    v-slot="{ active, paused }"
  >
    <ClientOnly>
      <GaltonCanvas :active="active" :paused="paused" />
      <template #fallback>
        <div class="aspect-[4/3] w-full" />
      </template>
    </ClientOnly>
  </DemoFrame>
</template>
