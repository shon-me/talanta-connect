<script setup>
import { ref } from 'vue'
import FeedCard from '@/components/feed/FeedCard.vue'
import { applyToTask } from '@/services/profileService' // BACKEND: apply to a task (see service)

const props = defineProps({
  task: { type: Object, required: true },
  expanded: { type: Boolean, default: false },
  canApply: { type: Boolean, default: false }, // only creators can apply
})

const emit = defineEmits(['toggle'])

const applied = ref(props.task.applied)
const applying = ref(false)
const error = ref('')

async function apply() {
  applying.value = true
  error.value = ''
  try {
    await applyToTask(props.task.id)
    applied.value = true
  } catch (err) {
    error.value = err.message || "Couldn't send your application. Try again."
  } finally {
    applying.value = false
  }
}
</script>

<template>
  <FeedCard
    :name="task.title"
    :image="task.image"
    :tone="task.tone"
    kind="task"
    :label="`${task.pay.amount} per ${task.pay.unit}`"
    :subline="task.description"
    :expanded="expanded"
    @toggle="emit('toggle')"
  >
    <template #details>
      <div class="feed-detail">
        <div>
          <p class="feed-detail__eyebrow">Task</p>
          <h3 class="feed-detail__title">{{ task.title }}</h3>
        </div>

        <p class="feed-detail__text">{{ task.description }}</p>

        <dl class="feed-detail__facts">
          <div>
            <dt>Pays</dt>
            <dd>{{ task.pay.amount }} per {{ task.pay.unit }}</dd>
          </div>
          <div>
            <dt>How they pay</dt>
            <dd>{{ task.pay.method }}</dd>
          </div>
          <div>
            <dt>Closes</dt>
            <dd>{{ task.deadline }}</dd>
          </div>
        </dl>

        <div v-if="task.skills?.length">
          <h4 class="feed-detail__label">Skills needed</h4>
          <div class="feed-detail__tags">
            <v-chip v-for="skill in task.skills" :key="skill" size="small" variant="tonal" color="primary">{{ skill }}</v-chip>
          </div>
        </div>

        <p v-if="error" class="feed-detail__text" role="alert">{{ error }}</p>

        <div class="feed-detail__actions">
          <v-btn
            v-if="canApply"
            color="secondary"
            size="large"
            rounded="lg"
            :disabled="applied"
            :loading="applying"
            :prepend-icon="applied ? 'mdi-check' : undefined"
            @click="apply"
          >
            {{ applied ? 'Applied' : 'Apply for this task' }}
          </v-btn>
          <v-btn variant="text" @click="emit('toggle')">Close</v-btn>
        </div>
        <p v-if="!canApply" class="feed-detail__text">Only creators can apply for tasks.</p>
      </div>
    </template>
  </FeedCard>
</template>
