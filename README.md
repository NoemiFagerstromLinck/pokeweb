# Pokeguía (Sólo Vuetify)

Aplicación Vue 3 enfocada exclusivamente en una Pokeguía usando Vuetify como única librería de UI. Se han eliminado por completo las implementaciones anteriores de Bootstrap, Buefy y Element Plus para simplificar mantenimiento y peso del proyecto.

## Objetivo
Proveer una experiencia de búsqueda y exploración de Pokémon (Hoenn + clásicos) con una interfaz consistente basada en componentes Vuetify.

## Estado Actual
- Librería UI única: Vuetify 3
- Enrutamiento reducido: Ruta raíz `/` que carga `VuetifyDemo.vue`
- Componentes refactorizados a Vuetify (`PokemonCard.vue`, `PokemonList.vue`)
- Dependencias externas limpias (removidos bootstrap, buefy, element-plus, íconos innecesarios)

## Tecnologías
- Vue 3 + Vite
- Vuetify 3 (Material Design)
- Axios (consumo PokéAPI)
- Firebase (archivo base listo; uso opcional no acoplado a la vista principal)

## Instalación
```bash
npm install
```

## Ejecución
```bash
npm run dev
```
Aplicación en `http://localhost:3000/`.

## Estructura relevante
```
src/
  main.js           # Inicializa Vue y Vuetify
  App.vue           # Envuelve router en <v-app>
  router/index.js   # Sólo ruta principal
  views/
    VuetifyDemo.vue # Vista principal Pokeguía
  components/
    PokemonCard.vue # Tarjeta adaptada a v-card / v-chip
    PokemonList.vue # Lista usando v-row / v-col / v-alert
  data/
    pokemon.js / pokemonDetails.js / pokemonImages.js
```

## Componentes Clave
- `VuetifyDemo.vue`: Búsqueda, sugerencias, detalles (habilidades, movimientos) y visualización de datos con componentes Vuetify (autocomplete, chips, expansion panels, alerts, avatar).
- `PokemonList.vue`: Grid responsivo usando `<v-row>` y `<v-col>` + alerta informativa.
- `PokemonCard.vue`: Tarjeta visual con `<v-card>`, `<v-avatar>`, `<v-chip>` y estilos personalizados.

## Datos y Funcionalidad
- Consumo dinámico de PokéAPI (`/pokemon/{name}`) y species para descripción.
- Paleta de colores por tipo aplicada a cabecera y chips.
- Fallback y manejo de errores (mensaje de no encontrado / carga / efectos).
- Limitación razonable de movimientos (primeros 10) con detalles (potencia, precisión, PP, efecto).
- Carga bajo demanda de detalles de habilidades.

## Limpieza Realizada
- Eliminadas vistas: `BootstrapDemo.vue`, `BuefyDemo.vue`, `ElementDemo.vue`, `UIComparison.vue`.
- Eliminadas dependencias y estilos de Bootstrap, Buefy y Element Plus.
- Simplificado `router/index.js` a una sola ruta.
- Refactorizados componentes a sintaxis y estructura Vuetify.

## Próximas Mejoras (Opcional)
- Integrar tema oscuro/claro con switch Vuetify.
- Añadir almacenamiento local de últimos Pokémon buscados.
- Incorporar paginación o virtual scroll para listas grandes.
- Migrar MusicPlayer a componente Vue con controles Vuetify (actualmente lógica simple en `MusicPlayer.js`).

## Comandos Útiles
```bash
npm run dev      # Desarrollo
npm run build    # Construcción producción
npm run preview  # Previsualizar build
```

## Notas
- El archivo `firebase.js` permanece para futura autenticación, pero la UI actual no depende de él.
- Se redujo el peso del bundle al remover múltiples librerías solapadas.

---
Proyecto simplificado a una única experiencia consistente con Vuetify.