import { createRouter, createWebHistory } from 'vue-router'
import Inicio from '../views/Inicio.vue'
import Tareas from '../views/Tareas.vue'
import AcercaDe from '../views/AcercaDe.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: Inicio
    },
    {
      path: '/tareas',
      name: 'tareas',
      component: Tareas
    },
    {
      path: '/acerca-de',
      name: 'acerca-de',
      component: AcercaDe
    }
  ],
})

export default router
