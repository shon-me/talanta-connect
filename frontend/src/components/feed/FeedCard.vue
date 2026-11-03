<script setup>
import GlassPill from '@/components/ui/GlassPill.vue'

// Shared shell for every card in the app: image, text overlay, and a panel that opens beside it.
// Used for brand, creator, task and portfolio cards.
defineProps({
  name: { type: String, required: true },
  image: { type: String, default: '' },        // set by the brand manager / creator in their dashboard
  tone: { type: Number, default: 0 },          // 0 to 5: placeholder colour until there is an image
  kind: { type: String, default: 'item' },     // brand | creator | task | work
  label: { type: String, default: '' },        // small pill at the top of the image
  subline: { type: String, default: '' },      // line under the name
  expanded: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },   // always open, no toggle (profile page header)
  heading: { type: String, default: 'h2' },    // heading level for the name
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <article
    class="feed-card"
    :class="[
      `feed-card--${kind}`,
      `feed-card--tone-${tone}`,
      { 'feed-card--expanded': expanded || pinned, 'feed-card--pinned': pinned },
    ]"
    @keydown.esc="expanded && !pinned && emit('toggle')"
  >
    <div class="feed-card__media">
      <v-img :src="image || undefined" alt="" cover class="feed-card__img" />
      <div class="feed-card__scrim" />

      <button
        v-if="!pinned"
        type="button"
        class="feed-card__toggle"
        :aria-expanded="expanded"
        :aria-label="`${expanded ? 'Close' : 'Open'} details for ${name}`"
        @click="emit('toggle')"
      />

      <div class="feed-card__overlay">
        <GlassPill v-if="label" size="sm">{{ label }}</GlassPill>

        <div class="feed-card__bottom">
          <div class="feed-card__text">
            <component :is="heading" class="feed-card__name">{{ name }}</component>
            <p v-if="subline" class="feed-card__subline">{{ subline }}</p>
          </div>
          <span v-if="!pinned" class="feed-card__icon glass glass-dark" aria-hidden="true">
            <v-icon :icon="expanded ? 'mdi-close' : 'mdi-plus'" size="small" />
          </span>
        </div>
      </div>
    </div>

    <div v-if="expanded || pinned" class="feed-card__panel">
      <slot name="details" />
    </div>
  </article>
</template>
