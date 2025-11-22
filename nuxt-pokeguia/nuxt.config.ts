// Nuxt 3 configuration for parallel Pokeguía
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  css: ['vuetify/styles'],
  build: { transpile: ['vuetify'] },
  app: {
    head: {
      title: 'Pokeguía Nuxt - Hoenn',
      meta: [
        { name: 'description', content: 'Pokedex Hoenn con Nuxt, Vuetify y Pinia' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#764ba2' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  pinia: {
    autoImports: ['defineStore']
  },
  typescript: { shim: false },
  compatibilityDate: '2024-10-01'
})
