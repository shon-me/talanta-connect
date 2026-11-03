import { createRouter, createWebHistory } from "vue-router";
import { USE_MOCK } from "@/services/api";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return { ...savedPosition, behavior: "instant" };
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0, behavior: "instant" };
  },

  routes: [
    {
      path: "/",
      name: "landing",
      component: () => import("@/views/LandingView.vue"),
      meta: { guestOnly: true, snap: true },
    },

    {
      path: "/home",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: { requiresAuth: true },
    },

    {
      path: "/signup",
      name: "signup",
      component: () => import("@/views/SignupView.vue"),
      meta: { guestOnly: true },
    },

    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: { guestOnly: true },
    },

    {
      path: "/brand/:slug",
      name: "brand",
      component: () => import("@/views/BrandView.vue"),
      meta: { requiresAuth: true },
    },

    {
      path: "/brands",
      name: "brands",
      component: () => import("@/views/BrandsView.vue"),
      meta: { requiresAuth: true },
    },

    {
      path: "/creator/:slug",
      name: "creator",
      component: () => import("@/views/CreatorView.vue"),
      meta: { requiresAuth: true },
    },

    {
      path: "/creators",
      name: "creators",
      component: () => import("@/views/CreatorsView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (import.meta.env.DEV && USE_MOCK && to.query.as)
    auth.devPreview(String(to.query.as));

  await auth.restore();

  // BACKEND: this only hides the pages. The API must also refuse brand and creator data to
  // anyone who is not signed in (401), otherwise the data is still reachable by calling it directly.
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { path: "/home" };
  }
});

export default router;
