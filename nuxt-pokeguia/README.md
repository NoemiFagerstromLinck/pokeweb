# Pokeguía Nuxt Paralelo

Versión Nuxt 3 + Vuetify + Pinia del proyecto Pokeguía.

## Características
- Nuxt 3 SSR / SPA híbrido
- Vuetify 3 (tema light/dark, componentes)
- Pinia para estado (favoritos, equipo, búsqueda, caché básica)
- Páginas: `/` (buscador), `/favoritos`, `/equipo`, `/comparar`
- Axios para PokeAPI
- Skeleton loaders al buscar

## Scripts
```bash
npm install
npm run dev
npm run build
npm run generate
```

## Estructura
- `nuxt.config.ts` configuración global y meta tags
- `plugins/vuetify.ts` registro de Vuetify con SSR
- `stores/pokemon.ts` store principal
- `pages/` vistas equivalentes

## Próximos pasos
- Añadir caching persistente (IndexedDB)
- i18n (vue-i18n)
- PWA (workbox / nuxt module)
- Tests (Vitest) y ESLint
