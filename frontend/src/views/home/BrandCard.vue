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
  <FeedCard :item="item" :label="item.category" :subline="item.tagline" :expanded="expanded" @toggle="emit('toggle')">
    <template #details>
      <div class="feed-detail">
        <div>
          <p class="feed-detail__eyebrow">Brand</p>
          <h3 class="feed-detail__title">{{ item.name }}</h3>
        </div>

        <p class="feed-detail__text">{{ item.about }}</p>

        <section>
          <h4 class="feed-detail__label">Current task</h4>
          <p class="feed-detail__strong">{{ item.task.title }}</p>
          <p class="feed-detail__text">{{ item.task.description }}</p>
        </section>

        <dl class="feed-detail__facts">
          <div>
            <dt>Pays</dt>
            <dd>{{ item.pay.amount }} per {{ item.pay.unit }}</dd>
          </div>
          <div>
            <dt>How they pay</dt>
            <dd>{{ item.pay.method }}</dd>
          </div>
        </dl>

        <div v-if="item.lookingFor?.length">
          <h4 class="feed-detail__label">Looking for</h4>
          <div class="feed-detail__tags">
            <v-chip v-for="tag in item.lookingFor" :key="tag" size="small" variant="tonal" color="primary">{{ tag
              }}</v-chip>
          </div>
        </div>

        <div class="feed-detail__actions">
          <v-btn color="secondary" size="large" rounded="lg" :to="locked ? undefined : `/brand/${item.slug}`"
            :prepend-icon="locked ? 'mdi-lock-outline' : undefined" @click="locked && emit('open', item)">
            {{ locked ? 'Sign up to view brand page' : 'View brand page' }}
          </v-btn>
          <v-btn variant="text" @click="emit('toggle')">Close</v-btn>
        </div>
      </div>
    </template>
  </FeedCard>
</template>
