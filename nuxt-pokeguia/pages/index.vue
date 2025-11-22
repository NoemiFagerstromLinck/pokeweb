<template>
  <v-app>
    <v-app-bar :color="barColor" density="comfortable">
      <v-toolbar-title class="d-flex align-center">
        <v-icon start>mdi-pokeball</v-icon> Pokeguía Nuxt
      </v-toolbar-title>
      <v-spacer />
      <v-btn size="small" @click="toggleTheme" variant="outlined">
        <v-icon start>{{ store.themeMode==='dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        {{ store.themeMode==='dark' ? 'Light' : 'Dark' }}
      </v-btn>
      <v-btn v-if="pokemon" size="small" class="ml-2" :color="isFav?'pink':'grey'" variant="outlined" @click="toggleFavorite">
        <v-icon start>{{ isFav ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        {{ isFav ? 'Favorito' : 'Marcar' }}
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="py-6">
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card rounded="xl" elevation="3" class="pa-4">
              <v-autocomplete
                v-model="query"
                :items="suggestions"
                label="Buscar Pokémon"
                clearable
                variant="outlined"
                @keyup.enter="doSearch"
              />
              <div class="text-center mt-4">
                <v-btn color="primary" @click="doSearch" :loading="loading" prepend-icon="mdi-pokeball">Buscar</v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="loading" class="mt-6" justify="center">
          <v-col cols="12" md="8">
            <v-skeleton-loader type="heading, image, paragraph, paragraph" />
          </v-col>
        </v-row>

        <v-row v-else-if="pokemon" class="mt-6" justify="center">
          <v-col cols="12" md="8">
            <v-card rounded="xl" :style="{ border: '4px solid '+dominantColor }">
              <v-card-title :style="headerStyle" class="justify-center text-white">
                <v-icon start color="yellow">mdi-star</v-icon>
                {{ pokemon.name.toUpperCase() }}
                <v-chip class="ml-2" color="red" size="small">#{{ pokemon.id }}</v-chip>
                <v-chip v-if="dominantType" class="ml-2" size="small" :style="{background: dominantColor, color:'#fff'}">{{ dominantType }}</v-chip>
              </v-card-title>
              <v-card-text class="text-center">
                <v-avatar size="180" class="mb-4">
                  <img :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default" :alt="pokemon.name" />
                </v-avatar>
                <v-divider class="my-4" />
                <div class="mb-4">
                  <p class="font-weight-bold mb-2">Stats</p>
                  <v-row dense>
                    <v-col v-for="s in pokemon.stats" :key="s.stat.name" cols="6" md="4">
                      <strong>{{ s.stat.name }}:</strong> {{ s.base_stat }}
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-else class="mt-6" justify="center">
          <v-col cols="12" md="8" class="text-center text-caption">Busca un Pokémon por nombre o ID.</v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'
import axios from 'axios'

const store = usePokemonStore()
store.initFromStorage()

const query = ref(store.lastSearch || '')
const suggestions = ref(['pikachu','charizard','bulbasaur','squirtle','mewtwo'])
const loading = ref(false)
const pokemon = computed(()=>store.activePokemon)
const isFav = computed(()=> pokemon.value ? store.isFavorite(pokemon.value.id) : false)
const dominantType = ref('')
const dominantColor = ref('#764ba2')

const headerStyle = computed(()=>({ background: `linear-gradient(135deg, ${dominantColor.value} 0%, #222 100%)` }))
const barColor = computed(()=> dominantColor.value)

async function doSearch(){
  if(!query.value.trim()) return
  loading.value = true
  await store.fetchPokemon(query.value.toLowerCase())
  loading.value = false
  if(store.activePokemon){
    const type = store.activePokemon.types?.[0]?.type?.name || ''
    dominantType.value = type
    dominantColor.value = store.typeColors[type] || '#764ba2'
  }
}
function toggleFavorite(){ if(pokemon.value) store.toggleFavorite(pokemon.value.id) }
function toggleTheme(){ store.toggleTheme() }

onMounted(()=>{ if(query.value) doSearch() })
</script>
