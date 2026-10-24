<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useInView } from '@/composables/useInView'
import { useVideoCarousel } from '@/composables/useVideoCarousel'
import { useVideoPreload } from '@/composables/useVideoPreload'
import { fetchHeroSlides } from '@/services/heroService' // BACKEND: hero slides (see service)

const { data: slides } = useAsyncData(fetchHeroSlides)
const slideCount = computed(() => slides.value.length)
const urls = computed(() => slides.value.map((slide) => slide.video))

const {
  active, leaving, playing,
  setVideo, goTo, toggle, setInView, barValue,
  onCanPlay, onEnded, onTimeUpdate, onError,
} = useVideoCarousel(slideCount)

// Download every video once on mount and keep it in memory so looping never waits on the network
const { sources } = useVideoPreload(urls, active)

// Pause playback while the hero is scrolled out of view, resume when it comes back
const root = ref(null)
const { inView } = useInView(root, { threshold: 0.4 })
watch(inView, setInView)

// Hold the first slide back for two frames so its text animates in on page load
const ready = ref(false)
watch(slideCount, async (count) => {
  if (!count || ready.value) return
  await nextTick()
  requestAnimationFrame(() => requestAnimationFrame(() => { ready.value = true }))
})
</script>

<template>
  <div
    ref="root"
    class="hero-carousel animated-gradient"
    role="region"
    aria-roledescription="carousel"
    aria-label="About Talanta Connect"
  >
    <article
      v-for="(slide, i) in slides"
      :key="slide.id"
      class="hero-slide"
      :class="{ 'is-active': ready && i === active, 'is-leaving': i === leaving }"
      :aria-hidden="i !== active"
    >
      <video
        :ref="(el) => setVideo(el, i)"
        class="hero-slide__video video-cover"
        :src="sources[i] || undefined"
        :poster="slide.poster"
        muted
        playsinline
        preload="auto"
        tabindex="-1"
        aria-hidden="true"
        @canplay="onCanPlay(i)"
        @ended="onEnded(i)"
        @timeupdate="onTimeUpdate(i)"
        @error="onError(i)"
      />
      <div class="hero-slide__scrim" />

      <div class="hero-caption">
        <h2 class="hero-caption__title">
          <span class="visually-hidden">{{ slide.title }}</span>
          <span class="hero-caption__words" aria-hidden="true">
            <span v-for="(word, w) in slide.title.split(' ')" :key="w" class="hero-caption__word">
              <span>{{ word }}</span>
            </span>
          </span>
        </h2>
        <p class="hero-caption__text">{{ slide.subtitle }}</p>
      </div>
    </article>

    <div v-if="slideCount" class="hero-controls">
      <div class="hero-indicators">
        <button
          v-for="(slide, i) in slides"
          :key="slide.id"
          type="button"
          class="hero-indicator"
          :aria-label="`Show slide ${i + 1}: ${slide.title}`"
          :aria-current="i === active"
          @click="goTo(i)"
        >
          <v-progress-linear
            :model-value="barValue(i)"
            height="3"
            rounded
            color="white"
            bg-color="white"
            bg-opacity="0.35"
          />
        </button>
      </div>

      <v-btn
        :icon="playing ? 'mdi-pause' : 'mdi-play'"
        :aria-label="playing ? 'Pause videos' : 'Play videos'"
        class="glass glass-dark"
        color="white"
        variant="text"
        size="small"
        @click="toggle"
      />
    </div>
  </div>
</template>
