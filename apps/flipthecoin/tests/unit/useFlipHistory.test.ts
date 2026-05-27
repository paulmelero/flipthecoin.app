import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { useFlipHistory } from '../../app/composables/useFlipHistory';
import { __resetDbForTests, loadAll } from '../../app/lib/flipHistoryDb';

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  __resetDbForTests();
});

afterEach(() => {
  __resetDbForTests();
});

describe('useFlipHistory', () => {
  it('starts empty and not ready', () => {
    const h = useFlipHistory();
    expect(h.recent.value).toEqual([]);
    expect(h.isReady.value).toBe(false);
    expect(h.stats.value.total).toBe(0);
  });

  it('flips isReady true after load() resolves', async () => {
    const h = useFlipHistory();
    await h.load();
    expect(h.isReady.value).toBe(true);
  });

  it('record() prepends to recent and updates stats', async () => {
    const h = useFlipHistory();
    await h.record('Heads');
    await h.record('Tails');

    expect(h.recent.value).toHaveLength(2);
    expect(h.recent.value[0].r).toBe(1);
    expect(h.recent.value[1].r).toBe(0);
    expect(h.stats.value.heads).toBe(1);
    expect(h.stats.value.tails).toBe(1);
  });

  it('record() respects the recentLimit option', async () => {
    const h = useFlipHistory({ recentLimit: 2 });
    await h.record('Heads');
    await h.record('Tails');
    await h.record('Edge');

    expect(h.recent.value).toHaveLength(2);
    expect(h.recent.value.map((r) => r.r)).toEqual([2, 1]);
  });

  it('clear() empties the store and the ref', async () => {
    const h = useFlipHistory();
    await h.record('Heads');
    await h.clear();
    expect(h.recent.value).toEqual([]);
    expect(h.stats.value.total).toBe(0);
  });

  it('load() picks up flips persisted by an earlier session', async () => {
    const a = useFlipHistory();
    await a.record('Heads');
    await a.record('Tails');

    const b = useFlipHistory();
    await b.load();
    expect(b.recent.value).toHaveLength(2);
    expect(b.recent.value[0].r).toBe(1);
  });

  describe('eviction at recentLimit', () => {
    it('recent has exactly recentLimit entries when more are recorded', async () => {
      const h = useFlipHistory({ recentLimit: 3 });
      await h.record('Heads');
      await h.record('Tails');
      await h.record('Edge');
      await h.record('Heads');
      await h.record('Tails');

      expect(h.recent.value).toHaveLength(3);
    });

    it('evicts the oldest entry, keeping newest-first order', async () => {
      const h = useFlipHistory({ recentLimit: 3 });
      await h.record('Heads');
      await h.record('Tails');
      await h.record('Edge');
      await h.record('Heads');

      expect(h.recent.value).toHaveLength(3);
      expect(h.recent.value.map((r) => r.r)).toEqual([0, 2, 1]);
    });

    it('DB retains all flips even after in-memory eviction', async () => {
      const h = useFlipHistory({ recentLimit: 3 });
      await h.record('Heads');
      await h.record('Tails');
      await h.record('Edge');
      await h.record('Heads');
      await h.record('Tails');

      expect(h.recent.value).toHaveLength(3);
      expect(await loadAll()).toHaveLength(5);
    });

    it('load() after overflow returns the newest limit entries', async () => {
      const a = useFlipHistory({ recentLimit: 3 });
      await a.record('Heads');
      await a.record('Tails');
      await a.record('Edge');
      await a.record('Heads');
      await a.record('Tails');

      const lastThreeIds = a.recent.value.map((r) => r.id);

      const b = useFlipHistory({ recentLimit: 3 });
      await b.load();

      expect(b.recent.value).toHaveLength(3);
      expect(b.recent.value.map((r) => r.id)).toEqual(lastThreeIds);
    });
  });
});
