<template>
  <v-card class="mb-4" variant="outlined" rounded="xl">
    <v-card-title class="text-subtitle-1 d-flex align-center">
      <v-icon left color="red">mdi-filter</v-icon>
      Filtros Avanzados
      <v-spacer />
      <v-btn size="x-small" variant="text" @click="reset">Reset</v-btn>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="localSearch" label="Nombre contiene" variant="outlined" density="compact" @input="emitFilters" clearable />
        </v-col>
        <v-col cols="12" md="4">
          <v-range-slider
            v-model="idRange"
            :max="386"
            :min="1"
            step="1"
            thumb-label="always"
            class="mt-6"
            @end="emitFilters"
          ></v-range-slider>
          <div class="text-caption">ID: {{ idRange[0] }} - {{ idRange[1] }}</div>
        </v-col>
        <v-col cols="12" md="4">
          <div class="text-caption mb-1">Tipos</div>
          <div class="d-flex flex-wrap">
            <v-chip
              v-for="t in allTypes"
              :key="t.en"
              size="x-small"
              class="ma-1"
              :color="isSelectedType(t) ? typeColors[t.en] : undefined"
              :variant="isSelectedType(t) ? 'elevated' : 'outlined'"
              @click="toggleType(t)"
              style="cursor:pointer; text-transform:capitalize;"
            >{{ t.es }}</v-chip>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import { usePokemonStore } from '../store/pokemon'
export default {
  name: 'FilterPanel',
  emits: ['update:filters'],
  setup() { const store = usePokemonStore(); return { store } },
  data() {
    return {
      localSearch: '',
      idRange: [1, 200],
      selectedTypes: []
    }
  },
  computed: {
    typeColors() { return this.store.typeColors },
    allTypes() {
      return [
        { es: 'Planta', en: 'grass' },
        { es: 'Fuego', en: 'fire' },
        { es: 'Agua', en: 'water' },
        { es: 'Eléctrico', en: 'electric' },
        { es: 'Hielo', en: 'ice' },
        { es: 'Tierra', en: 'ground' },
        { es: 'Roca', en: 'rock' },
        { es: 'Hada', en: 'fairy' },
        { es: 'Veneno', en: 'poison' },
        { es: 'Bicho', en: 'bug' },
        { es: 'Dragón', en: 'dragon' },
        { es: 'Siniestro', en: 'dark' },
        { es: 'Acero', en: 'steel' },
        { es: 'Psíquico', en: 'psychic' },
        { es: 'Volador', en: 'flying' },
        { es: 'Lucha', en: 'fighting' },
        { es: 'Fantasma', en: 'ghost' },
        { es: 'Normal', en: 'normal' }
      ];
    },
  },
  methods: {
    emitFilters() {
      this.$emit('update:filters', { text: this.localSearch.trim(), idRange: this.idRange, types: this.selectedTypes })
    },
    toggleType(typeObj) {
      const idx = this.selectedTypes.indexOf(typeObj.en)
      if (idx >= 0) {
        this.selectedTypes.splice(idx, 1)
      } else {
        this.selectedTypes.push(typeObj.en)
      }
      this.emitFilters()
    },
    isSelectedType(typeObj) { return this.selectedTypes.includes(typeObj.en) },
    reset() { this.localSearch=''; this.idRange=[1,200]; this.selectedTypes=[]; this.emitFilters() }
  }
}
</script>
