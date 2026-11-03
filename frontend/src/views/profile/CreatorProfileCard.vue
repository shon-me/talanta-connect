<script setup>
import FeedCard from '@/components/feed/FeedCard.vue'
import ProfileActions from '@/components/profile/ProfileActions.vue'

// The creator's header: the same card as in the feed, always open.
defineProps({
  creator: { type: Object, required: true },
})
</script>

<template>
  <FeedCard
    pinned
    heading="h1"
    kind="creator"
    :name="creator.name"
    :image="creator.image"
    :tone="creator.tone"
    :label="creator.craft"
    :subline="creator.location"
  >
    <template #details>
      <div class="feed-detail">
        <div>
          <p class="feed-detail__eyebrow">Creator</p>
          <!-- written by the creator in their dashboard -->
          <p class="feed-detail__text">{{ creator.bio }}</p>
        </div>

        <dl class="feed-detail__facts">
          <div>
            <dt>Based in</dt>
            <dd>{{ creator.location }}</dd>
          </div>
          <div>
            <dt>Portfolio</dt>
            <dd>{{ creator.portfolio.length }} pieces</dd>
          </div>
          <div>
            <dt>Starting at</dt>
            <dd>{{ creator.startingRate }}</dd>
          </div>
          <div>
            <dt>Availability</dt>
            <dd>{{ creator.availability }}</dd>
          </div>
        </dl>

        <div v-if="creator.skills?.length">
          <h2 class="feed-detail__label">Skills</h2>
          <div class="feed-detail__tags">
            <v-chip v-for="skill in creator.skills" :key="skill" size="small" variant="tonal" color="primary">{{ skill }}</v-chip>
          </div>
        </div>

        <div class="feed-detail__actions">
          <ProfileActions kind="creator" :slug="creator.slug" :following="creator.following" />
        </div>
      </div>
    </template>
  </FeedCard>
</template>
