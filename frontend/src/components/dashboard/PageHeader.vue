<script setup>
defineProps({
  title: { type: String, required: true },
  lead: { type: String, default: '' },
})
</script>

<template>
  <header class="dash-page-head">
    <div>
      <h1 class="dash-page-head__title">{{ title }}</h1>
      <p v-if="lead" class="dash-page-head__lead">{{ lead }}</p>
    </div>
    <div v-if="$slots.default" class="dash-page-head__actions">
      <slot />
    </div>
  </header>
</template>
