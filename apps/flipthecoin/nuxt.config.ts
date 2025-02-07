// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['nitro-cloudflare-dev', '@nuxt/ui', '@nuxt/content'],
  ui: {},
  watch: ['./coin/index.ts'],
  nitro: {
    preset: 'cloudflare-module',
  },
  content: {
    database: {
      type: 'd1',
      bindingName: 'cf_d1_flipthecoin_content',
    },
  },
  compatibilityDate: '2025-01-10',
});
