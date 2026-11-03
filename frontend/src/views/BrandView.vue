<script setup>
import BackButton from '@/components/ui/BackButton.vue'
import FeedGrid from '@/components/feed/FeedGrid.vue'
import { useProfile } from '@/composables/useProfile'
import { fetchBrandProfile } from '@/services/profileService' // BACKEND: brand profile (see service)
import { useAuthStore } from '@/stores/auth'
import BrandProfileCard from './profile/BrandProfileCard.vue'
import TaskCard from './profile/TaskCard.vue'

const auth = useAuthStore()
const { profile, loading, error, reload } = useProfile(fetchBrandProfile)
</script>

<template>
  <section class="profile">
    <div class="profile__inner">
      <BackButton class="profile__back" fallback="/home" />

      <div v-if="loading" class="feed-card feed-card--skeleton profile__head-skeleton" aria-hidden="true" />

      <div v-else-if="error" class="profile__status" role="alert">
        <h1 class="profile__status-title">
          {{ error.status === 404 ? "We couldn't find that brand" : "Couldn't load this brand" }}
        </h1>
        <p class="profile__status-text">
          {{ error.status === 404 ? 'It may have been removed, or the link is wrong.' : 'Check your connection and try again.' }}
        </p>
        <v-btn v-if="error.status !== 404" color="secondary" rounded="lg" @click="reload">Try again</v-btn>
        <v-btn to="/home" variant="text" color="primary">Back to the feed</v-btn>
      </div>

      <template v-else-if="profile">
        <div class="profile__head">
          <BrandProfileCard :brand="profile" />
        </div>

        <header class="profile__section-head">
          <h2 class="section-title">Open tasks</h2>
          <p class="section-lead">Tasks {{ profile.name }} is hiring creators for.</p>
        </header>

        <FeedGrid :reset-on="profile.slug">
          <template #default="{ expandedKey, toggle }">
            <TaskCard
              v-for="task in profile.tasks"
              :key="task.id"
              :data-flip-id="`task-${task.id}`"
              :task="task"
              :can-apply="auth.role === 'creator'"
              :expanded="expandedKey === `task-${task.id}`"
              @toggle="toggle(`task-${task.id}`)"
            />
          </template>
        </FeedGrid>

        <p v-if="!profile.tasks.length" class="profile__empty">No open tasks right now. Check back soon.</p>
      </template>
    </div>
  </section>
</template>
