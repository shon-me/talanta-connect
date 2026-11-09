<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
  icon: { type: String, default: '' },
  tone: { type: Number, default: 0 }, // 0 to 3: colour of the icon
})
</script>

<template>
  <div class="dash-stat">
    <v-icon v-if="icon" :icon="icon" class="dash-stat__icon" :class="`dash-stat__icon--${tone % 4}`" />
    <p class="dash-stat__label">{{ label }}</p>
    <p class="dash-stat__value">{{ value }}</p>
    <p v-if="hint" class="dash-stat__hint">{{ hint }}</p>
  </div>
</template>
