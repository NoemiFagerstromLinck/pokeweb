<template>
  <v-app>
    <v-app-bar color="primary">
      <v-toolbar-title>Favoritos</v-toolbar-title>
      <v-spacer />
      <NuxtLink to="/">Inicio</NuxtLink>
    </v-app-bar>
    <v-main>
      <v-container class="py-6">
        <v-row>
          <v-col cols="12" md="4" v-for="p in favoritesData" :key="p.id">
            <v-card rounded="xl" variant="outlined">
              <v-card-title class="d-flex align-center">
                <v-avatar size="64" class="me-2">
                  <img :src="p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default" :alt="p.name" />
                </v-avatar>
                <span style="text-transform:capitalize">#{{ p.id }} {{ p.name }}</span>
              </v-card-title>
              <v-card-text>
                <div class="d-flex flex-wrap mb-2">
                  <v-chip v-for="t in p.types" :key="t.type.name" size="x-small" :color="store.typeColors[t.type.name]" class="ma-1" style="text-transform:capitalize" />
                </div>
                <v-btn block color="pink" variant="tonal" @click="remove(p.id)">Quitar</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col v-if="favoritesData.length===0" cols="12" class="text-center text-caption">No hay favoritos aún.</v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { usePokemonStore } from '@/stores/pokemon'
const store = usePokemonStore();
const favoritesData = ref<any[]>([])

async function load(){
  favoritesData.value = []
  for(const id of store.favorites){
    try { const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`); favoritesData.value.push(data) } catch(_){}
  }
}
function remove(id:number){ store.toggleFavorite(id); load() }
onMounted(()=> load())
</script>
