// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nitro-cloudflare-dev'],
  ui: {
    icons: ['octicon'],
  },
  watch: ['./coin/index.ts'],
  nitro: {
    preset: 'cloudflare-module',
  },
  compatibilityDate: '2025-01-10',
});
