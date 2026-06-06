#!/usr/bin/env node
// Renders one OG image per blog post (per locale) using satori + @resvg/resvg-js.
// The card is inspired by app/components/Layout/MathPanel.vue: a base-100
// background with a primary→secondary gradient wash, faint math decorations,
// the post title, and the author. Images are generated locally (NOT at runtime)
// and committed, since Cloudflare Workers CI handles the WASM binaries poorly.
//
// Usage:
//   node scripts/generate-blog-og-images.mjs                 # rebuild all posts
//   node scripts/generate-blog-og-images.mjs <file.md> ...   # only these posts

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve, dirname, isAbsolute, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const APP = resolve(repoRoot, 'apps/flipthecoin');
const BLOG_DIR = resolve(APP, 'content/blog');
const AUTHORS_DIR = resolve(APP, 'content/authors');
const PUBLIC_DIR = resolve(APP, 'public');
const OUT_DIR = resolve(PUBLIC_DIR, 'img/og/blog');

// Dark (Dracula) theme tokens — the app's dark daisyui theme.
const COLORS = {
  base100: '#282a36',
  baseContent: '#f8f8f2',
  primary: '255, 121, 198', // #ff79c6
  secondary: '189, 147, 249', // #bd93f9
};

// ── Minimal frontmatter / YAML scalar parser ──────────────────────────────
// Handles the simple `key: value` scalar fields we need (single/double-quoted
// or bare). Not a general YAML parser — sufficient for blog frontmatter and
// the flat author .yml files.
function parseScalars(text) {
  const out = {};
  for (const raw of text.split('\n')) {
    const m = raw.match(/^([\w-]+):\s*(.*?)\s*$/);
    if (!m) continue;
    let [, key, val] = m;
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  return m ? parseScalars(m[1]) : {};
}

// ── Fonts ─────────────────────────────────────────────────────────────────
async function loadFont(relPath, label) {
  const p = resolve(repoRoot, relPath);
  try {
    return await readFile(p);
  } catch {
    console.error(`Missing ${label} font at ${p} — run pnpm install first.`);
    process.exit(1);
  }
}

const [archivo, firaSans, katexMain, katexMath] = await Promise.all([
  loadFont(
    'node_modules/@fontsource/archivo/files/archivo-latin-600-normal.woff',
    'Archivo',
  ),
  loadFont(
    'node_modules/@fontsource/fira-sans/files/fira-sans-latin-300-normal.woff',
    'Fira Sans',
  ),
  // Fallbacks for math glyphs the latin subsets lack: KaTeX_Main covers √ and ½;
  // KaTeX_Math-Italic covers Greek letters such as σ.
  loadFont(
    'node_modules/katex/dist/fonts/KaTeX_Main-Regular.ttf',
    'KaTeX_Main',
  ),
  loadFont('node_modules/katex/dist/fonts/KaTeX_Math-Italic.ttf', 'KaTeX_Math'),
]);

const fonts = [
  { name: 'Archivo', data: archivo, weight: 600, style: 'normal' },
  { name: 'Fira Sans', data: firaSans, weight: 300, style: 'normal' },
  { name: 'KaTeX_Main', data: katexMain, weight: 400, style: 'normal' },
  { name: 'KaTeX_Math', data: katexMath, weight: 400, style: 'normal' },
];

// ── Author resolution (cached) ─────────────────────────────────────────────
const authorCache = new Map();
async function resolveAuthor(slug) {
  const key = slug || 'paul-melero';
  if (authorCache.has(key)) return authorCache.get(key);
  let author = { name: 'FlipTheCoin.app', avatar: null };
  try {
    const yml = await readFile(resolve(AUTHORS_DIR, `${key}.yml`), 'utf8');
    const data = parseScalars(yml);
    let avatarUri = null;
    if (data.avatar) {
      try {
        const buf = await readFile(resolve(PUBLIC_DIR, `.${data.avatar}`));
        const png = await sharp(buf)
          .resize(128, 128, { fit: 'cover' })
          .png()
          .toBuffer();
        avatarUri = `data:image/png;base64,${png.toString('base64')}`;
      } catch {
        // avatar optional — fall through to name-only
      }
    }
    author = { name: data.name || key, avatar: avatarUri };
  } catch {
    // unknown author — keep default
  }
  authorCache.set(key, author);
  return author;
}

// ── Card template ───────────────────────────────────────────────────────────
function card({ title, author }) {
  const decorStyle = {
    position: 'absolute',
    fontFamily: 'KaTeX_Main',
    fontSize: '40px',
    color: COLORS.baseContent,
    opacity: 0.12,
  };

  const authorRow = {
    type: 'div',
    props: {
      style: { display: 'flex', alignItems: 'center', gap: '20px' },
      children: [
        author.avatar && {
          type: 'img',
          props: {
            src: author.avatar,
            width: 64,
            height: 64,
            style: { borderRadius: '50%' },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontFamily: 'Fira Sans',
              fontSize: '30px',
              color: COLORS.baseContent,
              opacity: 0.7,
            },
            children: author.name,
          },
        },
      ].filter(Boolean),
    },
  };

  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        padding: '80px',
        background: COLORS.base100,
        color: COLORS.baseContent,
        fontFamily: 'Fira Sans',
      },
      children: [
        // gradient wash (MathPanel: from-primary/15 via-primary/5 to-secondary/10)
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, rgba(${COLORS.primary},0.20) 0%, rgba(${COLORS.primary},0.06) 50%, rgba(${COLORS.secondary},0.16) 100%)`,
            },
          },
        },
        // subtle inset border (border-primary/10)
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: '24px',
              left: '24px',
              right: '24px',
              bottom: '24px',
              borderRadius: '32px',
              border: `1px solid rgba(${COLORS.primary},0.4)`,
            },
          },
        },
        // math decorations
        {
          type: 'div',
          props: {
            style: {
              ...decorStyle,
              top: '70px',
              right: '90px',
              transform: 'rotate(3deg)',
            },
            children: 'σ = √(np(1−p))',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              ...decorStyle,
              bottom: '170px',
              left: '90px',
              transform: 'rotate(-6deg)',
            },
            children: 'P(k) = ½',
          },
        },
        // title
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              maxWidth: '960px',
            },
            children: {
              type: 'div',
              props: {
                style: {
                  fontFamily: 'Archivo',
                  fontWeight: 600,
                  fontSize: '72px',
                  lineHeight: 1.08,
                },
                children: title,
              },
            },
          },
        },
        // footer: author + site tag
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
            children: [
              authorRow,
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontFamily: 'Fira Sans',
                    fontSize: '28px',
                    color: COLORS.baseContent,
                    opacity: 0.55,
                  },
                  children: 'flipthecoin.app',
                },
              },
            ],
          },
        },
      ],
    },
  };
}

// ── Render one post ──────────────────────────────────────────────────────────
async function render(file) {
  const md = await readFile(file, 'utf8');
  const fm = parseFrontmatter(md);
  if (!fm.slug || !fm._locale) {
    console.warn(`⚠ skipping ${basename(file)} — missing slug/_locale`);
    return;
  }
  const author = await resolveAuthor(fm.author);
  const svg = await satori(card({ title: fm.title || fm.slug, author }), {
    width: 1200,
    height: 630,
    fonts,
  });
  const png = new Resvg(svg).render().asPng();
  const outPath = resolve(OUT_DIR, `${fm.slug}-${fm._locale}.png`);
  await writeFile(outPath, png);
  console.log(`✔ ${outPath}`);
}

// ── Resolve input files ──────────────────────────────────────────────────────
async function resolveInputs(argv) {
  if (argv.length) {
    return argv
      .map((p) => (isAbsolute(p) ? p : resolve(process.cwd(), p)))
      .filter((p) => p.endsWith('.md') && p.includes('content/blog'));
  }
  const entries = await readdir(BLOG_DIR);
  return entries
    .filter((e) => e.endsWith('.md'))
    .map((e) => resolve(BLOG_DIR, e));
}

const files = await resolveInputs(process.argv.slice(2));
if (!files.length) {
  console.log('No blog posts to render.');
  process.exit(0);
}
await mkdir(OUT_DIR, { recursive: true });
for (const f of files) await render(f);
