// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  routeRules: {
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
    '@nuxtjs/mdc',
    '@nuxt/fonts',
  ],
  mdc: {
    components: {
      map: {
        h1: 'ContentFTitle',
        h2: 'ContentFTitleH2',
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
        name: 'IBM Plex Mono',
        provider: 'google',
        weight: 400,
      },
    ],
  },
  colorMode: {
    preference: 'system', // default theme
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
});
