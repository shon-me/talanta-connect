<script setup>
import BackButton from '@/components/ui/BackButton.vue'
</script>

<template>
  <section class="auth" aria-labelledby="not-found-title">
    <div class="auth__inner">
      <BackButton class="auth__back" fallback="/" />
      <div class="auth__card">
        <h1 id="not-found-title" class="auth__title">Page not found</h1>
        <p class="auth__lead">The page you were looking for does not exist or has moved.</p>
        <v-btn to="/" color="secondary" size="large" rounded="lg" block>Go to the home page</v-btn>
      </div>
    </div>
  </section>
</template>
