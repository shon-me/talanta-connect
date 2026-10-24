<script setup>
// Small frosted label for text that sits on top of images.
defineProps({
  tone: { type: String, default: 'dark', validator: (v) => ['dark', 'light', 'primary'].includes(v) },
  size: { type: String, default: 'md', validator: (v) => ['md', 'sm'].includes(v) },
  icon: { type: String, default: '' },
})
</script>

<template>
  <span
    class="glass glass-pill"
    :class="[
      `glass-pill--${tone}`,
      `glass-pill--${size}`,
      { 'glass-dark': tone === 'dark', 'glass-primary': tone === 'primary' },
    ]"
  >
    <v-icon v-if="icon" :icon="icon" size="small" />
    <span class="glass-pill__text"><slot /></span>
  </span>
</template>
