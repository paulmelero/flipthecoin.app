import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { CoinResult } from '@flipthecoin/coin-engine';
import { encodeResult, type EncodedResult, type FlipRecord } from './flipStats';

interface FlipDb extends DBSchema {
  flips: {
    key: number;
    value: { t: number; r: EncodedResult };
    indexes: { 'by-t': number };
  };
}

let dbPromise: Promise<IDBPDatabase<FlipDb>> | null = null;

const openFlipDb = () =>
  openDB<FlipDb>('flipthecoin', 1, {
    upgrade(db) {
      const store = db.createObjectStore('flips', {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('by-t', 't');
    },
  });

const getDb = () => (dbPromise ??= openFlipDb());

export async function addFlip(result: CoinResult): Promise<FlipRecord> {
  const db = await getDb();
  const t = Date.now();
  const r = encodeResult(result);
  const id = (await db.add('flips', { t, r } as never)) as number;
  return { id, t, r };
}

export async function loadRecent(limit: number): Promise<FlipRecord[]> {
  const db = await getDb();
  const records: FlipRecord[] = [];
  let cursor = await db
    .transaction('flips')
    .store.index('by-t')
    .openCursor(null, 'prev');
  while (cursor && records.length < limit) {
    const value = cursor.value as { t: number; r: EncodedResult };
    records.push({ id: cursor.primaryKey as number, ...value });
    cursor = await cursor.continue();
  }
  return records;
}

export async function loadAll(): Promise<FlipRecord[]> {
  const db = await getDb();
  const tx = db.transaction('flips');
  const records: FlipRecord[] = [];
  let cursor = await tx.store.index('by-t').openCursor();
  while (cursor) {
    const value = cursor.value as { t: number; r: EncodedResult };
    records.push({ id: cursor.primaryKey as number, ...value });
    cursor = await cursor.continue();
  }
  return records;
}

export async function clearAll(): Promise<void> {
  const db = await getDb();
  await db.clear('flips');
}

export async function requestPersistence(): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;
  const storage = navigator.storage;
  if (!storage?.persist) return false;
  try {
    return await storage.persist();
  } catch {
    return false;
  }
}

export function __resetDbForTests(): void {
  dbPromise = null;
}
