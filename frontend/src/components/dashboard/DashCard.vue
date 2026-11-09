<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <section class="dash-card">
    <header v-if="title || $slots.actions" class="dash-card__head">
      <div>
        <h2 class="dash-card__title">{{ title }}</h2>
        <p v-if="subtitle" class="dash-card__sub">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="dash-card__actions">
        <slot name="actions" />
      </div>
    </header>
    <slot />
  </section>
</template>
