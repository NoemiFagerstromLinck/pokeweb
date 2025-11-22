import axios from 'axios'
import { defineStore } from 'pinia'

const TYPE_COLORS: Record<string,string> = {
  grass: '#78C850', fire: '#F08030', water: '#6890F0', electric: '#F8D030', ice: '#98D8D8', ground: '#E0C068',
  rock: '#B8A038', fairy: '#EE99AC', poison: '#A040A0', bug: '#A8B820', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', psychic: '#F85888', flying: '#A890F0', fighting: '#C03028', ghost: '#705898', normal: '#A8A878'
}

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    searchTerm: '',
    activePokemon: null as any,
    favorites: [] as number[],
    team: [] as number[],
    analytics: {} as Record<string,number>,
    lastSearch: '',
    themeMode: 'light',
    cache: {} as Record<string, any>,
    typesCache: {} as Record<string,string[]>,
    typeColors: TYPE_COLORS
  }),
  getters: {
    isFavorite: (state) => (id: number) => state.favorites.includes(id),
    teamCount: (state) => state.team.length,
    topSearched: (state) => Object.entries(state.analytics).sort((a,b)=>b[1]-a[1]).slice(0,5)
  },
  actions: {
    initFromStorage() {
      if (process.client) {
        this.favorites = JSON.parse(localStorage.getItem('pk_favorites') || '[]')
        this.team = JSON.parse(localStorage.getItem('pk_team') || '[]')
        this.analytics = JSON.parse(localStorage.getItem('pk_analytics') || '{}')
        this.lastSearch = localStorage.getItem('pk_lastSearch') || ''
        this.themeMode = localStorage.getItem('pk_theme') || 'light'
      }
    },
    persist() {
      if (!process.client) return
      localStorage.setItem('pk_favorites', JSON.stringify(this.favorites))
      localStorage.setItem('pk_team', JSON.stringify(this.team))
      localStorage.setItem('pk_analytics', JSON.stringify(this.analytics))
      localStorage.setItem('pk_lastSearch', this.lastSearch)
      localStorage.setItem('pk_theme', this.themeMode)
    },
    async fetchPokemon(nameOrId: string|number) {
      const key = nameOrId.toString().toLowerCase()
      if (this.cache[key]) {
        this.activePokemon = this.cache[key]
        return
      }
      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(key)}`)
        this.cache[key] = data
        this.activePokemon = data
        this.lastSearch = data.name
        this.analytics[data.name] = (this.analytics[data.name] || 0) + 1
        this.persist()
      } catch (_) {}
    },
    toggleFavorite(id: number) {
      const idx = this.favorites.indexOf(id)
      if (idx >= 0) this.favorites.splice(idx,1) else this.favorites.push(id)
      this.persist()
    },
    addToTeam(id: number) {
      if (this.team.includes(id) || this.team.length >= 6) return
      this.team.push(id)
      this.persist()
    },
    removeFromTeam(id: number) {
      this.team = this.team.filter(t => t !== id)
      this.persist()
    },
    toggleTheme() {
      this.themeMode = this.themeMode === 'light' ? 'dark' : 'light'
      this.persist()
    },
    async getTypes(nameOrId: string|number) {
      const key = nameOrId.toString().toLowerCase()
      if (this.typesCache[key]) return this.typesCache[key]
      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(key)}`)
        const types = data.types.map((t:any)=>t.type.name)
        this.typesCache[key] = types
        return types
      } catch (_) {
        return []
      }
    }
  }
})
