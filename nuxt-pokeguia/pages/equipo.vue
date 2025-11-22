<template>
  <v-app>
    <v-app-bar color="primary">
      <v-toolbar-title>Equipo ({{ store.teamCount }}/6)</v-toolbar-title>
      <v-spacer />
      <NuxtLink to="/">Inicio</NuxtLink>
    </v-app-bar>
    <v-main>
      <v-container class="py-6">
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-text-field v-model="addInput" label="Nombre o ID" @keyup.enter="add" variant="outlined" density="compact" />
          </v-col>
          <v-col cols="12" md="2">
            <v-btn color="primary" :disabled="!addInput || store.teamCount>=6" @click="add">Agregar</v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <p class="text-caption mb-2">Cobertura de tipos</p>
            <div class="d-flex flex-wrap">
              <v-chip v-for="t in coverageKeys" :key="t" :color="store.typeColors[t]" size="x-small" class="ma-1" style="text-transform:capitalize">{{ t }}</v-chip>
              <span v-if="coverageKeys.length===0" class="text-disabled">Sin tipos aún</span>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="p in teamData" :key="p.id" cols="12" md="4">
            <v-card rounded="xl" variant="outlined" class="mb-4">
              <v-card-title class="d-flex align-center">
                <v-avatar size="56" class="me-2">
                  <img :src="p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default" :alt="p.name" />
                </v-avatar>
                <div style="text-transform:capitalize">#{{ p.id }} {{ p.name }}</div>
                <v-spacer />
                <v-btn icon="mdi-close" size="x-small" variant="text" @click="remove(p.id)" />
              </v-card-title>
              <v-card-text class="py-2">
                <div class="d-flex flex-wrap">
                  <v-chip v-for="t in p.types" :key="t.type.name" :color="store.typeColors[t.type.name]" size="x-small" class="ma-1" style="text-transform:capitalize" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col v-if="teamData.length===0" cols="12" class="text-center text-caption">Equipo vacío.</v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { usePokemonStore } from '@/stores/pokemon'
const store = usePokemonStore()
const addInput = ref('')
const teamData = ref<any[]>([])
const coverageKeys = ref<string[]>([])

async function sync(){
  teamData.value = []
  for(const id of store.team){
    try { const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`); teamData.value.push(data) } catch(_){}
  }
  const typesSet = new Set<string>()
  teamData.value.forEach(p => p.types.forEach((t:any)=> typesSet.add(t.type.name)))
  coverageKeys.value = [...typesSet]
}
function add(){
  const raw = addInput.value.trim().toLowerCase()
  if(!raw) return
  if(store.teamCount>=6) return
  axios.get(`https://pokeapi.co/api/v2/pokemon/${raw}`).then(r=>{ store.addToTeam(r.data.id); sync() }).catch(()=>{})
  addInput.value=''
}
function remove(id:number){ store.removeFromTeam(id); sync() }

onMounted(()=>{ store.initFromStorage(); sync() })
</script>
