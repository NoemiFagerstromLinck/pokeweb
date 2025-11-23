
# Pokeguía - Proyecto Final Bootcamp UNAB Front End

_Proyecto personal de fin de bootcamp UNAB Front End - 2025_

Aplicación web desarrollada con Vue 3, Vuetify y Pinia, que permite explorar, buscar y comparar Pokémon de la región Hoenn y clásicos. Cumple con todos los requisitos del proyecto final, incluyendo manejo de estado, rutas, consumo de API, responsividad y buenas prácticas.


## Objetivo
Proveer una experiencia de búsqueda, exploración y comparación de Pokémon con una interfaz moderna, responsiva y basada en Material Design.


## Requisitos del Proyecto y Cumplimiento

- [x] **Framework UI:** Vue 3 + Vuetify 3 (Material Design)
- [x] **Pinia / Manejador de Estados:** Pinia para gestión global de estado (`src/store/pokemon.js`)
- [x] **Rutas:** vue-router para navegación SPA (`src/router/index.js`)
- [x] **HTML5:** Estructura semántica y moderna
- [x] **Responsivo:** Grid y componentes Vuetify, diseño mobile-first
- [x] **Buenas Prácticas:** Código modular, componentes reutilizables, separación de lógica y vista
- [x] **Axios / Fetch:** Consumo de PokéAPI usando fetch
- [x] **Web montada:** [Ver app desplegada en GitHub Pages](https://noemifagerstromlinck.github.io/pokeweb/)


## Tecnologías y Herramientas
- **Vue 3** + **Vite**
- **Vuetify 3** (UI Material Design)
- **Pinia** (store global)
- **vue-router** (rutas SPA)
- **Fetch** (consumo PokéAPI)
- **GitHub Pages** (deploy)


## Instalación y Ejecución Local

```bash
git clone https://github.com/NoemiFagerstromLinck/pokeweb.git
cd Pokeweb
npm install
npm run dev
```
App local: [http://localhost:3000/](http://localhost:3000/)


## Despliegue

La app está montada en GitHub Pages:
👉 [https://noemifagerstromlinck.github.io/pokeweb/](https://noemifagerstromlinck.github.io/pokeweb/)


## Estructura relevante
```
src/
  main.js           # Inicializa Vue, Vuetify, Pinia y router
  App.vue           # Layout principal
  router/index.js   # Rutas SPA
  store/pokemon.js  # Pinia store
  views/            # Vistas principales (explorar, favoritos, equipo, comparar)
  components/       # Componentes reutilizables
  data/             # Datos locales y helpers
public/
  images/           # Sprites y assets
  fonts/            # Tipografías
```


## Componentes Clave
- `VuetifyDemo.vue`: Búsqueda, sugerencias, detalles (habilidades, movimientos), visualización de datos con componentes Vuetify (autocomplete, chips, expansion panels, alerts, avatar).
- `TeamBuilder.vue`: Armado de equipo, drag & drop, chips de tipos, validación de máximo 6 Pokémon.
- `FavoritesView.vue`: Gestión de favoritos con Pinia.
- `Comparator.vue`: Comparación visual de dos Pokémon.
- `PokemonList.vue`: Grid responsivo usando `<v-row>` y `<v-col>` + alerta informativa.
- `PokemonCard.vue`: Tarjeta visual con `<v-card>`, `<v-avatar>`, `<v-chip>` y estilos personalizados.


## Funcionalidad
- Consumo dinámico de PokéAPI (`/pokemon/{name}`) y species para descripción.
- Paleta de colores por tipo aplicada a cabecera y chips.
- Fallback y manejo de errores (mensaje de no encontrado / carga / efectos).
- Limitación razonable de movimientos (primeros 10) con detalles (potencia, precisión, PP, efecto).
- Carga bajo demanda de detalles de habilidades.
- Responsive y mobile-first.
- Drag & drop en armado de equipo.
- Favoritos persistentes con Pinia.


## Buenas Prácticas y Limpieza
- Código modular y componentes reutilizables.
- Eliminadas dependencias y estilos de Bootstrap, Buefy y Element Plus.
- Refactor a Vuetify y Material Design.
- Separación de lógica, datos y presentación.


## Mejoras Futuras (Opcional)
- Integrar tema oscuro/claro con switch Vuetify.
- Añadir almacenamiento local de últimos Pokémon buscados.
- Incorporar paginación o virtual scroll para listas grandes.
- Migrar MusicPlayer a componente Vue con controles Vuetify.


## Comandos Útiles
```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run preview  # Previsualizar build
```


## Notas
- Se redujo el peso del bundle al remover múltiples librerías solapadas.
- Proyecto realizado como entrega final para Bootcamp UNAB Front End 2025.

---
Proyecto simplificado a una única experiencia consistente con Vuetify.