<script setup lang="ts">
import { computed } from 'vue';
import type { FlipEntry } from '../composables/useFlipHistory';

const props = defineProps<{
  entries: FlipEntry[];
}>();

const emit = defineEmits<{ clear: [] }>();

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const formatRelative = (ts: number) => {
  const diffMs = ts - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(diffSec, 'second');
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
  return rtf.format(Math.round(diffSec / 86400), 'day');
};

const isEmpty = computed(() => props.entries.length === 0);
</script>

<template>
  <section
    class="flex-1 min-h-0 flex flex-col bg-base-200/40 border-t border-base-content/10"
  >
    <div class="flex items-center justify-between px-3 py-2">
      <h2
        class="text-xs uppercase tracking-wider font-semibold text-base-content/60"
      >
        History
      </h2>
      <button
        v-if="!isEmpty"
        class="btn btn-ghost btn-xs"
        @click="emit('clear')"
      >
        Clear
      </button>
    </div>
    <p v-if="isEmpty" class="px-3 pb-3 text-xs text-base-content/50">
      Your last 10 flips will appear here.
    </p>
    <ol v-else class="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
      <li
        v-for="entry in entries"
        :key="entry.id"
        class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-base-100"
      >
        <span
          class="inline-flex items-center justify-center size-6 rounded-full text-[10px] font-mono font-semibold"
          :class="{
            'bg-primary/20 text-primary': entry.result === 'Heads',
            'bg-secondary/20 text-secondary': entry.result === 'Tails',
            'bg-warning/20 text-warning': entry.result === 'Edge',
          }"
        >
          {{
            entry.result === 'Edge' ? 'E' : entry.result === 'Heads' ? 'H' : 'T'
          }}
        </span>
        <span class="text-xs flex-1">{{ entry.result }}</span>
        <time
          class="text-[10px] text-base-content/50 font-mono"
          :datetime="new Date(entry.ts).toISOString()"
        >
          {{ formatRelative(entry.ts) }}
        </time>
      </li>
    </ol>
  </section>
</template>
