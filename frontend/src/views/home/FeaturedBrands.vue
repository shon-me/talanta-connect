<script setup>
import { ref, watch } from 'vue'
import GlassPill from '@/components/ui/GlassPill.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useAutoAdvance } from '@/composables/useAutoAdvance'
import { useBrandCarousel } from '@/composables/useBrandCarousel'
import { useInView } from '@/composables/useInView'
import { useSwipe } from '@/composables/useSwipe'
import { fetchFeaturedBrands } from '@/services/brandService' // BACKEND: featured brands (see service)
import { prefersReducedMotion } from '@/utils/motion'

const { data: brands, loading, error, reload } = useAsyncData(fetchFeaturedBrands)
const { cards, next, prev } = useBrandCarousel(brands)

const section = ref(null)
const stage = ref(null)
const { inView } = useInView(section)

// Auto-advance every 6 to 10 seconds. It pauses while hovered / focused and while off screen.
const { start, stop } = useAutoAdvance(next, { min: 6000, max: 10000, enabled: !prefersReducedMotion() })
const held = ref(false)

function resume() {
  if (!held.value && inView.value && cards.value.length) start()
}
function hold() {
  held.value = true
  stop()
}
function release() {
  held.value = false
  resume()
}

watch([inView, () => cards.value.length], ([visible, count]) => {
  if (visible && count) resume()
  else stop()
}, { immediate: true })

// Manual moves restart the timer so the card never changes right after a click or swipe
function go(move) {
  move()
  resume()
}

// Side cards can be clicked to bring them to the centre
function onCardClick(state) {
  if (state === 'left') go(prev)
  else if (state === 'right') go(next)
}

useSwipe(stage, { onLeft: () => go(next), onRight: () => go(prev) })
</script>

<template>
  <section id="brands" ref="section" class="home-section featured-brands" aria-labelledby="brands-title">
    <header class="featured-brands__head">
      <h2 id="brands-title" class="section-title">Featured brands</h2>
      <p class="section-lead">Brands on Talanta Connect that work with creators.</p>
    </header>

    <div
      class="featured-brands__row"
      @mouseenter="hold"
      @mouseleave="release"
      @focusin="hold"
      @focusout="release"
    >
      <v-btn icon="mdi-chevron-left" color="primary" variant="tonal" aria-label="Previous brand" @click="go(prev)" />

      <div
        ref="stage"
        class="featured-brands__stage"
        role="group"
        aria-roledescription="carousel"
        aria-label="Featured brands"
      >
        <v-progress-circular v-if="loading" class="featured-brands__loader" indeterminate color="primary" />

        <article
          v-for="card in cards"
          :key="card.key"
          class="featured-brands__card"
          :class="`featured-brands__card--${card.state}`"
          @click="onCardClick(card.state)"
        >
          <v-img :src="card.image" alt="" cover class="featured-brands__img" />
          <div class="featured-brands__scrim" />

          <div class="featured-brands__content">
            <GlassPill>{{ card.name }}</GlassPill>

            <!-- inert keeps the hidden button out of the tab order on side cards -->
            <div class="featured-brands__details" :inert="card.state !== 'center'">
              <div class="featured-brands__details-inner">
                <p class="featured-brands__tagline">{{ card.tagline }}</p>
                <p class="featured-brands__desc">{{ card.description }}</p>
                <!-- BACKEND: brand profile page, GET /api/brands/:slug/ (route /brands/:slug) -->
                <v-btn color="secondary" rounded="lg" :to="`/brands/${card.slug}`">View brand</v-btn>
              </div>
            </div>
          </div>
        </article>
      </div>

      <v-btn icon="mdi-chevron-right" color="primary" variant="tonal" aria-label="Next brand" @click="go(next)" />
    </div>

    <p v-if="error" class="featured-brands__status" role="alert">
      Couldn't load featured brands.
      <v-btn variant="text" size="small" color="primary" @click="reload">Try again</v-btn>
    </p>
  </section>
</template>
