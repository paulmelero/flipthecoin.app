<script setup lang="ts">
/**
 * GaltonCanvas — the client-only WebGL surface + controls for the Galton
 * board demo. It receives `active`/`paused` as plain props (fed from
 * DemoFrame's scoped slot via GaltonBoard) so the watchers below bind
 * reactively. All visible text comes from i18n.
 */
const props = defineProps<{
  active: boolean;
  paused: boolean;
}>();

const { $t } = useI18n();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isDropping = ref(false);

const { setup, dispose, dropBalls, reset, setPaused, isReady, isFull } =
  useGaltonBoard(canvasRef, isDropping, { maxBalls: 180 });

// Activate the scene the first time the frame scrolls into view (or the
// user opts in under reduced motion).
watch(
  () => props.active,
  async (active) => {
    if (active && !isReady.value) {
      await nextTick();
      setup();
    }
  },
  { immediate: true },
);

// Stop/resume the animation loop as the frame leaves/enters the viewport.
watch(
  () => props.paused,
  (paused) => setPaused(paused),
);

onBeforeUnmount(dispose);
</script>

<template>
  <div class="flex flex-col">
    <div class="relative aspect-[4/3] w-full">
      <canvas
        ref="canvasRef"
        class="block h-full w-full"
        :aria-label="$t('demo.galton.canvasAria') as string"
      ></canvas>

      <div
        v-if="active && !isReady"
        class="absolute inset-0 flex items-center justify-center text-sm text-base-content/60"
      >
        {{ $t('demo.loading') }}
      </div>
    </div>

    <div
      class="flex justify-center gap-2 border-t border-base-content/5 bg-base-100/50 p-3"
    >
      <button
        type="button"
        class="btn btn-primary btn-sm"
        :disabled="!isReady || isDropping || isFull"
        @click="dropBalls"
      >
        {{
          isFull
            ? $t('demo.galton.full')
            : isDropping
              ? $t('demo.galton.dropping')
              : $t('demo.galton.dropButton')
        }}
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-sm"
        :disabled="!isReady"
        @click="reset"
      >
        {{ $t('demo.galton.resetButton') }}
      </button>
    </div>
  </div>
</template>
