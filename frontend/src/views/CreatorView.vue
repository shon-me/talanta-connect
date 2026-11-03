<script setup>
import BackButton from '@/components/ui/BackButton.vue'
import FeedGrid from '@/components/feed/FeedGrid.vue'
import { useProfile } from '@/composables/useProfile'
import { fetchCreatorProfile } from '@/services/profileService' // BACKEND: creator profile (see service)
import CreatorProfileCard from './profile/CreatorProfileCard.vue'
import WorkCard from './profile/WorkCard.vue'

const { profile, loading, error, reload } = useProfile(fetchCreatorProfile)
</script>

<template>
  <section class="profile">
    <div class="profile__inner">
      <BackButton class="profile__back" fallback="/home" />

      <div v-if="loading" class="feed-card feed-card--skeleton profile__head-skeleton" aria-hidden="true" />

      <div v-else-if="error" class="profile__status" role="alert">
        <h1 class="profile__status-title">
          {{ error.status === 404 ? "We couldn't find that creator" : "Couldn't load this creator" }}
        </h1>
        <p class="profile__status-text">
          {{ error.status === 404 ? 'They may have removed their profile, or the link is wrong.' : 'Check your connection and try again.' }}
        </p>
        <v-btn v-if="error.status !== 404" color="secondary" rounded="lg" @click="reload">Try again</v-btn>
        <v-btn to="/home" variant="text" color="primary">Back to the feed</v-btn>
      </div>

      <template v-else-if="profile">
        <div class="profile__head">
          <CreatorProfileCard :creator="profile" />
        </div>

        <header class="profile__section-head">
          <h2 class="section-title">Portfolio</h2>
          <p class="section-lead">Recent work by {{ profile.name }}.</p>
        </header>

        <FeedGrid :reset-on="profile.slug">
          <template #default="{ expandedKey, toggle }">
            <WorkCard
              v-for="work in profile.portfolio"
              :key="work.id"
              :data-flip-id="`work-${work.id}`"
              :work="work"
              :expanded="expandedKey === `work-${work.id}`"
              @toggle="toggle(`work-${work.id}`)"
            />
          </template>
        </FeedGrid>

        <p v-if="!profile.portfolio.length" class="profile__empty">No portfolio pieces yet.</p>
      </template>
    </div>
  </section>
</template>
