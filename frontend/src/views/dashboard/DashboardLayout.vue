<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import AppLogo from '@/components/ui/AppLogo.vue'
import { ADMIN_BASE, DASHBOARD_BASE, DASHBOARD_LABEL, dashboardNav } from '@/constants/dashboardNav'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'

// One layout for the creator, brand and admin dashboards. The normal app bar and footer are switched
// off for these routes (see App.vue); this side panel replaces them.
const props = defineProps({
  kind: { type: String, required: true }, // 'creator' | 'brand' | 'admin'
})

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const notes = useNotificationStore()
const { mdAndUp } = useDisplay()
const { open: toastOpen, message: toastMessage, color: toastColor } = useToast()

const drawer = ref(true) // only used on small screens
const base = computed(() => DASHBOARD_BASE[props.kind])
const items = computed(() =>
  dashboardNav[props.kind].map((item) => ({ ...item, to: item.path ? `${base.value}/${item.path}` : base.value })),
)
const name = computed(() => auth.user?.fullName || 'Account')
const initial = computed(() => name.value.trim()[0]?.toUpperCase() ?? '?')

onMounted(() => notes.load(props.kind))
watch(() => route.fullPath, () => { drawer.value = true})

async function logout() {
  await auth.logout()
  router.push(props.kind === 'admin' ? `${ADMIN_BASE}/login` : '/')
}
</script>

<template>
  <div class="dash" :class="`dash--${kind}`">
    <v-navigation-drawer v-model="drawer" class="dash-drawer" :permanent="mdAndUp" :temporary="!mdAndUp" width="288">
      <div class="dash-drawer__top">
        <AppLogo variant="full" />
        <!-- Takes the user back to the normal site -->
        <v-btn to="/home" class="dash-back" variant="outlined" prepend-icon="mdi-arrow-left" rounded="lg" block>
          Back to site
        </v-btn>
      </div>

      <p class="dash-drawer__label">{{ DASHBOARD_LABEL[kind] }} dashboard</p>

      <v-list nav class="dash-nav">
        <v-list-item v-for="item in items" :key="item.to" :to="item.to" :exact="item.exact" :prepend-icon="item.icon"
          :title="item.label" rounded="lg" />
      </v-list>

      <template #append>
        <div class="dash-drawer__user">
          <v-avatar color="secondary" size="40">{{ initial }}</v-avatar>
          <div class="dash-drawer__who">
            <p class="dash-drawer__name">{{ name }}</p>
            <p class="dash-drawer__role">{{ DASHBOARD_LABEL[kind] }}</p>
          </div>
          <v-btn icon="mdi-logout" variant="text" aria-label="Log out" @click="logout" />
        </div>
      </template>
    </v-navigation-drawer>

    <div class="dash-body">
      <header class="dash-top">
        <v-btn v-if="!mdAndUp" icon="mdi-menu" variant="text" aria-label="Open menu" @click="drawer = true" />
        <span class="dash-top__label">{{ route.meta.title }}</span>
        <div class="dash-top__actions">
          <v-btn :to="`${base}/notifications`" icon variant="text" aria-label="Notifications">
            <v-badge :model-value="notes.unread > 0" :content="notes.unread" color="accent1">
              <v-icon icon="mdi-bell-outline" />
            </v-badge>
          </v-btn>
        </div>
      </header>

      <div class="dash-main">
        <router-view />
      </div>
    </div>

    <v-snackbar v-model="toastOpen" :color="toastColor || undefined" timeout="3500">{{ toastMessage }}</v-snackbar>
  </div>
</template>
