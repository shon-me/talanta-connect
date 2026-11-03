<script setup>
import { ref, watch } from 'vue'
import { useExpandableFeed } from '@/composables/useExpandableFeed'

// Two cards per row (one on phones). A card that opens takes the whole row.
// Cards go in the default slot, which receives { expandedKey, toggle }. Give each card data-flip-id.
const props = defineProps({
  resetOn: { type: [String, Number], default: '' }, // closes any open card when this value changes
  busy: { type: Boolean, default: false },
})

const grid = ref(null)
const { expandedKey, toggle, collapse } = useExpandableFeed(grid)
watch(() => props.resetOn, collapse)
</script>

<template>
  <div ref="grid" class="feed__grid" :aria-busy="busy">
    <slot v-bind="{ expandedKey, toggle }" />
    <slot name="after" />
  </div>
</template>
