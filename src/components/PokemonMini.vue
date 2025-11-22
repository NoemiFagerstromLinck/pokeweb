<template>
  <v-card variant="tonal" :color="side==='left' ? 'purple' : 'pink'" rounded="xl" class="mb-2">
    <v-card-title class="d-flex align-center">
      <v-avatar size="64" class="me-2">
        <img :src="'/images/pokemon-' + pokemon.id + '.png'" :alt="pokemon.name" />
      </v-avatar>
      <div>
        <div style="text-transform:capitalize" class="text-subtitle-2">#{{ pokemon.id }} {{ pokemon.name }}</div>
        <div>
          <v-chip v-for="t in pokemon.types" :key="t.type.name" size="x-small" style="text-transform:capitalize" class="me-1" :color="typeColor(t.type.name)" />
        </div>
      </div>
    </v-card-title>
  </v-card>
</template>
<script setup>
import { usePokemonStore } from '../store/pokemon'
const props = defineProps({
  pokemon: Object,
  side: String
})
const store = usePokemonStore()
function typeColor(t) {
  return store.typeColors[t] || undefined
}
</script>
