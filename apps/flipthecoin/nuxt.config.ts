// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  router: {
    options: {
      linkActiveClass: 'active',
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { prerender: true },
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
  },
  compatibilityDate: '2025-01-10',
  modules: [
    'nitro-cloudflare-dev',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxt/fonts',
  ],
  mdc: {
    components: {
      map: {
        h1: 'FTitle',
        h2: 'FTitleH2',
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
});
