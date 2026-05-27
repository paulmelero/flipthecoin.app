<script setup lang="ts">
import type { FlipRecord, HistoryStats } from '../../lib/flipStats';
import { decodeResult } from '../../lib/flipStats';

const CHIP_SIZE = 40;
const CHIP_GAP = 8;
const CHIP_STRIDE = CHIP_SIZE + CHIP_GAP;
const BUFFER = 5;

const props = defineProps<{
  recent: readonly FlipRecord[];
  stats: HistoryStats;
  isFlipping: boolean;
  result: string;
}>();

const emit = defineEmits<{
  flip: [];
  clear: [];
}>();

const { $t } = useI18n();

const containerRef = ref<HTMLElement | null>(null);
const containerWidth = ref(0);
const scrollLeft = ref(0);

const startIdx = computed(() =>
  Math.max(0, Math.floor(scrollLeft.value / CHIP_STRIDE) - BUFFER),
);
const endIdx = computed(() =>
  Math.min(
    props.recent.length,
    Math.ceil((scrollLeft.value + containerWidth.value) / CHIP_STRIDE) + BUFFER,
  ),
);
const visibleChips = computed(() =>
  props.recent.slice(startIdx.value, endIdx.value).map((rec, i) => ({
    rec,
    idx: startIdx.value + i,
  })),
);
const totalWidth = computed(() =>
  Math.max(0, props.recent.length * CHIP_STRIDE - CHIP_GAP),
);

const newestId = computed(() => props.recent[0]?.id ?? null);
let initialized = false;
let prevNewestId: number | null = null;
const animatingId = ref<number | null>(null);

watch(newestId, (id) => {
  if (!initialized) {
    initialized = true;
    prevNewestId = id;
    return;
  }
  if (id !== null && id !== prevNewestId) {
    animatingId.value = id;
  }
  prevNewestId = id;
});

function onAnimationEnd(rec: FlipRecord) {
  if (rec.id === animatingId.value) {
    animatingId.value = null;
  }
}

let resizeObserver: ResizeObserver | null = null;

watch(containerRef, (el, _oldEl, onCleanup) => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (!el) return;
  containerWidth.value = el.clientWidth;
  resizeObserver = new ResizeObserver(([entry]) => {
    containerWidth.value = entry.contentRect.width;
  });
  resizeObserver.observe(el);
  onCleanup(() => resizeObserver?.disconnect());
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

function onScroll(e: Event) {
  scrollLeft.value = (e.target as HTMLElement).scrollLeft;
}

const headsPct = computed(() =>
  props.stats.total === 0 ? 0 : Math.round(props.stats.headsRatio * 100),
);

const chipClass = (r: FlipRecord['r']): string => {
  const result = decodeResult(r);
  if (result === 'Heads')
    return 'bg-amber-300/30 border-amber-400/50 text-primary';
  if (result === 'Tails')
    return 'bg-zinc-300/20 border-zinc-300/40 text-secondary';
  return 'bg-orange-500/30 border-orange-400/50 text-warning';
};

const chipLabel = (r: FlipRecord['r']): string => {
  const result = decodeResult(r);
  if (result === 'Heads') return $t('play.stats.heads') as string;
  if (result === 'Tails') return $t('play.stats.tails') as string;
  return $t('play.stats.edge') as string;
};

const chipGlyph = (r: FlipRecord['r']): string => {
  const result = decodeResult(r);
  if (result === 'Heads') return 'O';
  if (result === 'Tails') return 'X';
  return 'E';
};

const onClear = () => {
  if (props.stats.total === 0) return;
  if (
    typeof window !== 'undefined' &&
    !window.confirm($t('play.confirmClear') as string)
  ) {
    return;
  }
  emit('clear');
};
</script>

<template>
  <section
    class="rounded-3xl bg-base-100/55 backdrop-blur-xl border border-base-content/10 shadow-2xl px-5 py-4 lg:px-8 lg:py-6 overflow-x-hidden"
  >
    <header class="flex flex-wrap items-end justify-between gap-3 mb-4">
      <div>
        <h2
          class="font-[Archivo] text-lg lg:text-xl font-semibold leading-tight"
        >
          {{ $t('play.history.title') }}
        </h2>
        <p class="text-xs font-mono text-base-content/60 mt-0.5">
          {{ $t('play.stats.total', { count: stats.total }) }}
        </p>
      </div>
      <dl class="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        <div class="flex items-baseline gap-1.5">
          <dt class="text-base-content/60">{{ $t('play.stats.heads') }}</dt>
          <dd class="font-semibold text-amber-500 tabular-nums">
            {{ stats.heads }}
          </dd>
        </div>
        <div class="flex items-baseline gap-1.5">
          <dt class="text-base-content/60">{{ $t('play.stats.tails') }}</dt>
          <dd class="font-semibold text-zinc-400 tabular-nums">
            {{ stats.tails }}
          </dd>
        </div>
        <div class="flex items-baseline gap-1.5">
          <dt class="text-base-content/60">{{ $t('play.stats.edge') }}</dt>
          <dd class="font-semibold text-orange-500 tabular-nums">
            {{ stats.edge }}
          </dd>
        </div>
        <div class="flex items-baseline gap-1.5">
          <dt class="sr-only">heads ratio</dt>
          <dd class="font-mono text-xs text-base-content/70 tabular-nums">
            {{ $t('play.stats.ratio', { ratio: headsPct }) }}
          </dd>
        </div>
      </dl>
    </header>

    <div class="flex flex-col-reverse md:flex-col gap-4">
      <div class="relative overflow-x-hidden max-w-full">
        <div
          ref="containerRef"
          class="overflow-x-auto pb-2 scrollbar-thin"
          @scroll="onScroll"
        >
          <ul
            v-if="recent.length"
            class="relative"
            :style="{ width: totalWidth + 'px', height: CHIP_SIZE + 'px' }"
          >
            <li
              v-for="{ rec, idx } in visibleChips"
              :key="rec.id"
              :class="[
                chipClass(rec.r),
                { 'animate-slide-up': rec.id === animatingId },
              ]"
              class="absolute top-0 grid place-items-center rounded-xl border backdrop-blur-sm font-mono text-sm font-bold shadow-inner"
              :style="{
                left: idx * CHIP_STRIDE + 'px',
                width: CHIP_SIZE + 'px',
                height: CHIP_SIZE + 'px',
              }"
              :title="chipLabel(rec.r)"
              :aria-label="chipLabel(rec.r)"
              @animationend="onAnimationEnd(rec)"
            >
              {{ chipGlyph(rec.r) }}
            </li>
          </ul>
          <p
            v-else
            class="text-sm text-base-content/60 italic py-6 text-center"
          >
            {{ $t('play.history.empty') }}
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <button
          class="btn btn-primary btn-lg flex-1 sm:min-w-[200px]"
          :disabled="isFlipping"
          @click="emit('flip')"
        >
          <span v-if="isFlipping" class="loading loading-spinner"></span>
          <span>{{ isFlipping ? $t('hero.flipping') : $t('hero.cta') }}</span>
        </button>
        <button
          class="btn btn-ghost btn-sm"
          :disabled="stats.total === 0 || isFlipping"
          @click="onClear"
        >
          {{ $t('play.clearHistory') }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease;
}
</style>
