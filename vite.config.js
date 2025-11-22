import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Base path for GitHub Pages deployment of Pokeweb
  // Example: https://NoemiFagerstromLinck.github.io/Pokeweb/
  base: '/Pokeweb/',
  plugins: [vue()],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  server: {
    port: 3000,
    host: true
  }
})