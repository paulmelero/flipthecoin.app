#!/usr/bin/env node
// Rasterizes apps/flipthecoin/public/favicon.svg into the extension icon set
// at the four manifest sizes (16, 32, 48, 128).
//
// Usage:
//   pnpm dlx sharp-cli  # one-time, or:
//   pnpm add -D -w sharp
//   node scripts/render-extension-icons.mjs

import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const SVG_PATH = resolve(repoRoot, 'apps/flipthecoin/public/favicon.svg');
const OUT_DIR = resolve(repoRoot, 'apps/extension/public/icons');
const SIZES = [16, 32, 48, 128];

await mkdir(OUT_DIR, { recursive: true });

const svgBuffer = await readFile(SVG_PATH);

for (const size of SIZES) {
  const outPath = resolve(OUT_DIR, `icon-${size}.png`);
  await sharp(svgBuffer, { density: 384 })
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(outPath);
  console.log(`✔ ${outPath}`);
}

console.log('\nDone. Wrote', SIZES.length, 'icons.');
