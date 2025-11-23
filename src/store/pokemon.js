import { defineStore } from 'pinia'
import axios from 'axios'

const TYPE_COLORS = {
  grass: '#78C850', fire: '#F08030', water: '#6890F0', electric: '#F8D030', ice: '#98D8D8', ground: '#E0C068',
  rock: '#B8A038', fairy: '#EE99AC', poison: '#A040A0', bug: '#A8B820', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', psychic: '#F85888', flying: '#A890F0', fighting: '#C03028', ghost: '#705898', normal: '#A8A878'
}

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    searchTerm: '',
    activePokemon: null,
    activeDescription: '',
    loading: false,
    error: '',
    favorites: JSON.parse(localStorage.getItem('pk_favorites') || '[]'),
    team: JSON.parse(localStorage.getItem('pk_team') || '[]'),
    teamData: [],
    analytics: JSON.parse(localStorage.getItem('pk_analytics') || '{}'),
    lastSearch: localStorage.getItem('pk_lastSearch') || '',
    typeColors: TYPE_COLORS,
    themeMode: localStorage.getItem('pk_theme') || 'light',
    cache: {},
    typesCache: {}
  }),
  getters: {
    isFavorite: (state) => (id) => state.favorites.includes(id),
    teamCount: (state) => state.team.length,
    topSearched: (state) => {
      return Object.entries(state.analytics)
        .sort((a,b) => b[1]-a[1])
        .slice(0,5)
    },
    teamCoverage: (state) => {
      const coverage = {}
      state.teamData.forEach(p => {
        (p.types || []).forEach(t => {
          coverage[t] = (coverage[t] || 0) + 1
        })
      })
      return coverage
    }
  },
  actions: {
    setSearchTerm(term) {
      this.searchTerm = term
    },
    async fetchPokemon(nameOrId) {
      const key = nameOrId.toString().toLowerCase()
      if (this.cache[key]) {
        this.activePokemon = this.cache[key]
        this.error = ''
        return
      }
      this.loading = true
      this.error = ''
      this.activePokemon = null
      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(key)}`)
        this.activePokemon = data
        this.cache[key] = data
        this.incrementAnalytics(data.name)
        this.lastSearch = data.name
        localStorage.setItem('pk_lastSearch', this.lastSearch)
        await this.fetchDescription()
      } catch (e) {
        this.error = 'No se encontró el Pokémon.'
      } finally {
        this.loading = false
      }
    },
    async getPokemon(nameOrId) {
      const key = nameOrId.toString().toLowerCase()
      if (this.cache[key]) return this.cache[key]
      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(key)}`)
        this.cache[key] = data
        return data
      } catch (_) {
        return null
      }
    },
    async fetchTypesForName(nameOrId) {
      const key = nameOrId.toString().toLowerCase()
      if (this.typesCache[key]) return this.typesCache[key]
      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(key)}`)
        const types = (data.types || []).map(t => t.type.name)
        this.typesCache[key] = types
        if (!this.cache[key]) this.cache[key] = data
        if (!this.cache[key]) this.cache[key] = data
        return types
      } catch (_) {
        this.typesCache[key] = []
        return []
      }
    },
    async getTypes(nameOrId) {
      return this.fetchTypesForName(nameOrId)
    },
    async fetchDescription() {
      if (!this.activePokemon) return
      try {
        const speciesUrl = this.activePokemon.species?.url
        if (!speciesUrl) return
        const { data } = await axios.get(speciesUrl)
        const entries = data.flavor_text_entries || []
        const esEntry = entries.find(e => e.language.name === 'es')
        const enEntry = entries.find(e => e.language.name === 'en')
        const chosen = esEntry || enEntry || entries[0]
        this.activeDescription = chosen ? chosen.flavor_text.replace(/\n|\f/g,' ') : ''
      } catch (_) {}
    },
    toggleFavorite(id) {
      const idx = this.favorites.indexOf(id)
      if (idx >= 0) {
        this.favorites.splice(idx, 1)
      } else {
        this.favorites.push(id)
      }
      localStorage.setItem('pk_favorites', JSON.stringify(this.favorites))
    },
    addToTeam(id) {
      if (this.team.includes(id) || this.team.length >= 6) return
      this.team.push(id)
      localStorage.setItem('pk_team', JSON.stringify(this.team))
      this.loadTeamMember(id)
    },
    removeFromTeam(id) {
      this.team = this.team.filter(t => t !== id)
      localStorage.setItem('pk_team', JSON.stringify(this.team))
      this.teamData = this.teamData.filter(p => p.id !== id)
    },
    incrementAnalytics(name) {
      this.analytics[name] = (this.analytics[name] || 0) + 1
      localStorage.setItem('pk_analytics', JSON.stringify(this.analytics))
    },
    toggleTheme() {
      this.themeMode = this.themeMode === 'light' ? 'dark' : 'light'
      localStorage.setItem('pk_theme', this.themeMode)
    },
    async loadTeamMember(id) {
      const key = id.toString()
      if (this.teamData.find(p => p.id === id)) return
      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(key)}`)
        this.teamData.push({ id: data.id, name: data.name, types: data.types.map(t => t.type.name), sprites: data.sprites })
      } catch (_) {}
    },
    async loadTeam() {
      const missing = this.team.filter(id => !this.teamData.find(p => p.id === id))
      await Promise.all(missing.map(id => this.loadTeamMember(id)))
    }
  }
})
