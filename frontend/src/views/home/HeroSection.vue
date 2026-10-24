<script setup>
import { ref } from 'vue'
import SignupForm from '@/components/auth/SignupForm.vue'
import HeroCarousel from './HeroCarousel.vue'

const welcomeOpen = ref(false)

function onSignedUp() {
  welcomeOpen.value = true
  // BACKEND: once register returns, send the user to onboarding or "check your email",
  // e.g. router.push({ name: 'onboarding' }) when that route exists.
}
</script>

<template>
  <section id="hero" class="home-section hero" aria-labelledby="hero-title">
    <h1 id="hero-title" class="visually-hidden">Talanta Connect</h1>

    <div class="hero__media">
      <HeroCarousel />
    </div>

    <aside class="hero__aside animated-bg animated-bg--brand">
      <span class="blob blob-1" aria-hidden="true" />
      <span class="blob blob-2" aria-hidden="true" />
      <span class="blob blob-3" aria-hidden="true" />

      <div class="hero__panel glass glass-dark">
        <h2 class="hero__panel-title">Join Talanta Connect</h2>
        <p class="hero__panel-text">Free for creators and brands. Set up your profile in a few minutes.</p>
        <SignupForm dark @success="onSignedUp" />
      </div>
    </aside>

    <v-snackbar v-model="welcomeOpen" color="success" timeout="5000">
      Account created. Welcome to Talanta Connect!
    </v-snackbar>
  </section>
</template>
