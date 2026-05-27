import { computed, ref } from 'vue';
import type { CoinResult } from '@flipthecoin/coin-engine';
import {
  addFlip,
  clearAll,
  loadRecent,
  requestPersistence,
} from '../lib/flipHistoryDb';
import { computeStats, type FlipRecord } from '../lib/flipStats';

export const DEFAULT_RECENT_LIMIT = 3000;

export interface UseFlipHistoryOptions {
  recentLimit?: number;
}

export function useFlipHistory(opts: UseFlipHistoryOptions = {}) {
  const recentLimit = opts.recentLimit ?? DEFAULT_RECENT_LIMIT;
  const recent = ref<FlipRecord[]>([]);
  const isReady = ref(false);
  const stats = computed(() => computeStats(recent.value));

  async function load() {
    if (typeof window === 'undefined') return;
    recent.value = await loadRecent(recentLimit);
    isReady.value = true;
    void requestPersistence();
  }

  async function record(result: CoinResult) {
    const row = await addFlip(result);
    recent.value = [row, ...recent.value].slice(0, recentLimit);
  }

  async function clear() {
    await clearAll();
    recent.value = [];
  }

  return { recent, stats, isReady, load, record, clear };
}

export default useFlipHistory;
