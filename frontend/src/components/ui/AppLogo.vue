<script setup>
defineProps({
  variant: { type: String, default: 'auto', validator: (v) => ['auto', 'full', 'mark'].includes(v) },
})
</script>

<template>
  <router-link to="/" class="app-logo" aria-label="Talanta Connect, home">
    <img class="app-logo__full" src="@/assets/logo-on-dark.svg" alt="" width="241" height="26" />
  </router-link>
</template>
