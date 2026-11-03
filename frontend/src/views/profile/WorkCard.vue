<script setup>
import FeedCard from '@/components/feed/FeedCard.vue'

// One piece of a creator's portfolio. The creator adds these in their dashboard.
defineProps({
  work: { type: Object, required: true },
  expanded: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <FeedCard
    :name="work.title"
    :image="work.image"
    :tone="work.tone"
    kind="work"
    :label="work.category"
    :subline="String(work.year)"
    :expanded="expanded"
    @toggle="emit('toggle')"
  >
    <template #details>
      <div class="feed-detail">
        <div>
          <p class="feed-detail__eyebrow">Portfolio piece</p>
          <h3 class="feed-detail__title">{{ work.title }}</h3>
        </div>

        <p class="feed-detail__text">{{ work.description }}</p>

        <dl class="feed-detail__facts">
          <div>
            <dt>Type</dt>
            <dd>{{ work.category }}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{{ work.year }}</dd>
          </div>
        </dl>

        <div v-if="work.tags?.length">
          <h4 class="feed-detail__label">Tags</h4>
          <div class="feed-detail__tags">
            <v-chip v-for="tag in work.tags" :key="tag" size="small" variant="tonal" color="primary">{{ tag }}</v-chip>
          </div>
        </div>

        <div class="feed-detail__actions">
          <v-btn variant="text" @click="emit('toggle')">Close</v-btn>
        </div>
      </div>
    </template>
  </FeedCard>
</template>
