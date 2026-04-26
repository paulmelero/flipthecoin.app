import { ref } from 'vue';
import type { CoinResult } from '@flipthecoin/coin-engine';

export interface FlipEntry {
  id: string;
  result: CoinResult;
  ts: number;
}

const HISTORY_KEY = 'ftc.history.v1';
const MAX_ENTRIES = 10;

const storage =
  typeof chrome !== 'undefined' && chrome.storage?.local
    ? chrome.storage.local
    : null;

export function useFlipHistory() {
  const history = ref<FlipEntry[]>([]);

  const persist = () => {
    if (storage) storage.set({ [HISTORY_KEY]: history.value });
  };

  const load = async () => {
    if (!storage) return;
    const stored = await new Promise<{ [k: string]: unknown }>((resolve) => {
      storage.get([HISTORY_KEY], (v) => resolve(v));
    });
    const entries = stored[HISTORY_KEY];
    if (Array.isArray(entries)) {
      history.value = entries.slice(0, MAX_ENTRIES) as FlipEntry[];
    }
  };

  const push = (result: CoinResult) => {
    const entry: FlipEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      result,
      ts: Date.now(),
    };
    history.value = [entry, ...history.value].slice(0, MAX_ENTRIES);
    persist();
  };

  const clear = () => {
    history.value = [];
    persist();
  };

  void load();

  return { history, push, clear };
}
