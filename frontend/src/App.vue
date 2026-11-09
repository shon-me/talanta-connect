<script setup>
import AppBar from '@/components/layout/AppBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const showChrome = computed(() => !route.meta.dashboard)

const showAppLayouts = computed(() => {
  const isLoginView = route.path === "/login";
  const isSignupView = route.path === "/signup";

  return (
    !isLoginView && !isSignupView && showChrome
  );
})
</script>

<template>
  <v-app>
    <a class="skip-link" href="#main-content">Skip to content</a>

    <AppBar v-if="showChrome&&showAppLayouts" logo-side="left" />

    <v-main id="main-content">
      <router-view />
    </v-main>

    <AppFooter v-if="showChrome&&showAppLayouts" />
  </v-app>
</template>
