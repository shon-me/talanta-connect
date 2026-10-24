<script setup>
import GlassPill from '@/components/ui/GlassPill.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useExpandingCards } from '@/composables/useExpandingCards'
import { fetchFeaturedCreators } from '@/services/creatorService' // BACKEND: featured creators (see service)

const { data: creators, error, reload } = useAsyncData(fetchFeaturedCreators)

const { expandedId, expandedPos, toggle, collapse, onPointerDown, onPointerLeave, onFocusOut } =
  useExpandingCards(creators)
</script>

<template>
  <section id="creators" class="home-section featured-creators" aria-labelledby="creators-title">
    <div class="section-inner">
      <header class="featured-creators__head">
        <div>
          <h2 id="creators-title" class="section-title">Featured creators</h2>
          <p class="section-lead">Meet creators sharing their work on Talanta Connect.</p>
        </div>
        <!-- BACKEND: full creators directory, GET /api/creators/ with search and filters (route /creators) -->
        <v-btn variant="outlined" color="primary" rounded="lg" to="/creators">See all creators</v-btn>
      </header>

      <div
        class="featured-creators__grid"
        :class="expandedPos && [
          `featured-creators__grid--col-${expandedPos.col}`,
          `featured-creators__grid--row-${expandedPos.row}`,
        ]"
      >
        <article
          v-for="creator in creators"
          :key="creator.id"
          class="creator-card"
          :class="{
            'creator-card--expanded': expandedId === creator.id,
            'creator-card--muted': expandedId !== null && expandedId !== creator.id,
          }"
          @pointerleave="onPointerLeave($event, creator.id)"
          @focusout="onFocusOut($event, creator.id)"
          @keydown.esc="collapse"
        >
          <v-img :src="creator.image" alt="" cover class="creator-card__img" />
          <div class="creator-card__scrim" />

          <button
            type="button"
            class="creator-card__toggle"
            :aria-expanded="expandedId === creator.id"
            :aria-label="`${creator.name}, ${creator.craft}`"
            @pointerdown="onPointerDown"
            @click="toggle(creator.id)"
          />

          <div class="creator-card__content">
            <GlassPill>{{ creator.name }}</GlassPill>
            <p class="creator-card__craft">{{ creator.craft }}</p>

            <div class="creator-card__details" :inert="expandedId !== creator.id">
              <div class="creator-card__details-inner">
                <p class="creator-card__bio">{{ creator.bio }}</p>
                <div class="creator-card__skills">
                  <GlassPill v-for="skill in creator.skills" :key="skill" tone="light" size="sm">
                    {{ skill }}
                  </GlassPill>
                </div>
                <!-- BACKEND: creator profile page, GET /api/creators/:slug/ (route /creators/:slug) -->
                <v-btn color="secondary" size="small" rounded="lg" :to="`/creators/${creator.slug}`">
                  View profile
                </v-btn>
              </div>
            </div>
          </div>
        </article>
      </div>

      <p v-if="error" class="featured-creators__status" role="alert">
        Couldn't load featured creators.
        <v-btn variant="text" size="small" color="primary" @click="reload">Try again</v-btn>
      </p>
    </div>
  </section>
</template>
