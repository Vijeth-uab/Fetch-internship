// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ["primevue/resources/themes/lara-light-blue/theme.css"],
  build: {
    transpile: ["primevue"]
  },
  devtools: { enabled: true }
})
