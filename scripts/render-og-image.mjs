#!/usr/bin/env node
// Renders OG images (one per locale) by compositing the captured mid-flip
// coin still with a headline overlay using satori + @resvg/resvg-js.
//
// Usage:
//   pnpm add -D -w satori @resvg/resvg-js
//   node scripts/render-og-image.mjs

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const OG_DIR = resolve(repoRoot, 'apps/flipthecoin/public/img/og');
const COIN_PATH = resolve(
  repoRoot,
  'apps/flipthecoin/public/img/coin/mid-1024.png',
);

await mkdir(OG_DIR, { recursive: true });

const coinBuf = await readFile(COIN_PATH).catch(() => null);
if (!coinBuf) {
  console.error(
    'Missing apps/flipthecoin/public/img/coin/mid-1024.png — run capture-coin-frames.mjs first.',
  );
  process.exit(1);
}
const coinDataUri = `data:image/png;base64,${coinBuf.toString('base64')}`;

const fontPath = resolve(
  repoRoot,
  'node_modules/@fontsource/archivo/files/archivo-latin-600-normal.woff',
);

let fontBuf;
try {
  fontBuf = await readFile(fontPath);
} catch {
  console.error(
    `Missing Archivo font at ${fontPath} — run pnpm install in apps/extension or root first.`,
  );
  process.exit(1);
}

const COPY = {
  en: {
    title: 'Flip The Coin',
    sub: 'A 3D coin you can spin, flip, and learn from.',
  },
  es: {
    title: 'Flip The Coin',
    sub: 'Una moneda 3D para girar, lanzar y aprender.',
  },
};

for (const [locale, { title, sub }] of Object.entries(COPY)) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          background:
            'linear-gradient(135deg, #fef3c7 0%, #f5b806 60%, #b45309 100%)',
          color: '#1f1304',
          fontFamily: 'Archivo',
          padding: '60px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '24px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '88px',
                      lineHeight: 1.05,
                      fontWeight: 600,
                    },
                    children: title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '32px',
                      opacity: 0.75,
                      maxWidth: '560px',
                    },
                    children: sub,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '20px',
                      opacity: 0.55,
                      marginTop: '16px',
                    },
                    children: 'flipthecoin.app',
                  },
                },
              ],
            },
          },
          {
            type: 'img',
            props: {
              src: coinDataUri,
              width: 460,
              height: 460,
              style: { alignSelf: 'center' },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Archivo', data: fontBuf, weight: 600, style: 'normal' }],
    },
  );

  const png = new Resvg(svg).render().asPng();
  const outPath = resolve(OG_DIR, `home-${locale}.png`);
  await writeFile(outPath, png);
  console.log(`✔ ${outPath}`);
}
