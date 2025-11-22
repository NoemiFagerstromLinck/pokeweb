<template>
  <v-app class="pixel-font">
    <v-app-bar class="gba-app-bar" flat>
      <v-toolbar-title class="d-flex align-center gba-title">
        <img src="/images/pokeball-pixel.png" alt="Pokeball pixel" style="height:2.2em;margin-right:0.5em;vertical-align:middle;" />
        <span class="gba-title-text gba-title-pixel">Comparar Pokémon</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" variant="outlined" color="yellow" class="pixel-font"><v-icon left>mdi-arrow-left</v-icon> Volver</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-card rounded="xl" variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1 d-flex align-center">
            <img src="/images/pokeball-pixel.png" alt="Pokeball pixel" style="height:1.5em;margin-right:0.5em;vertical-align:middle;" />
            Comparar Pokémon
            <v-spacer />
            <v-btn size="x-small" variant="text" @click="reset">Reset</v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="leftInput" label="Izquierda (nombre o ID)" variant="outlined" density="compact" @keyup.enter="loadLeft" />
                <div v-if="leftLoading" class="py-2"><v-progress-linear indeterminate color="purple" /></div>
                <PokemonMini v-if="left" :pokemon="left" side="left" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="rightInput" label="Derecha (nombre o ID)" variant="outlined" density="compact" @keyup.enter="loadRight" />
                <div v-if="rightLoading" class="py-2"><v-progress-linear indeterminate color="pink" /></div>
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
                      <td :class="cellClass(statValue(left,s), statValue(right,s), 'left')">{{ statValue(left,s) }}</td>
                      <td :class="cellClass(statValue(right,s), statValue(left,s), 'right')">{{ statValue(right,s) }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12">
                <v-alert type="info" variant="tonal" title="Selecciona dos" text="Ingresa nombre o ID y presiona Enter para cada lado." />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>
import { ref } from 'vue'
import { usePokemonStore } from '../store/pokemon'
import PokemonMini from '../components/PokemonMini.vue'

const STAT_MAP = {
  hp: 'hp', attack: 'attack', defense: 'defense', 'special-attack': 'special-attack', 'special-defense': 'special-defense', speed: 'speed'
}



  name: 'Comparator',
  components: { PokemonMini },
  setup() {
    const store = usePokemonStore()
    const leftInput = ref('')
    const rightInput = ref('')
    const left = ref(null)
    const right = ref(null)
    const leftLoading = ref(false)
    const rightLoading = ref(false)

    const statNames = Object.keys(STAT_MAP)

    function statValue(p, key) {
      if (!p) return '-'
      const found = p.stats.find(s => s.stat.name === key)
      return found ? found.base_stat : 0
    }

    function cellClass(val, other, side) {
      if (val === other) return ''
      return val > other ? (side==='left' ? 'text-success' : 'text-success') : 'text-error'
    }

    async function loadLeft() {
      const raw = leftInput.value.trim().toLowerCase()
      if (!raw) return
      leftLoading.value = true
      left.value = await store.getPokemon(raw)
      leftLoading.value = false
    }
    async function loadRight() {
      const raw = rightInput.value.trim().toLowerCase()
      if (!raw) return
      rightLoading.value = true
      right.value = await store.getPokemon(raw)
      rightLoading.value = false
    }
    function reset() {
      leftInput.value=''; rightInput.value=''; left.value=null; right.value=null
    }

    return { store, leftInput, rightInput, left, right, loadLeft, loadRight, reset, statNames, statValue, cellClass, leftLoading, rightLoading }
  }
}
// ...existing code...
<style scoped>
.pixel-font, .gba-title-text, .gba-title-pixel, .v-btn, .v-card-title, .v-card-text, .v-chip, .v-toolbar-title, .text-caption, .text-subtitle-1, .text-subtitle-2, .text-h5, .text-h6, .text-h4, .text-h3, .text-h2, .text-h1 {
  font-family: 'Press Start 2P', monospace !important;
  letter-spacing: 0.5px;
}
body, .v-application {
  background: linear-gradient(180deg, #1e2a78 0%, #3a8dde 100%) fixed !important;
  min-height: 100vh;
  background-attachment: fixed;
}
body::before, .v-application::before {
  content: "";
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  background: repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 8px);
  z-index: 0;
}
.text-success { color: #2e7d32; font-weight: 600; }
.text-error { color: #c62828; font-weight: 600; }
</style>
