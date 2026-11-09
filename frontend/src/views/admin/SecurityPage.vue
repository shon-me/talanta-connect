<script setup>
import { computed, ref } from 'vue'
import ConfirmDialog from '@/components/dashboard/ConfirmDialog.vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import EmptyState from '@/components/dashboard/EmptyState.vue'
import LoadState from '@/components/dashboard/LoadState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import StatusChip from '@/components/dashboard/StatusChip.vue'
import { useAction } from '@/composables/useAction'
import { useAsyncData } from '@/composables/useAsyncData'
import { decideSecurityRequest, fetchSecurityRequests } from '@/services/adminService' // BACKEND: security reviews (see service)
import { formatRelative } from '@/utils/format'

// Password changes and profile updates (email, phone, payout details) that are held for a person to check.
const { data: requests, loading, error, reload } = useAsyncData(fetchSecurityRequests, [])
const { busy, run } = useAction()

const status = ref('pending')
const shown = computed(() => requests.value.filter((r) => status.value === 'all' || r.status === status.value))
const waiting = computed(() => requests.value.filter((r) => r.status === 'pending').length)

const TYPES = { password_change: 'Password change', email_change: 'Email change', phone_change: 'Phone change', payout_change: 'Payout method change' }

const target = ref(null)
const decision = ref('approve')
const confirmOpen = ref(false)

function ask(request, value) {
  target.value = request
  decision.value = value
  confirmOpen.value = true
}

async function confirm() {
  const request = target.value
  const { ok } = await run(
    () => decideSecurityRequest(request.id, decision.value),
    decision.value === 'approve' ? 'Change approved.' : 'Change denied.',
  )
  if (ok) {
    request.status = decision.value === 'approve' ? 'approved' : 'denied'
    confirmOpen.value = false
  }
}
</script>

<template>
  <PageHeader title="Security reviews" :lead="`${waiting} high risk changes waiting. Check the details before you approve.`" />

  <LoadState :loading="loading" :error="error" @retry="reload">
    <v-btn-toggle v-model="status" class="dash-filter" mandatory divided variant="outlined" color="primary" density="comfortable" rounded="lg">
      <v-btn value="pending">Pending</v-btn>
      <v-btn value="approved">Approved</v-btn>
      <v-btn value="denied">Denied</v-btn>
      <v-btn value="all">All</v-btn>
    </v-btn-toggle>

    <div v-if="shown.length" class="dash-stack">
      <DashCard v-for="r in shown" :key="r.id">
        <div class="dash-item">
          <div class="dash-item__head">
            <div>
              <h3 class="dash-item__title">{{ TYPES[r.type] }}</h3>
              <p class="dash-item__sub">{{ r.user }} ({{ r.role }}) · {{ formatRelative(r.requestedAt) }}</p>
            </div>
            <div class="dash-chips">
              <StatusChip :status="r.risk" />
              <StatusChip :status="r.status" />
            </div>
          </div>

          <div class="dash-table-wrap">
            <table class="dash-table">
              <thead><tr><th>What</th><th>Now</th><th>Asked for</th></tr></thead>
              <tbody>
                <tr v-for="c in r.changes" :key="c.field"><td>{{ c.field }}</td><td>{{ c.from }}</td><td>{{ c.to }}</td></tr>
              </tbody>
            </table>
          </div>

          <p class="dash-note">From {{ r.ip }} · {{ r.device }}</p>

          <div v-if="r.status === 'pending'" class="dash-item__actions">
            <v-btn color="secondary" rounded="lg" size="small" prepend-icon="mdi-check" @click="ask(r, 'approve')">Approve</v-btn>
            <v-btn variant="outlined" color="error" rounded="lg" size="small" prepend-icon="mdi-close" @click="ask(r, 'deny')">Deny</v-btn>
          </div>
        </div>
      </DashCard>
    </div>
    <EmptyState v-else icon="mdi-shield-check-outline" title="Nothing waiting" text="Risky changes appear here for a person to check." />
  </LoadState>

  <ConfirmDialog
    v-model="confirmOpen"
    :title="decision === 'approve' ? 'Approve this change?' : 'Deny this change?'"
    :text="decision === 'approve' ? 'It takes effect now, and the account owner is told at their old email.' : 'Nothing changes on the account, and the owner is told.'"
    :confirm-label="decision === 'approve' ? 'Approve' : 'Deny'"
    :danger="decision !== 'approve'"
    :busy="busy"
    @confirm="confirm"
  />
</template>
