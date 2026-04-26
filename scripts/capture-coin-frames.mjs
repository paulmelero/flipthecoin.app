#!/usr/bin/env node
// Captures still PNGs of the Three.js coin in heads/tails/edge/mid poses
// at multiple sizes via the dev-only /__capture route.
//
// Usage:
//   1. Start the dev server: pnpm --filter @flipthecoin/app dev
//   2. In another shell:    node scripts/capture-coin-frames.mjs [--port=3000] [--out=./apps/flipthecoin/public/img/coin]
//
// Requires Playwright. If not installed locally:
//   pnpm dlx playwright install chromium
//   pnpm dlx playwright add @playwright/test

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);

const PORT = args.port ?? 3000;
const OUT_DIR = resolve(
  repoRoot,
  args.out ?? 'apps/flipthecoin/public/img/coin',
);
const POSES = ['heads', 'tails', 'edge', 'mid'];
const SIZES = [1024, 512, 256];

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 1 });
const page = await ctx.newPage();

for (const pose of POSES) {
  for (const size of SIZES) {
    const url = `http://localhost:${PORT}/__capture?pose=${pose}&size=${size}`;
    console.log(`→ ${pose} @ ${size}px`);

    await page.setViewportSize({ width: size + 32, height: size + 32 });
    await page.goto(url, { waitUntil: 'networkidle' });

    await page.waitForFunction(
      () =>
        typeof window.__captureReady === 'function' && window.__captureReady(),
      undefined,
      { timeout: 10000 },
    );

    const dataUrl = await page.evaluate(async () => {
      const blob = await window.__capture();
      if (!blob) return null;
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    });

    if (!dataUrl || typeof dataUrl !== 'string') {
      console.warn(`  ⚠ no blob for ${pose} @ ${size}`);
      continue;
    }

    const base64 = dataUrl.split(',')[1];
    const buf = Buffer.from(base64, 'base64');
    const outPath = resolve(OUT_DIR, `${pose}-${size}.png`);
    await writeFile(outPath, buf);
    console.log(`  ✔ wrote ${outPath}`);
  }
}

await browser.close();
console.log('\nDone. Captured', POSES.length * SIZES.length, 'frames.');
