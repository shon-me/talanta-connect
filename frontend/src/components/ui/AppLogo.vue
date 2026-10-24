<script setup>
// PLACEHOLDER LOGO. When the real logo arrives:
//   1. put the file in src/assets/ (e.g. logo.svg)
//   2. replace the <span class="app-logo__mark"> below with:
//        <img class="app-logo__img" src="@/assets/logo.svg" alt="" />
//   3. if the logo already contains the name, set :show-text="false" where AppLogo is used.
defineProps({
  showText: { type: Boolean, default: true },
})
</script>

<template>
  <router-link to="/" class="app-logo" aria-label="Talanta Connect, home">
    <span class="app-logo__mark" aria-hidden="true">TC</span>
    <span v-if="showText" class="app-logo__text">Talanta Connect</span>
  </router-link>
</template>
