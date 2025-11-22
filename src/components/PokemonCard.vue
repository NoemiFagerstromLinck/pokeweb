<template>
  <v-card class="pokemon-card" rounded="xl" elevation="6">
    <v-row no-gutters align="center" class="pa-3">
      <v-col cols="auto" class="pr-3">
        <div class="pokemon-id">#{{ id }}</div>
      </v-col>
      <v-col cols="auto" class="pr-3 position-relative">
        <v-avatar :class="['cry-avatar', { 'cry-playing': isCryPlaying }]" size="64">
          <img 
            :src="pokemonImage" 
            :alt="nombre"
            :data-pokemon-id="id"
            class="pokemon-sprite"
            @error="handleImageError"
            loading="lazy"
            @click.stop="emitSelection"
          />
        </v-avatar>
        <v-btn
          class="cry-btn"
          size="x-small"
          variant="flat"
          color="red"
          :loading="loadingCry"
          :disabled="loadingCry"
          @click.stop="playCry"
          :title="cryAvailable ? 'Reproducir cry clásico' : 'Intentar reproducir cry'"
        >
          <v-icon v-if="!isCryPlaying">mdi-volume-high</v-icon>
          <v-icon v-else>mdi-volume-off</v-icon>
        </v-btn>
      </v-col>
      <v-col class="py-0" @click="emitSelection" style="cursor:pointer">
        <h6 class="pokemon-name mb-1">{{ capitalizedName }}</h6>
        <p class="pokemon-description mb-1">{{ descripcion }}</p>
        <small class="region-text">Pokémon de la región Hoenn</small>
      </v-col>
      <v-col cols="auto" class="text-end">
        <v-chip color="red" variant="elevated" size="small" class="ruby-text" @click.stop="emitSelection">INFO</v-chip>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { getSpecificPokemonImage, getAlternativeUrls } from '../data/pokemonImages.js'

// Cache simple en módulo para evitar múltiples peticiones por ID
const cryCache = {}

export default {
  name: 'PokemonCard',
  props: {
    id: {
      type: String,
      required: true
    },
    nombre: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isCryPlaying: false,
      loadingCry: false
    }
  },
  computed: {
    capitalizedName() {
      return this.nombre.charAt(0).toUpperCase() + this.nombre.slice(1)
    },
    pokemonImage() {
      return getSpecificPokemonImage(this.id)
    }
  },
  methods: {
    emitSelection() {
      this.$emit('pokemon-selected', { id: this.id, nombre: this.nombre, descripcion: this.descripcion })
    },
    handleImageError(event) {
      const currentSrc = event.target.src
      const id = event.target.getAttribute('data-pokemon-id') || this.id
      
      const alternativeSources = getAlternativeUrls(id)
      
      const allSources = [
        ...alternativeSources,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        `https://img.pokemondb.net/sprites/ruby-sapphire/normal/${this.nombre}.png`,
        'data:image/svg+xml;base64,' + btoa(this.createDefaultSprite(id))
      ]
      
      let nextUrl = null
      for (let i = 0; i < allSources.length; i++) {
        if (allSources[i] !== currentSrc) {
          const triedUrls = event.target.getAttribute('data-tried-urls') || ''
          if (!triedUrls.includes(allSources[i])) {
            nextUrl = allSources[i]
            break
          }
        }
      }
      
      if (nextUrl) {
        const triedUrls = event.target.getAttribute('data-tried-urls') || ''
        event.target.setAttribute('data-tried-urls', triedUrls + '|' + currentSrc)
        event.target.src = nextUrl
      } else {
        event.target.src = 'data:image/svg+xml;base64,' + btoa(this.createDefaultSprite(id))
      }
    },
    createDefaultSprite(id) {
      return `
        <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="redGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#DC143C;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FFA500;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <circle cx="32" cy="32" r="30" fill="url(#redGrad)" stroke="#8B0000" stroke-width="2"/>
          <path d="M 2 32 L 62 32" stroke="#2C1810" stroke-width="3"/>
          <circle cx="32" cy="32" r="8" fill="url(#goldGrad)" stroke="#8B0000" stroke-width="2"/>
          <circle cx="32" cy="32" r="4" fill="white" stroke="#8B0000" stroke-width="1"/>
          
          <text x="32" y="18" font-family="Courier New, monospace" font-size="7" 
                text-anchor="middle" fill="white" font-weight="bold" 
                stroke="#8B0000" stroke-width="0.5">
            #${id.toString().padStart(3, '0')}
          </text>
          <text x="32" y="48" font-family="Courier New, monospace" font-size="6" 
                text-anchor="middle" fill="white" font-weight="bold"
                stroke="#8B0000" stroke-width="0.5">
            ${this.nombre.toUpperCase().substring(0, 7)}
          </text>
        </svg>
      `
    }
    ,
    async playCry() {
      if (this.isCryPlaying) return
      this.loadingCry = true
      try {
        const url = await this.getCryUrl()
        if (url) {
          await this.playAudio(url)
        } else {
          this.playFallbackSynth()
        }
      } catch (e) {
        this.playFallbackSynth()
      } finally {
        this.loadingCry = false
      }
    },
    async getCryUrl() {
      if (cryCache[this.id]) return cryCache[this.id]
      const numericId = parseInt(this.id, 10)
      if (isNaN(numericId)) return null

      // Posibles rutas (repositorio oficial de cries de PokeAPI)
      const base = 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon'
      const candidates = [
        `${base}/legacy/${numericId}.ogg`,
        `${base}/latest/${numericId}.ogg`
      ]

      for (const url of candidates) {
        try {
          const head = await fetch(url, { method: 'HEAD' })
          if (head.ok) {
            cryCache[this.id] = url
            return url
          }
        } catch (_) { /* ignore */ }
      }
      return null
    },
    playAudio(src) {
      return new Promise((resolve) => {
        try {
          const audio = new Audio(src)
          audio.crossOrigin = 'anonymous'
          audio.volume = 0.7
          this.isCryPlaying = true
          audio.onended = () => { this.isCryPlaying = false; resolve() }
          audio.onerror = () => { this.isCryPlaying = false; resolve() }
          audio.play().catch(() => { this.isCryPlaying = false; resolve() })
        } catch (e) {
          this.isCryPlaying = false
          resolve()
        }
      })
    },
    playFallbackSynth() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'square'
        const baseFreq = 440 + (parseInt(this.id,10) % 200)
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime)
        // simple pitch envelope
        osc.frequency.linearRampToValueAtTime(baseFreq * 1.4, ctx.currentTime + 0.15)
        osc.frequency.linearRampToValueAtTime(baseFreq * 0.7, ctx.currentTime + 0.35)
        gain.gain.setValueAtTime(0.0001, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5)
        osc.connect(gain).connect(ctx.destination)
        this.isCryPlaying = true
        osc.start()
        osc.stop(ctx.currentTime + 0.5)
        osc.onended = () => { this.isCryPlaying = false; ctx.close() }
      } catch (e) {
        this.isCryPlaying = false
      }
    }
  }
}
</script>

