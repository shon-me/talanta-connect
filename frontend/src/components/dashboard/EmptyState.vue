<script setup>
defineProps({
  icon: { type: String, default: 'mdi-inbox-outline' },
  title: { type: String, required: true },
  text: { type: String, default: '' },
})
</script>

<template>
  <div class="dash-empty">
    <v-icon :icon="icon" size="36" />
    <p class="dash-empty__title">{{ title }}</p>
    <p v-if="text" class="dash-empty__text">{{ text }}</p>
    <slot />
  </div>
</template>
