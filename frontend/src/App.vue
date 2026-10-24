<script setup>
import AppBar from '@/components/layout/AppBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <v-app>
    <a class="skip-link" href="#main-content">Skip to content</a>

    <AppBar logo-side="left" />

    <v-main id="main-content">
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>
