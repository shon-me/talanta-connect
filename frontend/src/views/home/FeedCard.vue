<script setup>
import GlassPill from '@/components/ui/GlassPill.vue'

// Shared shell for brand and creator cards: image, text overlay, and the panel that opens on click.
defineProps({
  item: { type: Object, required: true }, // needs name, image, tone, type
  label: { type: String, required: true }, // small pill at the top of the image
  subline: { type: String, default: '' },  // line under the name
  expanded: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <article class="feed-card"
    :class="[`feed-card--${item.type}`, `feed-card--tone-${item.tone}`, { 'feed-card--expanded': expanded }]"
    @keydown.esc="expanded && emit('toggle')">
    <div class="feed-card__media">
      <!-- Image is whatever the brand manager / creator set in their dashboard (that upload lives there, not here) -->
      <v-img :src="item.image" alt="" cover class="feed-card__img" />
      <div class="feed-card__scrim" />

      <button type="button" class="feed-card__toggle" :aria-expanded="expanded"
        :aria-label="`${expanded ? 'Close' : 'Open'} details for ${item.name}`" @click="emit('toggle')" />

      <div class="feed-card__overlay">
        <GlassPill size="sm">{{ label }}</GlassPill>

        <div class="feed-card__bottom">
          <div class="feed-card__text">
            <h2 class="feed-card__name">{{ item.name }}</h2>
            <p v-if="subline" class="feed-card__subline">{{ subline }}</p>
          </div>
          <span class="feed-card__icon glass glass-dark" aria-hidden="true">
            <v-icon :icon="expanded ? 'mdi-close' : 'mdi-plus'" size="small" />
          </span>
        </div>
      </div>
    </div>

    <div v-if="expanded" class="feed-card__panel">
      <slot name="details" />
    </div>
  </article>
</template>
