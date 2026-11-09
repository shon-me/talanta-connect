<script setup>
import { ref } from 'vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import EmptyState from '@/components/dashboard/EmptyState.vue'
import LoadState from '@/components/dashboard/LoadState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import StatusChip from '@/components/dashboard/StatusChip.vue'
import { useAction } from '@/composables/useAction'
import { useAsyncData } from '@/composables/useAsyncData'
import { answerInvite, fetchCreatorCollaborations } from '@/services/creatorDashboardService' // BACKEND: collaborations (see service)
import { formatDate, formatMoney } from '@/utils/format'

const { data, loading, error, reload } = useAsyncData(fetchCreatorCollaborations, null)
const { busy, run } = useAction()
const working = ref(null)

async function answer(invite, decision) {
  working.value = `${invite.id}-${decision}`
  const message = decision === 'accept' ? `You accepted “${invite.task}” from ${invite.name}.` : 'Invite declined.'
  const { ok } = await run(() => answerInvite(invite.id, decision), message)
  working.value = null
  if (ok) reload()
}
</script>

<template>
  <PageHeader title="Brand collaborations" lead="Invites from brands, and the brands you work with." />

  <LoadState :loading="loading" :error="error" @retry="reload">
    <template v-if="data">
      <DashCard title="Invites" subtitle="Brands that asked you to work on a task.">
        <ul v-if="data.invites.length" class="dash-list">
          <li v-for="i in data.invites" :key="i.id" class="dash-list__item dash-list__item--wrap">
            <div class="dash-list__main">
              <p class="dash-list__title">
                <router-link :to="`/brands/${i.slug}`" class="dash-link">{{ i.name }}</router-link>
                <span class="dash-list__detail">{{ i.category }}</span>
              </p>
              <p class="dash-list__meta">“{{ i.task }}” · {{ formatMoney(i.amount) }}</p>
              <p class="dash-list__quote">{{ i.message }}</p>
            </div>
            <div class="dash-list__buttons">
              <v-btn color="secondary" rounded="lg" size="small" :disabled="busy" :loading="working === `${i.id}-accept`" @click="answer(i, 'accept')">Accept</v-btn>
              <v-btn variant="outlined" rounded="lg" size="small" :disabled="busy" :loading="working === `${i.id}-decline`" @click="answer(i, 'decline')">Decline</v-btn>
            </div>
          </li>
        </ul>
        <EmptyState v-else icon="mdi-email-outline" title="No invites right now" text="When a brand invites you to a task, it shows up here." />
      </DashCard>

      <DashCard title="Brands you work with">
        <div v-if="data.brands.length" class="dash-table-wrap">
          <table class="dash-table">
            <thead>
              <tr><th>Brand</th><th>Task</th><th>Since</th><th class="dash-table__num">Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-for="b in data.brands" :key="b.id">
                <td>
                  <router-link :to="`/brands/${b.slug}`" class="dash-link">{{ b.name }}</router-link>
                  <span class="dash-table__sub">{{ b.category }}</span>
                </td>
                <td>{{ b.task }}</td>
                <td>{{ formatDate(b.since) }}</td>
                <td class="dash-table__num">{{ formatMoney(b.amount) }}</td>
                <td><StatusChip :status="b.status" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-else title="No collaborations yet" text="Apply to tasks on a brand's page to get started." />
      </DashCard>
    </template>
  </LoadState>
</template>
