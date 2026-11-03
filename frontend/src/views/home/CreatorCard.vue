<script setup>
import FeedCard from './FeedCard.vue'

defineProps({
  item: { type: Object, required: true },
  expanded: { type: Boolean, default: false },
  locked: { type: Boolean, default: false }, // true for visitors who are not signed in
})

const emit = defineEmits(['toggle', 'open'])
</script>

<template>
  <FeedCard :item="item" :label="item.craft" :subline="item.location" :expanded="expanded" @toggle="emit('toggle')">
    <template #details>
      <div class="feed-detail">
        <div>
          <p class="feed-detail__eyebrow">Creator</p>
          <h3 class="feed-detail__title">{{ item.name }}</h3>
        </div>

        <!-- The bio, skills, rate and availability are written by the creator in their dashboard -->
        <p class="feed-detail__text">{{ item.bio }}</p>

        <dl class="feed-detail__facts">
          <div>
            <dt>Starting at</dt>
            <dd>{{ item.startingRate }}</dd>
          </div>
          <div>
            <dt>Availability</dt>
            <dd>{{ item.availability }}</dd>
          </div>
        </dl>

        <div v-if="item.skills?.length">
          <h4 class="feed-detail__label">Skills</h4>
          <div class="feed-detail__tags">
            <v-chip v-for="skill in item.skills" :key="skill" size="small" variant="tonal" color="primary">{{ skill
              }}</v-chip>
          </div>
        </div>

        <div class="feed-detail__actions">
          <v-btn color="secondary" size="large" rounded="lg" :to="locked ? undefined : `/creator/${item.slug}`"
            :prepend-icon="locked ? 'mdi-lock-outline' : undefined" @click="locked && emit('open', item)">
            {{ locked ? 'Sign up to view creator page' : 'View creator page' }}
          </v-btn>
          <v-btn variant="text" @click="emit('toggle')">Close</v-btn>
        </div>
      </div>
    </template>
  </FeedCard>
</template>
