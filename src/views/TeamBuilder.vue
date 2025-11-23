<template>
  <v-app class="pixel-font">
    <v-app-bar class="gba-app-bar" flat>
      <v-toolbar-title class="d-flex align-center gba-title">
        <img src="/images/pokeball-pixel.png" alt="Pokeball pixel" style="height:2.2em;margin-right:0.5em;vertical-align:middle;" />
        <span class="gba-title-text gba-title-pixel">Equipo</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" variant="outlined" color="yellow" class="pixel-font"><v-icon left>mdi-arrow-left</v-icon> Volver</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-card class="mb-4" variant="outlined" rounded="xl">
          <v-card-title class="text-subtitle-1 d-flex align-center">
            <img src="/images/pokeball-pixel.png" alt="Pokeball pixel" style="height:1.5em;margin-right:0.5em;vertical-align:middle;" />
            Equipo ({{ store.teamCount }}/6)
            <v-spacer />
            <v-btn size="x-small" :disabled="store.teamCount===0" @click="clearTeam" variant="text">Vaciar</v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row class="align-center">
              <v-col cols="12" md="4">
                <v-text-field v-model="addInput" label="Nombre o ID" density="compact" variant="outlined" @keyup.enter="handleAdd" />
              </v-col>
              <v-col cols="12" md="2">
                <v-btn color="primary" :disabled="!addInput || store.teamCount>=6" @click="handleAdd">Agregar</v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption">Cobertura de Tipos:</div>
                <div class="d-flex flex-wrap">
                  <v-chip
                    v-for="(count, type) in coverage"
                    :key="type"
                    :color="store.typeColors[type]"
                    class="ma-1"
                    size="x-small"
                    variant="elevated"
                    style="text-transform:capitalize"
                  >{{ type }} ({{ count }})</v-chip>
                  <span v-if="Object.keys(coverage).length===0" class="text-disabled">Sin tipos todavía</span>
                </div>
              </v-col>
            </v-row>
            <v-divider class="my-4" />
            <v-row>
              <v-col 
                v-for="(p, idx) in store.teamData" 
                :key="p.id" 
                cols="12" 
                sm="6" 
                md="4"
                draggable="true"
                @dragstart="onDragStart(idx)"
                @dragover.prevent
                @drop="onDrop(idx)"
              >
                <v-card rounded="xl" variant="outlined" class="team-member-card">
                  <v-card-title class="d-flex align-center">
                    <v-avatar size="56" class="me-2">
                      <img :src="`/images/pokemon-${p.id}.png`" :alt="p.name" />
                    </v-avatar>
                    <div>
                      <div class="text-subtitle-2" style="text-transform:capitalize">#{{ p.id }} {{ p.name }}</div>
                      <div>
                        <v-chip v-for="t in p.types" :key="t" size="x-small" class="me-1" :color="store.typeColors[t]" style="text-transform:capitalize" />
                      </div>
                    </div>
                    <v-spacer />
                    <v-btn icon="mdi-close" size="x-small" variant="text" @click="remove(p.id)" />
                  </v-card-title>
                </v-card>
              </v-col>
              <v-col v-if="store.teamCount===0" cols="12">
                <v-alert type="info" variant="tonal" title="Equipo vacío" text="Agrega Pokémon para ver la cobertura de tipos." />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import { onMounted, computed, ref } from 'vue'
import { usePokemonStore } from '../store/pokemon'

export default {
  name: 'TeamBuilder',
  setup() {
    const store = usePokemonStore()
    const addInput = ref('')
    const coverage = computed(() => store.teamCoverage)
    const draggedIndex = ref(null)

    async function handleAdd() {
      const raw = addInput.value.trim().toLowerCase()
      if (!raw) return
      // si es id numérico, convertir a número
      const idOrName = isNaN(Number(raw)) ? raw : Number(raw)
      if (store.teamCount >= 6) return
      try {
        // validar existencia rápida
        const { data } = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(idOrName)}`)
        if (!data) return
        const json = await data.json()
        store.addToTeam(json.id)
        addInput.value = ''
      } catch (_) {
        // ignorar errores de fetch
      }
    }
    function remove(id) { store.removeFromTeam(id) }
    function clearTeam() {
      [...store.team].forEach(id => store.removeFromTeam(id))
    }
    function onDragStart(idx) {
      draggedIndex.value = idx
    }
    function onDrop(targetIdx) {
      if (draggedIndex.value === null || draggedIndex.value === targetIdx) return
      const team = [...store.teamData]
      const [removed] = team.splice(draggedIndex.value, 1)
      team.splice(targetIdx, 0, removed)
      store.team = team.map(p => p.id)
      store.loadTeam()
      draggedIndex.value = null
    }
    onMounted(() => { store.loadTeam() })

    return { store, addInput, handleAdd, remove, clearTeam, coverage, onDragStart, onDrop }
  }
}
</script>

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
.team-member-card {
  cursor: grab;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.team-member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
.team-member-card:active {
  cursor: grabbing;
}
</style>