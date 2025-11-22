import { createRouter, createWebHistory } from 'vue-router'

const VuetifyDemo = () => import('../views/VuetifyDemo.vue')
const FavoritesView = () => import('../views/FavoritesView.vue')
const TeamBuilder = () => import('../views/TeamBuilder.vue')
const Comparator = () => import('../views/Comparator.vue')
const ExploreView = () => import('../views/ExploreView.vue')

const router = createRouter({
  // Use BASE_URL provided by Vite (from vite.config.js base)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: VuetifyDemo },
    { path: '/favoritos', name: 'Favoritos', component: FavoritesView },
    { path: '/equipo', name: 'Equipo', component: TeamBuilder },
    { path: '/comparar', name: 'Comparar', component: Comparator },
    { path: '/explorar', name: 'Explorar', component: ExploreView },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

export default router