<style scoped>
.pokemon-card {
  background: linear-gradient(145deg, #FFEAA7, #FDCB6E);
  border: 3px solid #8B4513;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.pokemon-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}
.pokemon-card:hover::before { left: 100%; }
.pokemon-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 12px 35px rgba(139,69,19,0.6); border-color:#DC143C; }
.pokemon-sprite { width:64px; height:64px; object-fit:contain; filter:drop-shadow(2px 2px 6px rgba(0,0,0,0.5)); transition:transform .3s ease; }
.pokemon-card:hover .pokemon-sprite { transform:scale(1.1) rotate(5deg); }
.pokemon-id { background:linear-gradient(145deg,#DC143C,#8B0000); color:#FFD700; font-weight:bold; padding:8px 12px; border-radius:8px; border:2px solid #FFD700; font-family:'Courier New',monospace; font-size:.9rem; text-shadow:1px 1px 3px rgba(0,0,0,.8); }
.pokemon-name { color:#654321; font-weight:bold; font-size:1.1rem; text-shadow:1px 1px 3px rgba(255,255,255,.8); font-family:'Courier New',monospace; text-transform:capitalize; }
.pokemon-description { color:#654321; font-size:.85rem; line-height:1.3; text-shadow:1px 1px 2px rgba(255,255,255,.6); }
.ruby-text { color:#FFD700 !important; font-weight:bold; text-shadow:2px 2px 4px rgba(0,0,0,.8); }
.region-text { color:#654321; font-weight:600; text-shadow:1px 1px 2px rgba(255,255,255,.8); font-family:'Courier New',monospace; }
.cry-btn {
  position:absolute;
  top:-4px;
  right:-4px;
  min-width:28px;
  height:28px;
  box-shadow:0 2px 6px rgba(0,0,0,0.4);
}
.cry-avatar {
  transition:transform .35s ease, filter .35s ease;
}
.cry-playing {
  animation: cryPulse .6s infinite;
  filter: drop-shadow(0 0 8px rgba(255,215,0,0.7));
}
@keyframes cryPulse {
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.15) rotate(3deg); }
}
@media (max-width:576px){
  .pokemon-sprite{width:48px;height:48px}
  .pokemon-name{font-size:.95rem}
  .pokemon-id{padding:6px 8px;font-size:.8rem}
  .pokemon-description{font-size:.75rem}
}
</style>
