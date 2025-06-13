import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: 'Accueil',
    },
  },
  {
    path: '/recommendation',
    name: 'recommendation',
    component: () => import('@/views/Recommendation.vue'),
    meta: {
      title: 'Recommandations',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: 'Page non trouvée',
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash }
    }
    return { top: 0 }
  },
})

// Gestion des titres de page
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Booksy` || 'Booksy'
  next()
})
