<script setup lang="ts">
import type { CoinResult } from '@flipthecoin/coin-engine';
import type { FlipRecord, HistoryStats } from '../../lib/flipStats';
import { decodeResult } from '../../lib/flipStats';

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
  if (result === 'Heads') return 'H';
  if (result === 'Tails') return 'T';
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
        <ul
          v-if="recent.length"
          class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin"
        >
          <TransitionGroup name="slide-up">
            <li
              v-for="rec in recent"
              :key="rec.id"
              :class="chipClass(rec.r)"
              class="shrink-0 grid place-items-center w-10 h-10 rounded-xl border backdrop-blur-sm font-mono text-sm font-bold shadow-inner"
              :title="chipLabel(rec.r)"
              :aria-label="chipLabel(rec.r)"
            >
              {{ chipGlyph(rec.r) }}
            </li>
          </TransitionGroup>
        </ul>
        <p v-else class="text-sm text-base-content/60 italic py-6 text-center">
          {{ $t('play.history.empty') }}
        </p>
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
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
}
</style>
