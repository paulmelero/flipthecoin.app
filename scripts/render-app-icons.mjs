#!/usr/bin/env node
// Rasterizes apps/flipthecoin/public/favicon.svg into the platform icon set
// (Apple touch icon, MS tile, PWA / Android, legacy PNG favicons).
//
// Usage:
//   node scripts/render-app-icons.mjs

import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const SVG_PATH = resolve(repoRoot, 'apps/flipthecoin/public/favicon.svg');
const OUT_DIR = resolve(repoRoot, 'apps/flipthecoin/public');

const TARGETS = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'mstile-150x150.png', size: 150 },
];

const ICO_SIZES = [16, 32, 48];

await mkdir(OUT_DIR, { recursive: true });
const svgBuffer = await readFile(SVG_PATH);

const renderPng = (size) =>
  sharp(svgBuffer, { density: 384 })
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

for (const { name, size } of TARGETS) {
  const outPath = resolve(OUT_DIR, name);
  await writeFile(outPath, await renderPng(size));
  console.log(`✔ ${outPath} (${size}×${size})`);
}

const icoBuffers = await Promise.all(ICO_SIZES.map(renderPng));
const icoPath = resolve(OUT_DIR, 'favicon.ico');
await writeFile(icoPath, await pngToIco(icoBuffers));
console.log(`✔ ${icoPath} (${ICO_SIZES.join('+')})`);

console.log('\nDone. Wrote', TARGETS.length + 1, 'icons.');
