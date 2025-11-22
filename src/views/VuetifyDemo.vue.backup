<template>
  <v-app>
    <v-app-bar :color="barColor" dark app>
      <v-toolbar-title class="d-flex align-center">
        <v-icon left>mdi-pokeball</v-icon>
        Pokeguía
        <v-chip v-if="dominantType" size="small" class="ml-2 text-capitalize" :style="{backgroundColor: dominantColor, color:'#fff'}">{{ dominantType }}</v-chip>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/explorar" variant="text" size="small" class="mr-2">
        <v-icon left size="small">mdi-grid</v-icon>
        <span class="d-none d-sm-inline">Explorar</span>
      </v-btn>
      <v-btn to="/favoritos" variant="text" size="small" class="mr-2">
        <v-icon left size="small">mdi-heart</v-icon>
        <span class="d-none d-sm-inline">Favoritos</span>
      </v-btn>
      <v-btn to="/equipo" variant="text" size="small" class="mr-2">
        <v-icon left size="small">mdi-account-group</v-icon>
        <span class="d-none d-sm-inline">Equipo</span>
      </v-btn>
      <v-btn to="/comparar" variant="text" size="small" class="mr-2">
        <v-icon left size="small">mdi-compare</v-icon>
        <span class="d-none d-sm-inline">Comparar</span>
      </v-btn>
      <ThemeToggle class="mr-2" />
      <v-btn v-if="pokemon" size="small" variant="outlined" color="yellow" @click="toggleFavorite">
        <v-icon left>{{ isFav ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        {{ isFav ? 'Favorito' : 'Marcar' }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-6">
        <FilterPanel @update:filters="applyFilters" />
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <v-card elevation="3">
              <v-card-title class="text-h4 text-center py-5 bg-red-darken-1 text-white">
                <v-icon left size="large">mdi-magnify</v-icon>
                Buscador de Pokémon
              </v-card-title>
              
              <v-card-text class="pa-6">
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

                <div class="text-center">
                  <v-btn
                    color="red darken-1"
                    size="large"
                    @click="searchPokemon"
                    :loading="loading"
                    prepend-icon="mdi-pokeball"
                  >
                    Buscar
                  </v-btn>
                </div>

                <v-card v-if="!pokemon && !loading" variant="tonal" color="blue-grey-lighten-5" class="mt-6">
                  <v-card-text>
                    <p class="text-subtitle-1 font-weight-bold mb-3">
                      <v-icon left color="info">mdi-lightbulb-outline</v-icon>
                      Sugerencias:
                    </p>
                    <div v-if="filterLoading" class="text-center py-2">
                      <v-progress-circular indeterminate color="red" />
                    </div>
                    <v-chip-group v-else>
                      <v-chip
                        v-for="suggestion in filteredSuggestions"
                        :key="suggestion"
                        @click="query = suggestion; searchPokemon()"
                        @contextmenu.prevent="showQuickView(suggestion)"
                        color="red"
                        variant="outlined"
                        class="ma-1 suggestion-chip"
                      >
                        {{ suggestion }}
                      </v-chip>
                    </v-chip-group>
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
                      <v-img :src="photoUrl" :alt="pokemon.name" :lazy-src="placeholderImg"></v-img>
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
                                <v-img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`" />
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
                <v-img :src="quickViewPokemon.sprite" :alt="quickViewPokemon.name"></v-img>
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
    photoUrl() {
      return this.pokemon?.sprites?.other?.['official-artwork']?.front_default || 
             this.pokemon?.sprites?.front_default
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
      this.filterSuggestions(this.query)
    },
    async filterByAdvancedAsync(list) {
      const map = new Map()
      pokemonData[0].pokemones.forEach(p => map.set(p.nombre.toLowerCase(), parseInt(p.id,10)))
      const needsTypes = this.filters.types.length > 0
      const out = []
      for (const name of list) {
        const id = map.get(name.toLowerCase()) || 0
        if (id < this.filters.idRange[0] || id > this.filters.idRange[1]) continue
        if (this.filters.text && !name.toLowerCase().includes(this.filters.text.toLowerCase())) continue
        if (needsTypes) {
          const types = await this.store.getTypes(name)
          if (!types.some(t => this.filters.types.includes(t))) continue
        }
        out.push(name)
      }
      return out
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

.suggestion-chip {
  transition: all 0.2s ease;
  cursor: pointer;
}
.suggestion-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
