import { describe, expect, it } from 'vitest';
import {
  computeStats,
  decodeResult,
  encodeResult,
  type FlipRecord,
} from '../../app/lib/flipStats';

const make = (r: FlipRecord['r'], id = 0, t = id): FlipRecord => ({ id, t, r });

describe('encodeResult / decodeResult', () => {
  it('round-trips every CoinResult', () => {
    expect(decodeResult(encodeResult('Heads'))).toBe('Heads');
    expect(decodeResult(encodeResult('Tails'))).toBe('Tails');
    expect(decodeResult(encodeResult('Edge'))).toBe('Edge');
  });

  it('encodes to a stable byte ordering', () => {
    expect(encodeResult('Heads')).toBe(0);
    expect(encodeResult('Tails')).toBe(1);
    expect(encodeResult('Edge')).toBe(2);
  });
});

describe('computeStats', () => {
  it('returns zeros for an empty list', () => {
    const s = computeStats([]);
    expect(s).toEqual({
      total: 0,
      heads: 0,
      tails: 0,
      edge: 0,
      headsRatio: 0,
      longestRun: { result: null, length: 0 },
    });
  });

  it('counts all heads and reports headsRatio of 1', () => {
    const s = computeStats([make(0, 1), make(0, 2), make(0, 3)]);
    expect(s.heads).toBe(3);
    expect(s.tails).toBe(0);
    expect(s.headsRatio).toBe(1);
    expect(s.longestRun).toEqual({ result: 'Heads', length: 3 });
  });

  it('excludes edges from the heads ratio', () => {
    const s = computeStats([make(0, 1), make(2, 2), make(2, 3), make(0, 4)]);
    expect(s.heads).toBe(2);
    expect(s.edge).toBe(2);
    expect(s.headsRatio).toBe(1);
  });

  it('computes the longest run across mixed results', () => {
    const s = computeStats([
      make(0, 1),
      make(0, 2),
      make(1, 3),
      make(1, 4),
      make(1, 5),
      make(0, 6),
    ]);
    expect(s.heads).toBe(3);
    expect(s.tails).toBe(3);
    expect(s.headsRatio).toBeCloseTo(0.5);
    expect(s.longestRun).toEqual({ result: 'Tails', length: 3 });
  });

  it('handles a single record', () => {
    const s = computeStats([make(1, 1)]);
    expect(s.total).toBe(1);
    expect(s.tails).toBe(1);
    expect(s.longestRun).toEqual({ result: 'Tails', length: 1 });
  });
});
