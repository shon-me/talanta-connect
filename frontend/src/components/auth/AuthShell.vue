<script setup>
import BackButton from '@/components/ui/BackButton.vue'

defineProps({
  title: { type: String, required: true },
  lead: { type: String, default: '' },
  backTo: { type: String, default: '/' }, // used when there is no previous page to go back to
})
</script>

<template>
  <section class="auth" aria-labelledby="auth-title">
    <div class="auth__inner">
      <BackButton class="auth__back" :fallback="backTo" />

      <div class="auth__card">
        <h1 id="auth-title" class="auth__title">{{ title }}</h1>
        <p v-if="lead" class="auth__lead">{{ lead }}</p>
        <slot />
      </div>
    </div>
  </section>
</template>
