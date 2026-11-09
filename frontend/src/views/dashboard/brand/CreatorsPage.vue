<script setup>
import { ref } from 'vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import EmptyState from '@/components/dashboard/EmptyState.vue'
import LoadState from '@/components/dashboard/LoadState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import StatusChip from '@/components/dashboard/StatusChip.vue'
import { useAction } from '@/composables/useAction'
import { useAsyncData } from '@/composables/useAsyncData'
import { answerRequest, fetchBrandCollaborations } from '@/services/brandDashboardService' // BACKEND: collaborations (see service)
import { formatDate, formatMoney, formatRelative } from '@/utils/format'

const { data, loading, error, reload } = useAsyncData(fetchBrandCollaborations, null)
const { busy, run } = useAction()
const working = ref(null)

async function answer(request, decision) {
  working.value = `${request.id}-${decision}`
  const message = decision === 'accept' ? `${request.name} is now working on “${request.task}”.` : 'Request declined.'
  const { ok } = await run(() => answerRequest(request.id, decision), message)
  working.value = null
  if (ok) reload()
}
</script>

<template>
  <PageHeader title="Creator collaborations" lead="Creators who applied to your campaigns, and the creators you work with." />

  <LoadState :loading="loading" :error="error" @retry="reload">
    <template v-if="data">
      <DashCard title="Requests" subtitle="Creators who want to work on one of your campaigns.">
        <ul v-if="data.requests.length" class="dash-list">
          <li v-for="r in data.requests" :key="r.id" class="dash-list__item dash-list__item--wrap">
            <div class="dash-list__main">
              <p class="dash-list__title">
                <router-link :to="`/creators/${r.slug}`" class="dash-link">{{ r.name }}</router-link>
                <span class="dash-list__detail">{{ r.craft }}</span>
              </p>
              <p class="dash-list__meta">Applied to “{{ r.task }}” · {{ formatRelative(r.appliedAt) }}</p>
              <p class="dash-list__quote">{{ r.message }}</p>
            </div>
            <div class="dash-list__buttons">
              <v-btn color="secondary" rounded="lg" size="small" :disabled="busy" :loading="working === `${r.id}-accept`" @click="answer(r, 'accept')">Accept</v-btn>
              <v-btn variant="outlined" rounded="lg" size="small" :disabled="busy" :loading="working === `${r.id}-decline`" @click="answer(r, 'decline')">Decline</v-btn>
            </div>
          </li>
        </ul>
        <EmptyState v-else icon="mdi-account-clock-outline" title="No requests right now" text="New applications show up here." />
      </DashCard>

      <DashCard title="Creators you work with">
        <div v-if="data.creators.length" class="dash-table-wrap">
          <table class="dash-table">
            <thead>
              <tr><th>Creator</th><th>Task</th><th>Since</th><th class="dash-table__num">Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-for="c in data.creators" :key="c.id">
                <td>
                  <router-link :to="`/creator/${c.slug}`" class="dash-link">{{ c.name }}</router-link>
                  <span class="dash-table__sub">{{ c.craft }}</span>
                </td>
                <td>{{ c.task }}</td>
                <td>{{ formatDate(c.since) }}</td>
                <td class="dash-table__num">{{ c.amount ? formatMoney(c.amount) : 'Not set' }}</td>
                <td><StatusChip :status="c.status" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-else title="No collaborations yet" text="Accept a request to start working with a creator." />
      </DashCard>
    </template>
  </LoadState>
</template>
