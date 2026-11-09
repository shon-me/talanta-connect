import { createRouter, createWebHistory } from "vue-router";
import { ADMIN_BASE } from "@/constants/dashboardNav";
import { USE_MOCK } from "@/services/api";
import { useAuthStore } from "@/stores/auth";
import { resolveAccess } from "./access";

const sharedPages = (kind) => [
  {
    path: "analytics",
    name: `${kind}-analytics`,
    component: () => import("@/views/dashboard/AnalyticsPage.vue"),
    meta: { title: "Analytics" },
  },
  {
    path: "payments",
    name: `${kind}-payments`,
    component: () => import("@/views/dashboard/PaymentsPage.vue"),
    meta: { title: "Payments" },
  },
  {
    path: "notifications",
    name: `${kind}-notifications`,
    component: () => import("@/views/dashboard/NotificationsPage.vue"),
    meta: { title: "Notifications" },
  },
  {
    path: "settings",
    name: `${kind}-settings`,
    component: () => import("@/views/dashboard/SettingsPage.vue"),
    meta: { title: "Settings" },
  },
];

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

    // ---------- creator dashboard ----------
    {
      path: "/dashboard/creator",
      component: () => import("@/views/dashboard/DashboardLayout.vue"),
      props: { kind: "creator" },
      meta: { requiresAuth: true, role: "creator", dashboard: true },
      children: [
        {
          path: "",
          name: "creator-overview",
          component: () => import("@/views/dashboard/OverviewPage.vue"),
          meta: { title: "Overview" },
        },
        {
          path: "collaborations",
          name: "creator-collaborations",
          component: () => import("@/views/dashboard/creator/BrandsPage.vue"),
          meta: { title: "Brand collaborations" },
        },
        {
          path: "scopes",
          name: "creator-scopes",
          component: () => import("@/views/dashboard/creator/ScopesPage.vue"),
          meta: { title: "Scope of work" },
        },
        ...sharedPages("creator"),
      ],
    },

    // ---------- brand dashboard ----------
    {
      path: "/dashboard/brand",
      component: () => import("@/views/dashboard/DashboardLayout.vue"),
      props: { kind: "brand" },
      meta: { requiresAuth: true, role: "brand", dashboard: true },
      children: [
        {
          path: "",
          name: "brand-overview",
          component: () => import("@/views/dashboard/OverviewPage.vue"),
          meta: { title: "Overview" },
        },
        {
          path: "campaigns",
          name: "brand-campaigns",
          component: () => import("@/views/dashboard/brand/CampaignsPage.vue"),
          meta: { title: "Campaigns" },
        },
        {
          path: "collaborations",
          name: "brand-collaborations",
          component: () => import("@/views/dashboard/brand/CreatorsPage.vue"),
          meta: { title: "Creator collaborations" },
        },
        ...sharedPages("brand"),
      ],
    },

    // ---------- admin: not linked from anywhere, see ADMIN_BASE in constants/dashboardNav.js ----------
    {
      path: `${ADMIN_BASE}/login`,
      name: "admin-login",
      component: () => import("@/views/admin/AdminLoginView.vue"),
      meta: { admin: true, adminLogin: true, dashboard: true },
    },
    {
      path: ADMIN_BASE,
      component: () => import("@/views/dashboard/DashboardLayout.vue"),
      props: { kind: "admin" },
      meta: { admin: true, dashboard: true },
      children: [
        {
          path: "",
          name: "admin-analysis",
          component: () => import("@/views/admin/AnalysisPage.vue"),
          meta: { title: "System analysis" },
        },
        {
          path: "verification",
          name: "admin-verification",
          component: () => import("@/views/admin/VerificationPage.vue"),
          meta: { title: "Verification" },
        },
        {
          path: "landing",
          name: "admin-landing",
          component: () => import("@/views/admin/LandingEditorPage.vue"),
          meta: { title: "Landing page editor" },
        },
        {
          path: "logs",
          name: "admin-logs",
          component: () => import("@/views/admin/LogsPage.vue"),
          meta: { title: "System logs" },
        },
        {
          path: "security",
          name: "admin-security",
          component: () => import("@/views/admin/SecurityPage.vue"),
          meta: { title: "Security reviews" },
        },
        {
          path: "notifications",
          name: "admin-notifications",
          component: () => import("@/views/dashboard/NotificationsPage.vue"),
          meta: { title: "Notifications" },
        },
      ],
    },

    // Anything else
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // DEV ONLY (mock mode): ?as=brand | creator | admin | guest on any address
  if (import.meta.env.DEV && USE_MOCK && to.query.as)
    auth.devPreview(String(to.query.as));

  await auth.restore();
  return resolveAccess(to, auth);
});

export default router;
