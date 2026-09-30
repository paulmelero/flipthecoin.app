import svgLoader from 'vite-svg-loader';
import { fileURLToPath } from 'node:url';
import { readdirSync, readFileSync } from 'node:fs';
import { rehypeKatexClassify } from './app/lib/mdc/rehypeKatexClassify';

// Blog drafts (`published: false`) must not ship as static pages. The
// `/blog/**` route rule would prerender every slug, and the page-level guard in
// pages/blog/[post].vue returns a 404 for drafts — which would abort the build.
// So we remove draft routes from the prerender set here; the SSR fallback still
// hits the guard, so a draft URL 404s at runtime too.
function draftBlogRoutes(): string[] {
  const dir = fileURLToPath(new URL('./content/blog', import.meta.url));
  const routes: string[] = [];
  for (const file of readdirSync(dir)) {
    const match = file.match(/^(.+)\.(en|es)\.md$/);
    if (!match) continue;
    const [, , locale] = match;
    const source = readFileSync(
      new URL(`./content/blog/${file}`, import.meta.url),
      'utf8',
    );
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1];
    if (!frontmatter) continue;
    if (!/^published:\s*false\s*$/m.test(frontmatter)) continue;
    const slug = frontmatter
      .match(/^slug:\s*(.+)$/m)?.[1]
      ?.trim()
      .replace(/^['"]|['"]$/g, '');
    if (!slug) continue;
    routes.push(locale === 'es' ? `/es/blog/${slug}` : `/blog/${slug}`);
  }
  return routes;
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    rehypeKatexClassify: fileURLToPath(
      new URL('./app/lib/mdc/rehypeKatexClassify.ts', import.meta.url),
    ),
  },
  css: [
    '~/assets/css/main.css',
    'katex/dist/katex.min.css',
    '~/assets/css/prose-reset.css',
    '~/assets/css/katex-reset.css',
  ],
  vite: {
    plugins: [
      svgLoader({
        defaultImport: 'component',
        svgoConfig: {
          plugins: [{ name: 'preset-default' }, { name: 'prefixIds' }],
        },
      }),
    ],
    resolve: {
      alias: {
        '@brand': fileURLToPath(new URL('./public', import.meta.url)),
      },
    },
    optimizeDeps: {
      include: [
        'gsap',
        'gsap/ScrollTrigger',
        'three',
        'cannon-es',
        'three/addons/controls/OrbitControls.js',
        'three/addons/geometries/TextGeometry.js',
        'three/addons/loaders/FontLoader.js',
      ],
    },
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16.png',
        },
        { rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [
        { name: 'theme-color', content: '#f5b806' },
        { name: 'msapplication-TileImage', content: '/mstile-150x150.png' },
        { name: 'msapplication-TileColor', content: '#f5b806' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'Flip The Coin' },
      ],
    },
  },
  router: {
    options: {
      linkActiveClass: 'active',
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/extension': { prerender: true },
    '/privacy-policy': { prerender: true },
    '/terms': { prerender: true },
    '/about-us': { prerender: true },
    '/blog/**': { prerender: true },
    '/glossary/**': { prerender: true },
    '/sitemap.xml': { prerender: true },
    '/robots.txt': { prerender: true },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: '.',
      },
    },
  },
  devtools: {
    enabled: true,
  },
  watch: ['!./content/**/.*.md'],
  runtimeConfig: {
    public: {
      siteUrl: '', // mapped from NUXT_PUBLIC_SITE_URL; required on Workers
    },
  },
  nitro: {
    preset: 'cloudflare-module',
    // The FS payload cache stores a route's payload at its URL path, so the
    // `/glossary` index (file) collides with `/glossary/<term>` (directory)
    // and throws ENOTDIR. Memory storage in dev avoids the collision; dev-only.
    devStorage: {
      'cache:nuxt:payload': { driver: 'memory' },
    },
    cloudflareDev: {
      configPath: './wrangler.toml',
    },
    prerender: {
      crawlLinks: true,
      // Skip invalid double-locale paths and locale-prefixed API routes: the
      // i18n module mirrors `prerender.routes` under /es, but the glossary API
      // isn't localized, so /es/api/glossary/* 404s. The canonical
      // /api/glossary/{en,es} (what useGlossary fetches) still prerenders.
      // Also skip the auth-guarded profile page: prerendering it records the
      // logged-out redirect as a static stub, which would break the page for
      // signed-in users. It must stay an on-demand SSR route.
      ignore: [
        /^\/(en|es)\/(en|es)(\/|$)/,
        /^\/(en|es)\/api\//,
        /^\/(es\/)?profile\/?$/,
        // Drafts (`published: false`) are skipped so their intentional 404
        // does not abort prerendering; the page guard still 404s them at runtime.
        ...draftBlogRoutes(),
      ],
      // Glossary index JSON is fetched client-side on hover, so it is never
      // crawled from a link — list it explicitly so it ships as a static asset.
      routes: ['/api/glossary/en', '/api/glossary/es'],
    },
  },
  compatibilityDate: '2026-08-14',
  modules: [
    'nitro-cloudflare-dev',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxt/fonts',
    'nuxt-i18n-micro',
    '@nuxtjs/better-auth', // also auto-added by @graficos/nuxt-comments
    '@graficos/nuxt-comments',
  ],
  comments: {
    database: { binding: 'DB' },
    auth: { database: { binding: 'DB' } }, // D1-backed Better Auth (opt-in)
    components: { prefix: '' }, // <Comments> instead of <NuxtComments>
    reactions: { enabled: true, types: ['like'] },
  },
  auth: {
    // No dedicated login page: send guarded routes home instead of a 404.
    redirects: { login: '/' },
  },
  mdc: {
    components: {
      map: {
        h1: 'FTitle',
        h2: 'FTitleH2',
        h3: 'FTitleH3',
      },
    },
  },
  content: {
    database: {
      type: 'd1',
      bindingName: 'cf_d1_flipthecoin_content',
    },
    build: {
      markdown: {
        remarkPlugins: {
          'remark-math': {},
        },
        rehypePlugins: {
          'rehype-katex': {},
          rehypeKatexClassify: { instance: rehypeKatexClassify },
        },
      },
    },
  },
  fonts: {
    families: [
      {
        name: 'Fira Sans',
        provider: 'google',
        weight: 300,
      },
      {
        name: 'Archivo',
        provider: 'google',
        variationSettings: "'wdth' 125",
        weight: 500,
      },
    ],
  },
  colorMode: {
    preference: 'system', // default theme
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
  i18n: {
    locales: [
      { code: 'en', name: 'English', iso: 'en-US' },
      { code: 'es', name: 'Español', iso: 'es-ES' },
    ],
    defaultLocale: 'en',
    translationDir: 'app/locales',
    // Persist the chosen locale so redirect logic doesn't flip users back
    // (recommended for prefix strategies with redirects).
    localeCookie: 'user-locale',
  },
});
