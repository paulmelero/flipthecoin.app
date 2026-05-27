import svgLoader from 'vite-svg-loader';
import { fileURLToPath } from 'node:url';
import { rehypeKatexClassify } from './app/lib/mdc/rehypeKatexClassify';

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
  nitro: {
    preset: 'cloudflare-module',
    cloudflareDev: {
      configPath: './wrangler.toml',
    },
    prerender: {
      crawlLinks: true,
      ignore: [/^\/(en|es)\/(en|es)(\/|$)/],
    },
  },
  compatibilityDate: '2025-01-10',
  modules: [
    'nitro-cloudflare-dev',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxt/fonts',
    'nuxt-i18n-micro',
  ],
  mdc: {
    components: {
      map: {
        h1: 'FTitle',
        h2: 'FTitleH2',
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
  },
});
