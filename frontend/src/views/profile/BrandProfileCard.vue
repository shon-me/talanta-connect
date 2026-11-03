<script setup>
import FeedCard from '@/components/feed/FeedCard.vue'
import ProfileActions from '@/components/profile/ProfileActions.vue'

// The brand's header: the same card as in the feed, always open.
defineProps({
  brand: { type: Object, required: true },
})
</script>

<template>
  <FeedCard
    pinned
    heading="h1"
    kind="brand"
    :name="brand.name"
    :image="brand.image"
    :tone="brand.tone"
    :label="brand.category"
    :subline="brand.tagline"
  >
    <template #details>
      <div class="feed-detail">
        <div>
          <p class="feed-detail__eyebrow">Brand</p>
          <p class="feed-detail__text">{{ brand.about }}</p>
        </div>

        <dl class="feed-detail__facts">
          <div>
            <dt>Based in</dt>
            <dd>{{ brand.location }}</dd>
          </div>
          <div>
            <dt>Open tasks</dt>
            <dd>{{ brand.tasks.length }}</dd>
          </div>
          <div>
            <dt>Typical pay</dt>
            <dd>{{ brand.pay.amount }} per {{ brand.pay.unit }}</dd>
          </div>
          <div>
            <dt>How they pay</dt>
            <dd>{{ brand.pay.method }}</dd>
          </div>
        </dl>

        <div v-if="brand.lookingFor?.length">
          <h2 class="feed-detail__label">Looking for</h2>
          <div class="feed-detail__tags">
            <v-chip v-for="tag in brand.lookingFor" :key="tag" size="small" variant="tonal" color="primary">{{ tag }}</v-chip>
          </div>
        </div>

        <div class="feed-detail__actions">
          <ProfileActions kind="brand" :slug="brand.slug" :following="brand.following" />
        </div>
      </div>
    </template>
  </FeedCard>
</template>
