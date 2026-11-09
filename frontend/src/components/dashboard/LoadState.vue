<script setup>
// Shows a loading placeholder, or an error with a retry button, until the page content can be shown.
defineProps({
  loading: { type: Boolean, default: false },
  error: { default: null },
})

defineEmits(['retry'])
</script>

<template>
  <div v-if="loading" class="dash-skeleton" aria-busy="true" aria-label="Loading">
    <span v-for="n in 3" :key="n" class="dash-skeleton__block" />
  </div>
  <div v-else-if="error" class="dash-state" role="alert">
    <v-icon icon="mdi-alert-circle-outline" size="32" color="error" />
    <p class="dash-state__text">{{ error.message || "Couldn't load this page." }}</p>
    <v-btn color="secondary" rounded="lg" @click="$emit('retry')">Try again</v-btn>
  </div>
  <slot v-else />
</template>
