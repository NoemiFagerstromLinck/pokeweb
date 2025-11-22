<template>
  <div class="pokemon-list-container">
    <v-alert type="info" variant="tonal" class="mb-4" border="start" prominent>
      <template #title>
        <div class="d-flex align-center">
          <v-chip color="red" size="small" class="mr-2">DATA</v-chip>
          <span class="list-title">Mostrando {{ pokemonList.length }} Pokémon {{ searchTerm ? `para "${searchTerm}"` : 'de la región Hoenn' }}</span>
        </div>
      </template>
    </v-alert>
    <v-row>
      <v-col
        v-for="pokemon in pokemonList"
        :key="pokemon.id"
        cols="12"
        md="6"
        class="mb-3"
      >
        <PokemonCard
          :id="pokemon.id"
          :nombre="pokemon.nombre"
          :descripcion="pokemon.descripcion"
          @pokemon-selected="handlePokemonSelected"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PokemonCard from './PokemonCard.vue'

export default {
  name: 'PokemonList',
  components: {
    PokemonCard
  },
  props: {
    pokemonList: {
      type: Array,
      required: true,
      default: () => []
    },
    searchTerm: {
      type: String,
      default: ''
    }
  },
  methods: {
    handlePokemonSelected(pokemon) {
      this.$emit('pokemon-selected', pokemon)
    }
  }
}
</script>

<style scoped>
.list-title { color:#222; font-weight:bold; font-family:'Courier New', monospace; }
</style>
