import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Set base to your repository name for GitHub Pages
  // Example site URL: https://NoemiFagerstromLinck.github.io/Bootcamp-frontend-unab/
  base: '/Bootcamp-frontend-unab/',
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