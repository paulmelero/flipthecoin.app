import type { CoinResult } from '@flipthecoin/coin-engine';

export type EncodedResult = 0 | 1 | 2;

export interface FlipRecord {
  id: number;
  t: number;
  r: EncodedResult;
}

export interface HistoryStats {
  total: number;
  heads: number;
  tails: number;
  edge: number;
  headsRatio: number;
  longestRun: { result: CoinResult | null; length: number };
}

const RESULTS: Record<EncodedResult, CoinResult> = {
  0: 'Heads',
  1: 'Tails',
  2: 'Edge',
};

const ENCODED: Record<CoinResult, EncodedResult> = {
  Heads: 0,
  Tails: 1,
  Edge: 2,
};

export const encodeResult = (r: CoinResult): EncodedResult => ENCODED[r];

export const decodeResult = (b: EncodedResult): CoinResult => RESULTS[b];

export function computeStats(records: readonly FlipRecord[]): HistoryStats {
  let heads = 0;
  let tails = 0;
  let edge = 0;
  let longestLen = 0;
  let longestResult: CoinResult | null = null;
  let runLen = 0;
  let runResult: EncodedResult | null = null;

  for (const rec of records) {
    if (rec.r === 0) heads++;
    else if (rec.r === 1) tails++;
    else edge++;

    if (rec.r === runResult) {
      runLen++;
    } else {
      runResult = rec.r;
      runLen = 1;
    }
    if (runLen > longestLen) {
      longestLen = runLen;
      longestResult = decodeResult(rec.r);
    }
  }

  const decisive = heads + tails;
  const headsRatio = decisive === 0 ? 0 : heads / decisive;

  return {
    total: records.length,
    heads,
    tails,
    edge,
    headsRatio,
    longestRun: { result: longestResult, length: longestLen },
  };
}
