import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  // Smooth scrolling for #hash links and a clean reset on route change
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },

  routes: [
    { path: '/', name: 'home', component: HomeView },

    // Pages the homepage links to. Add them as the views get built:
    // { path: '/signup', name: 'signup', component: () => import('@/views/SignupView.vue') },
    // { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    // { path: '/brands/:slug', name: 'brand', component: () => import('@/views/BrandView.vue') },
    // { path: '/creators/:slug', name: 'creator', component: () => import('@/views/CreatorView.vue') },
    // { path: '/creators', name: 'creators', component: () => import('@/views/CreatorsView.vue') },
  ],
})

export default router
