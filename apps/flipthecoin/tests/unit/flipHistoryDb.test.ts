import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import {
  __resetDbForTests,
  addFlip,
  clearAll,
  loadAll,
  loadRecent,
} from '../../app/lib/flipHistoryDb';

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  __resetDbForTests();
});

afterEach(() => {
  __resetDbForTests();
});

describe('flipHistoryDb', () => {
  it('round-trips a single flip', async () => {
    const rec = await addFlip('Heads');
    expect(rec.r).toBe(0);
    expect(typeof rec.id).toBe('number');
    expect(typeof rec.t).toBe('number');

    const recent = await loadRecent(10);
    expect(recent).toHaveLength(1);
    expect(recent[0].r).toBe(0);
    expect(recent[0].id).toBe(rec.id);
  });

  it('returns recent flips newest-first', async () => {
    const a = await addFlip('Heads');
    const b = await addFlip('Tails');
    const c = await addFlip('Edge');

    const recent = await loadRecent(10);
    expect(recent.map((r) => r.id)).toEqual([c.id, b.id, a.id]);
    expect(recent.map((r) => r.r)).toEqual([2, 1, 0]);
  });

  it('respects the limit when loading recent', async () => {
    for (let i = 0; i < 5; i++) await addFlip('Heads');
    const recent = await loadRecent(3);
    expect(recent).toHaveLength(3);
  });

  it('loadAll returns chronological order (oldest-first)', async () => {
    const a = await addFlip('Heads');
    const b = await addFlip('Tails');
    const all = await loadAll();
    expect(all.map((r) => r.id)).toEqual([a.id, b.id]);
  });

  it('clearAll empties the store', async () => {
    await addFlip('Heads');
    await addFlip('Tails');
    await clearAll();
    expect(await loadRecent(10)).toEqual([]);
  });

  it('DB is append-only — loadRecent does not prune old entries', async () => {
    for (let i = 0; i < 10; i++) await addFlip('Heads');

    expect(await loadAll()).toHaveLength(10);
    expect(await loadRecent(5)).toHaveLength(5);
    expect(await loadAll()).toHaveLength(10);
  });
});
