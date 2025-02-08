// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: '.',
      },
    },
  },
  watch: ['!./content/**/.*.md'],
  nitro: {
    preset: 'cloudflare-module',
    cloudflareDev: {
      configPath: './wrangler.toml',
    },
  },
  compatibilityDate: '2025-01-10',
  modules: ['nitro-cloudflare-dev', '@nuxt/ui', '@nuxtjs/mdc'],
  mdc: {
    components: {
      map: {
        h1: 'ContentFTitle',
      },
    },
  },
});
