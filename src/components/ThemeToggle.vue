<template>
  <v-btn :color="isDark ? 'yellow' : 'blue-grey'" variant="tonal" @click="toggle">
    <v-icon start>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    {{ isDark ? 'Light' : 'Dark' }}
  </v-btn>
</template>
<script>
import { usePokemonStore } from '../store/pokemon'
import { useTheme } from 'vuetify'
import { computed } from 'vue'
export default {
  name: 'ThemeToggle',
  setup() {
    const store = usePokemonStore()
    const theme = useTheme()
    const isDark = computed(() => store.themeMode === 'dark')
    function toggle() {
      store.toggleTheme()
      theme.global.name.value = store.themeMode
    }
    // inicializar
    theme.global.name.value = store.themeMode
    return { toggle, isDark }
  }
}
</script>
