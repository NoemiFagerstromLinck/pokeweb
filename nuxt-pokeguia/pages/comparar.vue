<template>
  <v-app>
    <v-app-bar color="primary">
      <v-toolbar-title>Comparador</v-toolbar-title>
      <v-spacer />
      <NuxtLink to="/">Inicio</NuxtLink>
    </v-app-bar>
    <v-main>
      <v-container class="py-6">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="leftInput" label="Izquierda" @keyup.enter="loadLeft" variant="outlined" density="compact" />
            <div v-if="leftLoading" class="py-2 text-center"><v-progress-circular indeterminate color="purple" /></div>
            <PokemonMini v-if="left" :pokemon="left" side="left" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="rightInput" label="Derecha" @keyup.enter="loadRight" variant="outlined" density="compact" />
            <div v-if="rightLoading" class="py-2 text-center"><v-progress-circular indeterminate color="pink" /></div>
            <PokemonMini v-if="right" :pokemon="right" side="right" />
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <v-row v-if="left && right">
          <v-col cols="12">
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Stat</th>
                  <th style="text-transform:capitalize">{{ left.name }}</th>
                  <th style="text-transform:capitalize">{{ right.name }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in statNames" :key="s">
                  <td>{{ s }}</td>
                  <td :class="cellClass(statValue(left,s), statValue(right,s))">{{ statValue(left,s) }}</td>
                  <td :class="cellClass(statValue(right,s), statValue(left,s))">{{ statValue(right,s) }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
        <v-alert v-else type="info" variant="tonal" title="Selecciona dos" text="Ingresa nombre o ID y presiona Enter en cada lado." />
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const leftInput = ref('')
const rightInput = ref('')
const left = ref<any|null>(null)
const right = ref<any|null>(null)
const leftLoading = ref(false)
const rightLoading = ref(false)
const statNames = ['hp','attack','defense','special-attack','special-defense','speed']

function statValue(p:any, key:string){ if(!p) return 0; const f = p.stats.find((s:any)=> s.stat.name===key); return f?f.base_stat:0 }
function cellClass(val:number, other:number){ if(val===other) return ''; return val>other?'text-success':'text-error' }

async function loadLeft(){ const raw = leftInput.value.trim().toLowerCase(); if(!raw) return; leftLoading.value=true; try{ const {data}=await axios.get(`https://pokeapi.co/api/v2/pokemon/${raw}`); left.value=data }catch{} leftLoading.value=false }
async function loadRight(){ const raw = rightInput.value.trim().toLowerCase(); if(!raw) return; rightLoading.value=true; try{ const {data}=await axios.get(`https://pokeapi.co/api/v2/pokemon/${raw}`); right.value=data }catch{} rightLoading.value=false }

const PokemonMini = {
  name:'PokemonMini', props:{ pokemon:Object, side:String },
  template:`<v-card :color="side==='left'?'purple':'pink'" variant='tonal' rounded='xl' class='mb-2'>
    <v-card-title class='d-flex align-center'>
      <v-avatar size='64' class='me-2'>
        <img :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default" :alt="pokemon.name" />
      </v-avatar>
      <div>
        <div style='text-transform:capitalize'>#{{ pokemon.id }} {{ pokemon.name }}</div>
      </div>
    </v-card-title>
  </v-card>`
}
</script>
<style scoped>
.text-success { color:#2e7d32; font-weight:600 }
.text-error { color:#c62828; font-weight:600 }
</style>
