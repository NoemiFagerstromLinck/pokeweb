<template>
  <v-app class="pixel-font">
    <img src="/images/pikachu-pixel.png" alt="Pikachu travieso" class="pikachu-mascot" />
    <v-app-bar class="gba-app-bar" flat>
      <!-- Pokeball pixel PNG solo dentro del título -->
      <v-toolbar-title class="d-flex align-center gba-title">
        <img src="/images/pokeball-pixel.png" alt="Pokeball pixel" style="height: 2.2em; margin-right: 0.5em; vertical-align: middle;" />
        <span class="gba-title-text gba-title-pixel">Pokeguía</span>
        <img src="/images/pikachu-pixel.png" alt="Pikachu pixel" class="pixelart-deco pixelart-deco-right" />
        <v-chip v-if="dominantType" size="small" class="ml-2 text-capitalize gba-type-chip" :style="{backgroundColor: dominantColor, color:'#fff', fontFamily: 'monospace'}">{{ dominantType }}</v-chip>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/explorar" class="gba-menu-btn">
        <v-icon left size="small">mdi-grid</v-icon>
        <span class="d-none d-sm-inline">Explorar</span>
      </v-btn>
      <v-btn to="/favoritos" class="gba-menu-btn">
        <v-icon left size="small">mdi-heart</v-icon>
        <span class="d-none d-sm-inline">Favoritos</span>
      </v-btn>
      <v-btn to="/equipo" class="gba-menu-btn">
        <v-icon left size="small">mdi-account-group</v-icon>
        <span class="d-none d-sm-inline">Equipo</span>
      </v-btn>
      <v-btn to="/comparar" class="gba-menu-btn">
        <v-icon left size="small">mdi-compare</v-icon>
        <span class="d-none d-sm-inline">Comparar</span>
      </v-btn>
      <ThemeToggle class="mr-2" />
      <v-btn v-if="pokemon" size="small" class="gba-fav-btn" @click="toggleFavorite">
        <v-icon left>{{ isFav ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        {{ isFav ? 'Favorito' : 'Marcar' }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-6">
        <v-row justify="center">
          <v-col cols="12">
            <v-card elevation="12" class="gba-main-card animate-pop" style="max-width:1200px;margin:auto;">
              <v-card-title class="gba-main-title">
                <v-icon left size="large" color="#fff">mdi-magnify</v-icon>
                <span class="gba-main-title-text gba-title-pixel">Buscador de Pokémon</span>
              </v-card-title>
              <v-card-text class="pa-8 gba-main-content">
                <FilterPanel @update:filters="applyFilters" class="mb-6" />
                <v-autocomplete
                  v-model="query"
                  :items="filteredSuggestions"
                  label="Buscar Pokémon"
                  placeholder="Ejemplo: pikachu, charizard..."
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-pokemon-go"
                  clearable
                  @update:search="filterSuggestions"
                  @keyup.enter="searchPokemon"
                  class="mb-4"
                  no-data-text="No hay sugerencias"
                ></v-autocomplete>

                <div class="text-center my-6">
                  <v-btn
                    class="gba-search-btn animate-pop"
                    size="x-large"
                    @click="searchPokemon"
                    :loading="loading"
                    prepend-icon="mdi-pokeball"
                  >
                    Buscar
                  </v-btn>
                </div>

                <v-card v-if="!pokemon && !loading" class="gba-suggestions-card animate-fade-in">
                  <v-card-text>
                    <p class="gba-suggestions-title">
                      <v-icon left color="#fff">mdi-lightbulb-outline</v-icon>
                      Sugerencias:
                    </p>
                    <div v-if="filterLoading" class="text-center py-2">
                      <v-progress-circular indeterminate color="#1976D2" />
                    </div>
                    <template v-else>
                      <div v-if="filteredSuggestions.length === 1 && filteredSuggestions[0].startsWith('No hay Pokémon con esos filtros')" class="my-4">
                        <span class="font-weight-bold px-2" style="font-family: 'monospace'; font-size: 1.2em; color: #444; background: #fffbe6; border-radius: 6px; border: 1px solid #e0e0e0;">{{ filteredSuggestions[0] }}</span>
                      </div>
                      <v-chip-group v-else>
                        <v-chip
                          v-for="suggestion in filteredSuggestions"
                          :key="suggestion"
                          @click="query = suggestion; searchPokemon()"
                          @contextmenu.prevent="showQuickView(suggestion)"
                          class="ma-2 gba-suggestion-chip animate-pop"
                          :style="{fontFamily: 'monospace'}"
                        >
                          {{ suggestion }}
                        </v-chip>
                      </v-chip-group>
                    </template>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <transition name="fade-slide">
          <v-row v-if="loading" justify="center" class="mt-4">
            <v-col cols="12" md="8" lg="6">
              <v-card elevation="5" class="pa-4 shimmer-card" rounded="xl">
                <v-skeleton-loader type="heading" class="mb-4" />
                <v-skeleton-loader type="image" class="mb-4" :height="200" />
                <v-skeleton-loader type="paragraph" class="mb-2" />
                <v-skeleton-loader type="paragraph" class="mb-2" />
                <v-skeleton-loader type="list-item-two-line" class="mb-2" v-for="n in 3" :key="n" />
              </v-card>
            </v-col>
          </v-row>
        </transition>
        <transition name="fade-slide">
          <v-row v-if="!loading && pokemon" justify="center" class="mt-4">
          <v-col cols="12" lg="10" xl="9">
            <v-card elevation="8" :style="{ border: '4px solid ' + dominantColor }" class="pokemon-card" rounded="xl">
              <v-card-title class="text-h5 text-center py-4" :style="gradientHeader">
                <v-icon left color="yellow" size="large">mdi-star</v-icon>
                {{ pokemon.name.toUpperCase() }}
                <v-chip class="ml-2" color="red" size="small">#{{ pokemon.id }}</v-chip>
                <v-chip v-if="dominantType" class="ml-2 text-capitalize" :style="{ backgroundColor: dominantColor, color: '#fff' }" size="small">{{ dominantType }}</v-chip>
              </v-card-title>

              <v-card-text class="pa-4">
                <v-row>
                  <!-- Columna izquierda: Imagen y acciones -->
                  <v-col cols="12" md="5" class="text-center">
                    <v-avatar size="220" class="mb-3 pokemon-avatar elevation-8">
                      <v-img :src="`/images/pokemon-${pokemon.id}.png`" :alt="pokemon.name" :lazy-src="placeholderImg"></v-img>
                    </v-avatar>
                    
                    <div class="d-flex justify-center gap-2 mb-4 flex-wrap">
                      <v-btn size="small" color="blue" variant="tonal" @click="addToComparator" prepend-icon="mdi-compare">
                        Comparar
                      </v-btn>
                      <v-btn size="small" color="green" variant="tonal" @click="addToTeamQuick" prepend-icon="mdi-account-multiple-plus">
                        Al Equipo
                      </v-btn>
                      <v-btn size="small" color="purple" variant="tonal" @click="sharePokemon" prepend-icon="mdi-share-variant">
                        Compartir
                      </v-btn>
                    </div>

                    <!-- Stats -->
                    <v-card variant="elevated" rounded="lg" class="pa-3 mb-3 hc-card">
                      <div class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center justify-center">
                        <v-icon size="small" color="indigo" class="mr-1">mdi-chart-bar</v-icon>
                        Estadísticas Base
                      </div>
                      <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="mb-2">
                        <div class="d-flex justify-space-between align-center mb-1">
                          <span class="text-body-2 font-weight-bold text-capitalize">{{ translateStat(stat.stat.name) }}</span>
                          <v-chip size="x-small" :color="getStatColor(stat.base_stat)" variant="flat" class="font-weight-black">
                            {{ stat.base_stat }}
                          </v-chip>
                        </div>
                        <v-progress-linear 
                          :model-value="stat.base_stat" 
                          :max="255" 
                          height="10" 
                          rounded
                          :color="getStatColor(stat.base_stat)"
                        >
                          <template v-slot:default="{ value }">
                            <strong class="text-white" style="font-size: 10px;">{{ Math.ceil(value) }}</strong>
                          </template>
                        </v-progress-linear>
                      </div>
                      <v-divider class="my-3" />
                      <div class="d-flex justify-space-between align-center">
                        <span class="text-subtitle-2 font-weight-bold hc-strong">Total:</span>
                        <v-chip color="deep-purple" variant="flat" class="font-weight-black">{{ totalStats }}</v-chip>
                      </div>
                      <!-- Cadena Evolutiva -->
                      <v-card v-if="evolutionChain.length > 0" variant="outlined" rounded="lg" class="pa-3 mt-3 hc-chain">
                        <div class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center justify-center hc-muted">
                          <v-icon size="small" color="grey-darken-1" class="mr-1">mdi-chart-timeline-variant</v-icon>
                          Cadena Evolutiva
                        </div>
                        <div class="d-flex justify-center align-center flex-wrap gap-2">
                          <div v-for="(evo, idx) in evolutionChain" :key="evo.name" class="d-flex align-center">
                            <v-card 
                              :class="{'evolution-current': evo.name === pokemon.name, 'evolution-card': true}"
                              :variant="evo.name === pokemon.name ? 'elevated' : 'tonal'"
                              :color="evo.name === pokemon.name ? 'white' : 'grey-lighten-4'"
                              rounded="lg"
                              class="pa-2 text-center"
                              width="100"
                              @click="evo.name !== pokemon.name && (query = evo.name, searchPokemon())"
                              :style="{ cursor: evo.name !== pokemon.name ? 'pointer' : 'default', opacity: evo.name === pokemon.name ? 1 : 0.6 }"
                            >
                              <v-avatar size="60" class="mb-1">
                                <v-img :src="`/images/pokemon-${evo.id}.png`" />
                              </v-avatar>
                              <div class="text-caption font-weight-bold text-capitalize">{{ evo.name }}</div>
                              <v-chip size="x-small" color="grey" variant="flat" class="mt-1">#{{ evo.id }}</v-chip>
                            </v-card>
                            <v-icon v-if="idx < evolutionChain.length - 1" color="grey" class="mx-1">mdi-arrow-right</v-icon>
                          </div>
                        </div>
                      </v-card>
                      
                    </v-card>

                    <!-- Características físicas -->
                    <v-card variant="elevated" rounded="lg" class="pa-3 hc-card">
                      <div class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center justify-center">
                        <v-icon size="small" color="teal" class="mr-1">mdi-information</v-icon>
                        Características
                      </div>
                      <v-row dense>
                        <v-col cols="6">
                          <div class="text-center">
                            <v-icon color="orange">mdi-human-male-height</v-icon>
                            <div class="text-body-2 hc-muted">Altura</div>
                            <div class="font-weight-bold hc-strong">{{ (pokemon.height / 10).toFixed(1) }} m</div>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="text-center">
                            <v-icon color="green">mdi-weight</v-icon>
                            <div class="text-body-2 hc-muted">Peso</div>
                            <div class="font-weight-bold hc-strong">{{ (pokemon.weight / 10).toFixed(1) }} kg</div>
                          </div>
                        </v-col>
                        <v-col cols="12" v-if="pokemonDescription" class="mt-2">
                          <v-divider class="mb-2" />
                          <div class="text-body-2 description-text">{{ pokemonDescription }}</div>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>

                  <!-- Columna derecha: Habilidades y Movimientos -->
                  <v-col cols="12" md="7">
                    <!-- Habilidades -->
                    <v-card variant="outlined" rounded="lg" class="mb-3 pa-3">
                      <div class="text-h6 font-weight-bold mb-3 d-flex align-center">
                        <v-icon color="purple" class="mr-2">mdi-shield-star</v-icon>
                        Habilidades
                      </div>
                      <div class="d-flex flex-wrap gap-2">
                        <v-tooltip
                          v-for="ability in abilities"
                          :key="ability"
                          :text="abilityDetails[ability]?.effect || 'Click para cargar efecto'"
                          location="top"
                        >
                          <template #activator="{ props }">
                            <v-chip
                              v-bind="props"
                              class="text-capitalize"
                              :color="abilityDetails[ability] ? 'purple' : 'purple-darken-3'"
                              variant="elevated"
                              @click="fetchAbilityDetail(ability)"
                            >
                              <v-icon start>mdi-shield</v-icon>{{ ability }}
                            </v-chip>
                          </template>
                        </v-tooltip>
                      </div>
                      <div v-if="abilityLoading" class="text-caption mt-2 text-center">
                        <v-progress-circular indeterminate size="16" width="2" />
                        Cargando...
                      </div>
                    </v-card>

                    <!-- Movimientos -->
                    <v-card variant="outlined" rounded="lg" class="pa-3">
                      <div class="text-h6 font-weight-bold mb-3 d-flex align-center">
                        <v-icon color="orange" class="mr-2">mdi-flash</v-icon>
                        Movimientos (primeros 10)
                      </div>
                      <div v-if="moveDetailsLoading" class="text-center py-4">
                        <v-progress-circular indeterminate color="orange" size="48"></v-progress-circular>
                      </div>
                      <v-expansion-panels v-else variant="accordion" class="move-panels">
                        <v-expansion-panel
                          v-for="detail in moveDetails"
                          :key="detail.name"
                        >
                          <v-expansion-panel-title class="py-2">
                            <div class="d-flex align-center flex-wrap gap-2">
                              <v-chip :style="{ backgroundColor: TYPE_COLORS[detail.type] || '#999', color: '#fff' }" size="small">
                                <v-icon size="16" class="mr-1">{{ detail.damageClassIcon }}</v-icon>{{ detail.type }}
                              </v-chip>
                              <span class="text-capitalize font-weight-medium">{{ detail.name }}</span>
                            </div>
                          </v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <v-row dense class="mt-1">
                              <v-col cols="4">
                                <div class="text-caption text-grey">Potencia</div>
                                <div class="font-weight-bold">{{ detail.power ?? '—' }}</div>
                              </v-col>
                              <v-col cols="4">
                                <div class="text-caption text-grey">Precisión</div>
                                <div class="font-weight-bold">{{ detail.accuracy ?? '—' }}</div>
                              </v-col>
                              <v-col cols="4">
                                <div class="text-caption text-grey">PP</div>
                                <div class="font-weight-bold">{{ detail.pp ?? '—' }}</div>
                              </v-col>
                              <v-col cols="12" class="mt-2">
                                <v-divider class="mb-2" />
                                <div class="text-caption text-justify">{{ detail.effect }}</div>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        </transition>

        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :timeout="3000"
          location="top"
          rounded
        >
          {{ snackbar.text }}
          <template v-slot:actions>
            <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
          </template>
        </v-snackbar>

        <v-dialog v-model="quickViewDialog" max-width="400">
          <v-card v-if="quickViewPokemon" class="quick-view-card">
            <v-card-title class="text-h6 text-center py-3" :style="{ background: TYPE_COLORS[quickViewPokemon.types[0]] || dominantColor, color: '#fff' }">
              {{ quickViewPokemon.name }}
              <v-chip size="small" class="ml-2" color="white" text-color="black">#{{ quickViewPokemon.id }}</v-chip>
            </v-card-title>
            <v-card-text class="text-center pa-4">
              <v-avatar size="120" class="mb-3">
                <v-img :src="`/images/pokemon-${quickViewPokemon.id}.png`" :alt="quickViewPokemon.name"></v-img>
              </v-avatar>
              <div class="d-flex justify-center gap-2 flex-wrap">
                <v-chip v-for="type in quickViewPokemon.types" :key="type" :style="{ backgroundColor: TYPE_COLORS[type] || '#999', color: '#fff' }" size="small">
                  {{ type }}
                </v-chip>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="query = quickViewPokemon.name; searchPokemon(); quickViewDialog = false">Ver detalles</v-btn>
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="quickViewDialog = false">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-row v-if="error" justify="center" class="mt-4">
          <v-col cols="12" md="8" lg="6">
            <v-alert type="error" variant="tonal" prominent>
              <v-alert-title>Error</v-alert-title>
              {{ error }}
            </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import ThemeToggle from '../components/ThemeToggle.vue'
import FilterPanel from '../components/FilterPanel.vue'
import { usePokemonStore } from '../store/pokemon'
const VTYPE_COLORS = {
  grass: '#78C850', fire: '#F08030', water: '#6890F0', electric: '#F8D030', ice: '#98D8D8', ground: '#E0C068',
  rock: '#B8A038', fairy: '#EE99AC', poison: '#A040A0', bug: '#A8B820', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', psychic: '#F85888', flying: '#A890F0', fighting: '#C03028', ghost: '#705898', normal: '#A8A878'
}
import { pokemonData } from '../data/pokemon'
import { getPokemonDetails } from '../data/pokemonDetails.js'

export default {
  name: 'VuetifyDemo',
  components: { ThemeToggle, FilterPanel },
  data() {
    return {
      query: '',
      pokemon: null,
      error: null,
      loading: false,
      suggestions: ['pikachu', 'charizard', 'mewtwo', 'bulbasaur', 'squirtle'],
      allPokemonNames: [],
      filteredSuggestions: [],
      filters: { text: '', idRange: [1,200], types: [] },
      dominantType: '',
      dominantColor: '#764ba2',
      moveDetailsLoading: false,
      moveDetails: [],
      abilityDetails: {},
      abilityLoading: false,
      pokemonDescription: '',
      TYPE_COLORS: VTYPE_COLORS,
      filterLoading: false,
        evolutionChain: [],
      snackbar: { show: false, text: '', color: 'success' },
      quickViewDialog: false,
      quickViewPokemon: null
    }
  },
  setup() {
    const store = usePokemonStore()
    return { store }
  },
  mounted() {
    this.allPokemonNames = pokemonData[0].pokemones.map(p => p.nombre)
    this.filteredSuggestions = this.allPokemonNames.slice(0, 10)
    
    const urlParams = new URLSearchParams(window.location.search)
    const pokemonParam = urlParams.get('pokemon')
    
    if (pokemonParam) {
      this.query = pokemonParam
      this.searchPokemon()
    } else if (this.store.lastSearch) {
      this.query = this.store.lastSearch
      this.searchPokemon()
    }
  },
  computed: {
    isFav() {
      return this.pokemon ? this.store.isFavorite(this.pokemon.id) : false
    },
    barColor() {
      return this.dominantColor || 'red-darken-2'
    },
    // photoUrl is now unused for main image, but may be used elsewhere
    photoUrl() {
      return `/images/pokemon-${this.pokemon?.id}.png`;
    },
    placeholderImg() {
      return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23ddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="%23666">Loading</text></svg>'
    },
    abilities() {
      return this.pokemon?.abilities?.map(a => a.ability.name) || []
    },
    moves() {
      return this.pokemon?.moves?.slice(0, 10).map(m => m.move.name) || []
    },
    gradientHeader() {
      return {
        background: `linear-gradient(135deg, ${this.dominantColor} 0%, #222 100%)`,
        color: '#fff'
      }
    },
    totalStats() {
      return this.pokemon?.stats?.reduce((sum, s) => sum + s.base_stat, 0) || 0
    }
  },
  methods: {
    async filterSuggestions(searchTerm) {
      this.filterLoading = true
      if (!searchTerm || searchTerm.length < 1) {
        const base = await this.filterByAdvancedAsync(this.allPokemonNames)
        this.filteredSuggestions = base.slice(0, 10)
        this.filterLoading = false
        return
      }
      const term = searchTerm.toLowerCase()
      const base = await this.filterByAdvancedAsync(this.allPokemonNames)
      this.filteredSuggestions = base.filter(name => name.toLowerCase().includes(term)).slice(0,10)
      this.filterLoading = false
    },
    applyFilters(f) {
      this.filters = f
      if (this.pokemon) {
        this.pokemon = null;
        this.query = '';
      }
      this.filterSuggestions(this.query)
    },
    async filterByAdvancedAsync(list) {
      const map = new Map();
      pokemonData[0].pokemones.forEach(p => map.set(p.nombre.toLowerCase(), String(p.id)));
      // Normalizador de tipos (quita acentos, minúsculas, mapea español/inglés)
      const normalizeType = (t) => {
        const map = {
          "planta": "grass", "fuego": "fire", "agua": "water", "eléctrico": "electric", "electrico": "electric",
          "hielo": "ice", "tierra": "ground", "roca": "rock", "hada": "fairy", "veneno": "poison", "bicho": "bug",
          "dragón": "dragon", "dragon": "dragon", "siniestro": "dark", "oscuro": "dark", "acero": "steel",
          "psíquico": "psychic", "psiquico": "psychic", "psychic": "psychic", "flying": "flying", "volador": "flying",
          "lucha": "fighting", "fighting": "fighting", "fantasma": "ghost", "ghost": "ghost", "normal": "normal"
        };
        let norm = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return map[norm] || norm;
      };
      const needsTypes = this.filters.types.length > 0;
      const out = [];
      const normalizedFilterTypes = this.filters.types.map(normalizeType);
      for (const name of list) {
        const id = map.get(name.toLowerCase());
        if (!id) continue;
        const idNum = parseInt(id, 10);
        if (idNum < this.filters.idRange[0] || idNum > this.filters.idRange[1]) continue;
        if (this.filters.text && !name.toLowerCase().includes(this.filters.text.toLowerCase())) continue;
        if (needsTypes) {
          const d = getPokemonDetails(id);
          let tipos = [];
          if (Array.isArray(d.tipo)) tipos = d.tipo;
          else if (Array.isArray(d.tipos)) tipos = d.tipos;
          else if (typeof d.tipo === 'string') tipos = [d.tipo];
          else if (typeof d.tipos === 'string') tipos = [d.tipos];
          else tipos = ["Normal"];
          tipos = tipos.map(normalizeType);
          // Si el detalle es el fallback (solo tipo Normal), mostrar advertencia
          if (tipos.length === 1 && tipos[0] === 'normal' && (!d.nombre || d.nombre === 'unknown')) {
            // Solo log, no bloquea sugerencia si existe en la lista
            // console.warn('No hay detalles para', name, 'id', id, 'en pokemonDetails.js');
          }
          if (!normalizedFilterTypes.some(f => tipos.includes(f))) continue;
        }
        out.push(name);
      }
      // Si no hay sugerencias, mostrar mensaje especial
      if (out.length === 0) {
        out.push('No hay Pokémon con esos filtros o faltan detalles en pokemonDetails.js');
      }
      return out;
    },
    async searchPokemon() {
      if (!this.query || !this.query.trim()) return
      
      this.loading = true
      this.error = null
      this.pokemon = null

      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${this.query.toLowerCase()}`
        )
        this.pokemon = response.data
        const type = this.pokemon.types?.[0]?.type?.name || ''
        this.dominantType = type
        this.dominantColor = VTYPE_COLORS[type] || '#667eea'
        this.fetchMoveDetails()
        this.fetchPokemonDescription()
          this.fetchEvolutionChain()
        // actualizar store (cache, analytics, persistencia)
        this.store.fetchPokemon(this.query.toLowerCase()).catch(()=>{})
      } catch (err) {
        this.error = 'No se encontró el Pokémon. Intenta con otro nombre.'
      } finally {
        this.loading = false
      }
    }
    ,
    toggleFavorite() {
      if (!this.pokemon) return
      const wasFav = this.store.isFavorite(this.pokemon.id)
      this.store.toggleFavorite(this.pokemon.id)
      this.showSnackbar(
        wasFav ? 'Eliminado de favoritos' : 'Añadido a favoritos ❤️',
        wasFav ? 'info' : 'success'
      )
    },
    addToTeamQuick() {
      if (!this.pokemon) return
      try {
        this.store.addToTeam(this.pokemon.name.toLowerCase())
        this.showSnackbar('Añadido al equipo 🎉', 'success')
      } catch (e) {
        this.showSnackbar(e.message, 'error')
      }
    },
    addToComparator() {
      if (!this.pokemon) return
      this.$router.push(`/comparar?left=${this.pokemon.name}`)
      this.showSnackbar('Pokémon cargado en comparador', 'info')
    },
    sharePokemon() {
      if (!this.pokemon) return
      const url = `${window.location.origin}/?pokemon=${this.pokemon.name}`
      if (navigator.share) {
        navigator.share({
          title: `Pokémon: ${this.pokemon.name}`,
          text: `Mira este Pokémon: ${this.pokemon.name}`,
          url
        }).catch(() => {})
      } else {
        navigator.clipboard.writeText(url)
        this.showSnackbar('Link copiado al portapapeles', 'success')
      }
    },
    showSnackbar(text, color = 'success') {
      this.snackbar = { show: true, text, color }
    },
    async showQuickView(name) {
      try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
        this.quickViewPokemon = {
          name: res.data.name,
          id: res.data.id,
          sprite: res.data.sprites.front_default,
          types: res.data.types.map(t => t.type.name)
        }
        this.quickViewDialog = true
      } catch (e) {
        this.showSnackbar('Error al cargar vista previa', 'error')
      }
    },
    translateStat(statName) {
      const translations = {
        'hp': 'PS',
        'attack': 'Ataque',
        'defense': 'Defensa',
        'special-attack': 'At. Esp',
        'special-defense': 'Def. Esp',
        'speed': 'Velocidad'
      }
      return translations[statName] || statName
    },
    getStatColor(value) {
      if (value >= 150) return 'red-darken-2'
      if (value >= 100) return 'orange-darken-1'
      if (value >= 70) return 'yellow-darken-2'
      if (value >= 50) return 'light-green'
      return 'blue-grey'
    },
    async fetchMoveDetails() {
      if (!this.pokemon) return
      this.moveDetailsLoading = true
      this.moveDetails = []
      const firstMoves = this.pokemon.moves.slice(0, 10)
      try {
        const responses = await Promise.all(firstMoves.map(m => axios.get(m.move.url).catch(() => null)))
        this.moveDetails = responses.filter(r => r).map(r => {
          const mv = r.data
          return {
            name: mv.name,
            power: mv.power,
            accuracy: mv.accuracy,
            pp: mv.pp,
            type: mv.type?.name,
            damageClass: mv.damage_class?.name,
            damageClassIcon: mv.damage_class?.name === 'physical' ? 'mdi-arm-flex' : mv.damage_class?.name === 'special' ? 'mdi-auto-fix' : 'mdi-shield',
            effect: (() => {
              const entries = mv.effect_entries || []
              const esEntry = entries.find(e => e.language.name === 'es')
              const enEntry = entries.find(e => e.language.name === 'en')
              const chosen = esEntry || enEntry || entries[0]
              return chosen ? (chosen.short_effect || chosen.effect || '').replace(/\n/g, ' ') : ''
            })()
          }
        })
      } finally {
        this.moveDetailsLoading = false
      }
    }
    ,
    async fetchPokemonDescription() {
      if (!this.pokemon) return
      try {
        const speciesUrl = this.pokemon.species?.url
        if (!speciesUrl) return
        const { data } = await axios.get(speciesUrl)
        const entries = data.flavor_text_entries || []
        const esEntry = entries.find(e => e.language.name === 'es')
        const enEntry = entries.find(e => e.language.name === 'en')
        const chosen = esEntry || enEntry || entries[0]
        this.pokemonDescription = chosen ? chosen.flavor_text.replace(/\n|\f/g, ' ') : ''
      } catch (e) {
      }
    },
    async fetchEvolutionChain() {
      if (!this.pokemon) return
      try {
        const speciesUrl = this.pokemon.species?.url
        if (!speciesUrl) return
        const { data: speciesData } = await axios.get(speciesUrl)
        const evolutionUrl = speciesData.evolution_chain?.url
        if (!evolutionUrl) return
        
        const { data: evolutionData } = await axios.get(evolutionUrl)
        this.evolutionChain = this.parseEvolutionChain(evolutionData.chain)
      } catch (e) {
        this.evolutionChain = []
      }
    },
    parseEvolutionChain(chain) {
      const result = []
      let current = chain
      
      while (current) {
        const speciesName = current.species.name
        const id = current.species.url.split('/').filter(Boolean).pop()
        result.push({ name: speciesName, id: parseInt(id, 10) })
        current = current.evolves_to?.[0]
      }
      
      return result
    }
    ,
    async fetchAbilityDetail(ability) {
      if (this.abilityDetails[ability]) return
      this.abilityLoading = true
      try {
        const abilObj = this.pokemon.abilities.find(a => a.ability.name === ability)
        if (!abilObj) return
        const { data } = await axios.get(abilObj.ability.url)
        const es = data.effect_entries.find(e => e.language.name === 'es')
        const en = data.effect_entries.find(e => e.language.name === 'en')
        this.abilityDetails[ability] = { effect: (es?.short_effect || en?.short_effect || 'Sin descripción').replace(/\n/g,' ') }
      } catch (e) {
        this.abilityDetails[ability] = { effect: 'Error cargando efecto' }
      } finally {
        this.abilityLoading = false
      }
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'VT323';
  src: url('/fonts/VT323-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'PressStart2P';
  src: url('/fonts/PressStart2P-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
.gba-title-pixel {
  font-family: 'PressStart2P', 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif !important;
  letter-spacing: 2px;
  font-size: 2.1rem;
}
.pixelart-deco {
  position: absolute;
  top: 0;
  width: 48px;
  height: 48px;
  image-rendering: pixelated;
  z-index: 10;
}
.pixelart-deco-left {
  left: 12px;
}
.pixelart-deco-right {
  right: 12px;
}
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.pokemon-card {
  animation: scaleIn 0.3s ease;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.pokemon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.pokemon-avatar {
  transition: transform 0.3s ease;
}
.pokemon-avatar:hover {
  transform: scale(1.1) rotate(5deg);
}

.gba-app-bar {
  background: linear-gradient(180deg, #b97fc9 0%, #a16ae8 100%) !important;
  border-bottom: 6px solid #2a4e7e;
  box-shadow: 0 4px 24px #2a4e7e33;
}
.gba-title {
  font-family: 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
  font-weight: 700;
  letter-spacing: 2px;
  font-size: 2.1rem;
}
.gba-title-text {
  color: #fff;
  text-shadow: 1px 2px 0 #2a4e7e, 0 0 8px #fff;
  font-family: 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
}
.gba-type-chip {
  border-radius: 4px;
  font-weight: bold;
  box-shadow: 0 2px 8px #2a4e7e33;
  border: 2px solid #2a4e7e;
  font-family: 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
}
.gba-menu-btn {
  background: #2a4e7e;
  color: #fff !important;
  border-radius: 0px;
  margin-left: 6px;
  margin-right: 6px;
  font-weight: 700;
  font-family: 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
  border: 2px solid #fff;
  box-shadow: 0 2px 0 #000;
  transition: background 0.2s, box-shadow 0.2s;
}
.gba-menu-btn:hover {
  background: #fff !important;
  color: #2a4e7e !important;
  box-shadow: 0 2px 8px #2a4e7e66;
}
.gba-fav-btn {
  background: #fff;
  color: #b97fc9 !important;
  border-radius: 0px;
  font-weight: 700;
  margin-left: 10px;
  border: 2px solid #b97fc9;
  font-family: 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
}
.gba-filters-card {
  background: linear-gradient(120deg, #e0ffe0 60%, #b2f2e9 100%);
  border-radius: 8px;
  box-shadow: 0 4px 24px #2a4e7e22;
  margin-bottom: 32px;
  padding: 18px 12px 8px 12px;
  border: 4px solid #2a4e7e;
}
.gba-main-card {
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 8px 32px #2a4e7e22;
  border: 4px solid #2a4e7e;
}
.gba-main-title {
  background: linear-gradient(90deg, #b97fc9 60%, #a16ae8 100%);
  color: #fff;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 12px #2a4e7e33;
  font-family: 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
  font-size: 2rem;
  padding: 18px 0 18px 0;
  text-align: left;
}
.gba-main-title-text {
  color: #fff;
  text-shadow: 1px 2px 0 #2a4e7e, 0 0 8px #fff;
  font-family: 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
}
.gba-main-content {
  background: #e0ffe0;
  border-radius: 0 0 8px 8px;
  border-top: 2px solid #b97fc9;
  font-family: 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
}
.gba-search-btn {
  background: #2a4e7e;
  color: #fff !important;
  border-radius: 0px;
  font-weight: 900;
  letter-spacing: 1px;
  font-family: 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
  border: 2px solid #b97fc9;
  box-shadow: 0 2px 0 #000;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
}
.gba-search-btn:hover {
  background: #b97fc9 !important;
  color: #fff !important;
  transform: scale(1.07);
  box-shadow: 0 4px 24px #b97fc966;
}
.gba-suggestions-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px #2a4e7e33;
  margin-top: 32px;
  border: 4px solid #2a4e7e;
}
.gba-suggestions-title {
  color: #b97fc9;
  letter-spacing: 1px;
  font-family: 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
  font-size: 1.3rem;
  margin-bottom: 12px;
}
.gba-suggestion-chip {
  background: #e0ffe0 !important;
  color: #2a4e7e !important;
  border: 2px solid #b97fc9 !important;
  border-radius: 0px !important;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 2px 0 #000;
  transition: background 0.2s, color 0.2s, transform 0.15s, box-shadow 0.2s;
  cursor: pointer;
  font-family: 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
}
.gba-suggestion-chip:hover {
  background: #b97fc9 !important;
  color: #fff !important;
  transform: scale(1.08);
  box-shadow: 0 4px 16px #b97fc966;
}
.animate-pop {
  animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.animate-fade-in {
  animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1);
}
@keyframes popIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-pop {
  animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.animate-fade-in {
  animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1);
}
@keyframes popIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.shimmer-card {
  position: relative;
  overflow: hidden;
}
.shimmer-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  to {
    left: 100%;
  }
}

.quick-view-card {
  animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.move-panels {
  max-height: 500px;
  overflow-y: auto;
}

.move-panels::-webkit-scrollbar {
  width: 8px;
}

.move-panels::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.move-panels::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.move-panels::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.evolution-card {
  transition: all 0.3s ease;
}

.evolution-card:not(.evolution-current):hover {
  transform: translateY(-4px) scale(1.05);
  opacity: 1 !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.evolution-current {
  border: 3px solid var(--v-theme-primary);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}



@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

html, body, #app, .v-application {
  font-family: 'Press Start 2P', monospace !important;
  font-size: 15px !important;
  letter-spacing: 0.5px !important;
}

.pixel-font, .gba-title-text, .gba-main-title-text, .gba-suggestions-title, .gba-suggestion-chip, .gba-type-chip, .gba-main-title, .gba-main-title-text, .gba-title-pixel, .v-btn, .v-chip, .v-card-title, .v-card-text, .v-autocomplete, .v-input, .v-label, .v-list-item-title, .v-list-item-content, .v-toolbar-title, .v-alert-title, .v-alert, .v-avatar, .v-progress-linear, .v-progress-circular, .v-icon, .text-h5, .text-center, .text-caption, .text-body-2, .font-weight-bold, .font-weight-black, .text-subtitle-2, .text-capitalize, .text-body-2, .text-h5, .text-h6, .text-h4, .text-h3, .text-h2, .text-h1 {
  font-family: 'Press Start 2P', monospace !important;
  letter-spacing: 0.5px !important;
}

@font-face {
  font-family: 'Press Start 2P';
  src: url('./fonts/PressStart2P-Regular.ttf') format('truetype');
  font-display: swap;
}

/* Pikachu mascot animation */
.pikachu-mascot {
  position: fixed;
  left: 0;
  bottom: 40px;
  width: 64px;
  height: 64px;
  z-index: 9999;
  pointer-events: none;
  animation: pikachu-walk 12s linear infinite;
}

@keyframes pikachu-walk {
  0% { left: 0; bottom: 40px; transform: scaleX(1) rotate(-10deg); }
  10% { left: 20vw; bottom: 60px; transform: scaleX(1) rotate(0deg); }
  20% { left: 40vw; bottom: 80px; transform: scaleX(1) rotate(10deg); }
  30% { left: 60vw; bottom: 100px; transform: scaleX(1) rotate(0deg); }
  40% { left: 80vw; bottom: 120px; transform: scaleX(-1) rotate(-10deg); }
  50% { left: 100vw; bottom: 140px; transform: scaleX(-1) rotate(0deg); }
  60% { left: 80vw; bottom: 120px; transform: scaleX(-1) rotate(10deg); }
  70% { left: 60vw; bottom: 100px; transform: scaleX(-1) rotate(0deg); }
  80% { left: 40vw; bottom: 80px; transform: scaleX(1) rotate(-10deg); }
  90% { left: 20vw; bottom: 60px; transform: scaleX(1) rotate(0deg); }
  100% { left: 0; bottom: 40px; transform: scaleX(1) rotate(-10deg); }
}

/* High-contrast helpers */
.hc-card {
  background: #ffffff;
  color: #212121;
}
.v-theme--dark .hc-card {
  background: #121212;
  color: #f5f5f5;
}
.hc-muted { color: rgba(0,0,0,0.72); }
.v-theme--dark .hc-muted { color: rgba(255,255,255,0.72); }
.hc-strong { color: rgba(0,0,0,0.92); }
.v-theme--dark .hc-strong { color: rgba(255,255,255,0.92); }
.description-text { color: rgba(0,0,0,0.85); }
.v-theme--dark .description-text { color: rgba(255,255,255,0.85); }
.hc-chain { background: #f5f7fa; }
.v-theme--dark .hc-chain { background: rgba(255,255,255,0.08); }
</style>
