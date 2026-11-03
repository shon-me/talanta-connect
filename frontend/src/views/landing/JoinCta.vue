<script setup>
import GlassPill from '@/components/ui/GlassPill.vue'
// Static section: no data needed. Copy is placeholder, replace with your team's wording.
</script>

<template>
  <section
    id="join"
    class="home-section join-cta animated-bg animated-bg--brand"
    aria-labelledby="join-title"
  >
    <span class="blob blob-1" aria-hidden="true" />
    <span class="blob blob-2" aria-hidden="true" />
    <span class="blob blob-3" aria-hidden="true" />

    <div class="join-cta__inner">
      <h2 id="join-title" class="join-cta__title">Your next collaboration starts with a profile</h2>
      <p class="join-cta__lead">
        Join Talanta Connect to share your work, meet brands that hire and grow alongside other creators.
      </p>

      <div class="join-cta__perks">
        <GlassPill icon="mdi-check-circle-outline">Free to join</GlassPill>
        <GlassPill icon="mdi-eye-outline">Get discovered</GlassPill>
        <GlassPill icon="mdi-handshake-outline">Work with brands</GlassPill>
      </div>

      <div class="join-cta__actions">
        <!-- Routes to the sign up page. To sign up in place instead, drop <SignupForm /> into a v-dialog here. -->
        <v-btn color="secondary" size="x-large" rounded="lg" to="/signup">Create your free account</v-btn>
        <v-btn color="white" variant="outlined" size="x-large" rounded="lg" to="/login">Log in</v-btn>
      </div>
    </div>
  </section>
</template>
