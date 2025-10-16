import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/anime-watchlist/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/GetBody.vue')
    }
  ]
})

export default router
