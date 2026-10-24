<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import AppLogo from '@/components/ui/AppLogo.vue'
import { navLinks } from '@/constants/navigation'
import { useAuthStore } from '@/stores/auth'

// The logo sits on the right for now. Pass logo-side="left" to flip it.
defineProps({
  logoSide: { type: String, default: 'right', validator: (v) => ['left', 'right'].includes(v) },
})

const auth = useAuthStore()
const route = useRoute()
const { mdAndUp } = useDisplay()

const drawer = ref(false)
const initial = computed(() => auth.user?.fullName?.trim()?.[0]?.toUpperCase() ?? '?')

// Close the side menu after navigating, and if the screen grows to desktop size while it is open
watch(() => route.fullPath, () => { drawer.value = false })
watch(mdAndUp, (isDesktop) => { if (isDesktop) drawer.value = false })
</script>

<template>
  <!-- Keep :height in sync with --app-bar-height in main.css -->
  <v-app-bar
    class="app-bar glass"
    :class="{ 'app-bar--logo-left': logoSide === 'left' }"
    :height="64"
    flat
  >
    <div class="app-bar__inner">
      <!-- Phones and tablets: opens the side menu -->
      <v-app-bar-nav-icon
        class="app-bar__menu-btn d-md-none"
        aria-label="Open menu"
        :aria-expanded="drawer"
        @click="drawer = !drawer"
      />

      <!-- Desktop: links in the bar -->
      <nav class="app-bar__nav d-none d-md-flex" aria-label="Main">
        <v-btn
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :exact="link.exact"
          variant="text"
          class="app-bar__link"
        >
          {{ link.label }}
        </v-btn>
      </nav>

      <v-spacer />

      <div class="app-bar__actions d-none d-md-flex">
        <template v-if="!auth.isAuthenticated">
          <v-btn to="/login" variant="text" class="app-bar__link">Log in</v-btn>
          <v-btn to="/signup" color="secondary" variant="flat" rounded="lg">Sign up</v-btn>
        </template>

        <!-- BACKEND: shown once the auth store has a user (see stores/auth.js) -->
        <v-menu v-else location="bottom end">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="text" aria-label="Account menu">
              <v-avatar color="secondary" size="36">{{ initial }}</v-avatar>
            </v-btn>
          </template>
          <v-list density="compact" nav>
            <v-list-item to="/profile" title="My profile" prepend-icon="mdi-account-outline" />
            <v-list-item title="Log out" prepend-icon="mdi-logout" @click="auth.logout()" />
          </v-list>
        </v-menu>
      </div>

      <AppLogo class="app-bar__logo" />
    </div>
  </v-app-bar>

  <!-- Side menu for smaller screens -->
  <v-navigation-drawer v-model="drawer" class="app-drawer" temporary location="left" width="300">
    <div class="app-drawer__head">
      <AppLogo />
      <v-btn icon="mdi-close" variant="text" size="small" aria-label="Close menu" @click="drawer = false" />
    </div>

    <v-list nav>
      <v-list-item
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        :exact="link.exact"
        :prepend-icon="link.icon"
        :title="link.label"
        rounded="lg"
        @click="drawer = false"
      />
    </v-list>

    <template #append>
      <div class="app-drawer__actions">
        <template v-if="!auth.isAuthenticated">
          <v-btn to="/signup" color="secondary" size="large" rounded="lg" block @click="drawer = false">
            Sign up
          </v-btn>
          <v-btn
            to="/login"
            class="app-drawer__outline"
            variant="outlined"
            size="large"
            rounded="lg"
            block
            @click="drawer = false"
          >
            Log in
          </v-btn>
        </template>
        <template v-else>
          <v-btn to="/profile" color="secondary" size="large" rounded="lg" block @click="drawer = false">
            My profile
          </v-btn>
          <v-btn
            class="app-drawer__outline"
            variant="outlined"
            size="large"
            rounded="lg"
            block
            @click="auth.logout(); drawer = false"
          >
            Log out
          </v-btn>
        </template>
      </div>
    </template>
  </v-navigation-drawer>
</template>
