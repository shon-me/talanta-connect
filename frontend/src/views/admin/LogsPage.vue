<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import EmptyState from '@/components/dashboard/EmptyState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import StatusChip from '@/components/dashboard/StatusChip.vue'
import { fetchLogs } from '@/services/adminService' // BACKEND: logs (see service)

const items = ref([])
const loading = ref(false)
const error = ref(null)
const cursor = ref(null)
const level = ref('')
const query = ref('')
let run = 0
let timer = null

async function load(reset) {
  const id = ++run
  if (reset) {
    items.value = []
    cursor.value = null
  }
  loading.value = true
  error.value = null
  try {
    const page = await fetchLogs({ level: level.value, q: query.value, cursor: cursor.value })
    if (id !== run) return
    items.value.push(...page.items)
    cursor.value = page.nextCursor
  } catch (err) {
    if (id === run) error.value = err
  } finally {
    if (id === run) loading.value = false
  }
}

// Search a moment after the last key press
watch([level, query], () => {
  clearTimeout(timer)
  timer = setTimeout(() => load(true), 300)
})

onMounted(() => load(true))
onBeforeUnmount(() => clearTimeout(timer))

const time = (value) => new Date(value).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })
</script>

<template>
  <PageHeader title="System logs" lead="What happened on the platform, newest first." />

  <DashCard>
    <div class="dash-toolbar">
      <v-text-field v-model="query" class="dash-toolbar__search" placeholder="Search logs" aria-label="Search logs" prepend-inner-icon="mdi-magnify" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
      <v-btn-toggle v-model="level" mandatory divided variant="outlined" color="primary" density="comfortable" rounded="lg">
        <v-btn value="">All</v-btn>
        <v-btn value="info">Info</v-btn>
        <v-btn value="warning">Warnings</v-btn>
        <v-btn value="error">Errors</v-btn>
      </v-btn-toggle>
    </div>

    <p v-if="error" class="dash-note" role="alert">
      {{ error.message }} <v-btn variant="text" size="small" color="primary" @click="load(true)">Try again</v-btn>
    </p>

    <div v-if="items.length" class="dash-table-wrap">
      <table class="dash-table dash-table--logs">
        <thead><tr><th>Time</th><th>Level</th><th>Source</th><th>Message</th></tr></thead>
        <tbody>
          <tr v-for="l in items" :key="l.id">
            <td class="dash-table__nowrap">{{ time(l.time) }}</td>
            <td><StatusChip :status="l.level" :label="l.level" /></td>
            <td>{{ l.source }}</td>
            <td>{{ l.message }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <EmptyState v-else-if="!loading && !error" icon="mdi-text-box-search-outline" title="No log entries match" />

    <div class="dash-more">
      <v-progress-circular v-if="loading" indeterminate color="primary" size="28" />
      <v-btn v-else-if="cursor" variant="outlined" color="primary" rounded="lg" @click="load(false)">Load more</v-btn>
    </div>
  </DashCard>
</template>
