<template>
  <v-app class="pixel-font">
    <v-app-bar class="gba-app-bar" flat>
      <v-toolbar-title class="d-flex align-center gba-title">
        <img src="/images/pokeball-pixel.png" alt="Pokeball pixel" style="height:2.2em;margin-right:0.5em;vertical-align:middle;" />
        <span class="gba-title-text gba-title-pixel">Favoritos</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" variant="outlined" color="yellow" class="pixel-font"><v-icon left>mdi-arrow-left</v-icon> Volver</v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="py-6">
        <v-row>
          <v-col cols="12" class="mb-4">
            <v-alert type="info" variant="tonal" border="start" prominent>
              <v-alert-title>Pokémon Favoritos</v-alert-title>
              <div>Se almacenan en LocalStorage. Puedes marcarlos desde la vista principal.</div>
            </v-alert>
          </v-col>
        </v-row>
        <v-row v-if="favorites.length === 0">
          <v-col cols="12" class="text-center">
            <v-chip color="red" class="ma-2" size="large" variant="elevated">Sin favoritos aún</v-chip>
            <p class="text-caption">Ve a la Pokeguía y marca algunos con el corazón.</p>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col v-for="p in favoriteDetails" :key="p.id" cols="12" md="6" lg="4">
            <v-card 
              rounded="xl" 
              :style="{border:'3px solid '+(typeColor(p))}" 
              class="pa-3 fav-card" 
              elevation="4"
              @touchstart="onTouchStart($event, p.id)"
              @touchmove="onTouchMove"
              @touchend="onTouchEnd(p.id)"
            >
              <div class="d-flex align-center mb-2">
                <v-avatar size="64" class="mr-3">
                  <v-img :src="`/images/pokemon-${p.id}.png`"></v-img>
                </v-avatar>
                <div>
                  <h4 class="text-subtitle-1 mb-1">{{ p.name.toUpperCase() }} <v-chip size="x-small" color="red">#{{ p.id }}</v-chip></h4>
                  <div class="d-flex flex-wrap">
                    <v-chip v-for="t in p.types" :key="t.type.name" size="x-small" class="mr-1 mb-1" :style="{backgroundColor: store.typeColors[t.type.name] || '#666', color:'#fff'}">{{ t.type.name }}</v-chip>
                  </div>
                </div>
                <v-spacer></v-spacer>
                <v-btn icon size="small" color="pink" @click="unfav(p.id)"><v-icon>mdi-heart-off</v-icon></v-btn>
              </div>
              <v-divider class="my-2" />
              <div class="stats-grid">
                <div v-for="s in p.stats" :key="s.stat.name" class="stat-item">
                  <span class="stat-name">{{ s.stat.name }}</span>
                  <v-progress-linear :model-value="s.base_stat" :max="200" height="6" rounded color="deep-purple" class="mt-1" />
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import axios from 'axios'
import { usePokemonStore } from '../store/pokemon'
export default {
  name: 'FavoritesView',
  setup() {
    const store = usePokemonStore()
    return { store }
  },
  data() {
    return {
      favoriteDetails: [],
      loadingFavs: false,
      touchStartX: 0,
      touchCurrentX: 0,
      swiping: false,
      swipeThreshold: 100
    }
  },
  computed: {
    favorites() { return this.store.favorites }
  },
  watch: {
    favorites: {
      immediate: true,
      handler() { this.loadFavorites() }
    }
  },
  methods: {
    async loadFavorites() {
      if (this.favorites.length === 0) { this.favoriteDetails = []; return }
      this.loadingFavs = true
      try {
        const pending = this.favorites.map(id => this.fetchDetail(id))
        const results = await Promise.all(pending)
        this.favoriteDetails = results.filter(Boolean)
      } finally { this.loadingFavs = false }
    },
    async fetchDetail(id) {
      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        return data
      } catch { return null }
    },
    unfav(id) { this.store.toggleFavorite(id); },
    typeColor(p) { return this.store.typeColors[p.types?.[0]?.type?.name] || '#764ba2' },
    onTouchStart(e, id) {
      this.touchStartX = e.touches[0].clientX
      this.swiping = true
    },
    onTouchMove(e) {
      if (!this.swiping) return
      this.touchCurrentX = e.touches[0].clientX
      const delta = this.touchCurrentX - this.touchStartX
      e.currentTarget.style.transform = `translateX(${delta}px)`
      e.currentTarget.style.opacity = 1 - Math.abs(delta) / 300
    },
    onTouchEnd(id) {
      if (!this.swiping) return
      const delta = this.touchCurrentX - this.touchStartX
      if (Math.abs(delta) > this.swipeThreshold) {
        this.unfav(id)
      }
      event.currentTarget.style.transform = ''
      event.currentTarget.style.opacity = ''
      this.swiping = false
      this.touchStartX = 0
      this.touchCurrentX = 0
    }
  }
}
</script>
<style scoped>
.pixel-font, .gba-title-text, .gba-title-pixel, .v-btn, .v-card-title, .v-card-text, .v-chip, .v-toolbar-title, .text-caption, .text-subtitle-1, .text-subtitle-2, .text-h5, .text-h6, .text-h4, .text-h3, .text-h2, .text-h1 {
  font-family: 'Press Start 2P', monospace !important;
  letter-spacing: 0.5px;
}
body, .v-application {
  background: linear-gradient(180deg, #1e2a78 0%, #3a8dde 100%) fixed !important;
  min-height: 100vh;
  background-attachment: fixed;
}
body::before, .v-application::before {
  content: "";
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  background: repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 8px);
  z-index: 0;
}
.stats-grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(120px,1fr)); gap:8px; }
.stat-item { background:rgba(255,255,255,0.4); padding:6px 8px; border-radius:8px; }
.stat-name { font-size:11px; font-weight:600; text-transform:capitalize; }

.fav-card {
  transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
  cursor: grab;
}
.fav-card:active {
  cursor: grabbing;
}
.fav-card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  transform: translateY(-4px);
}
</style>
