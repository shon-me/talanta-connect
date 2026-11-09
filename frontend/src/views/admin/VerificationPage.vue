<script setup>
import { computed, reactive, ref } from 'vue'
import ConfirmDialog from '@/components/dashboard/ConfirmDialog.vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import EmptyState from '@/components/dashboard/EmptyState.vue'
import LoadState from '@/components/dashboard/LoadState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import StatusChip from '@/components/dashboard/StatusChip.vue'
import { useAction } from '@/composables/useAction'
import { useAsyncData } from '@/composables/useAsyncData'
import { decideVerification, fetchVerificationQueue } from '@/services/adminService' // BACKEND: verification (see service)
import { formatRelative } from '@/utils/format'

const { data: queue, loading, error, reload } = useAsyncData(fetchVerificationQueue, [])
const { busy, run } = useAction()

const kind = ref('all')
const status = ref('pending')
const shown = computed(() =>
  queue.value.filter((v) => (kind.value === 'all' || v.kind === kind.value) && (status.value === 'all' || v.status === status.value)),
)
const waiting = computed(() => queue.value.filter((v) => v.status === 'pending').length)

const DOC_ICONS = { image: 'mdi-image-outline', pdf: 'mdi-file-pdf-box', link: 'mdi-link-variant' }

const target = ref(null)
const approveOpen = ref(false)
const rejectOpen = ref(false)
const reject = reactive({ reason: '' })

function askApprove(item) {
  target.value = item
  approveOpen.value = true
}

function askReject(item) {
  target.value = item
  reject.reason = ''
  rejectOpen.value = true
}

async function decide(decision, reason = '') {
  const item = target.value
  const { ok } = await run(
    () => decideVerification(item.id, decision, reason),
    decision === 'approve' ? `${item.name} is now verified.` : `${item.name} was rejected.`,
  )
  if (ok) {
    item.status = decision === 'approve' ? 'approved' : 'rejected'
    item.reason = reason
    approveOpen.value = false
    rejectOpen.value = false
  }
}
</script>

<template>
  <PageHeader title="Verification" :lead="`${waiting} waiting for a decision. Check the documents, then approve or reject.`" />

  <LoadState :loading="loading" :error="error" @retry="reload">
    <div class="dash-toolbar">
      <v-btn-toggle v-model="kind" mandatory divided variant="outlined" color="primary" density="comfortable" rounded="lg">
        <v-btn value="all">Everyone</v-btn>
        <v-btn value="creator">Creators</v-btn>
        <v-btn value="brand">Brands</v-btn>
      </v-btn-toggle>
      <v-btn-toggle v-model="status" mandatory divided variant="outlined" color="primary" density="comfortable" rounded="lg">
        <v-btn value="pending">Pending</v-btn>
        <v-btn value="approved">Approved</v-btn>
        <v-btn value="rejected">Rejected</v-btn>
        <v-btn value="all">All</v-btn>
      </v-btn-toggle>
    </div>

    <div v-if="shown.length" class="dash-stack">
      <DashCard v-for="v in shown" :key="v.id">
        <div class="dash-item">
          <div class="dash-item__head">
            <div>
              <h3 class="dash-item__title">{{ v.name }} <v-chip size="x-small" variant="outlined" class="ml-1">{{ v.kind }}</v-chip></h3>
              <p class="dash-item__sub">{{ v.email }} · sent {{ formatRelative(v.submittedAt) }}</p>
            </div>
            <StatusChip :status="v.status" />
          </div>

          <p v-if="v.notes" class="dash-item__text">{{ v.notes }}</p>

          <!-- BACKEND: each document opens through a short-lived signed link, never a public address -->
          <div class="dash-chips">
            <v-chip v-for="d in v.documents" :key="d.name" size="small" variant="tonal" color="primary" :prepend-icon="DOC_ICONS[d.type]">{{ d.name }}</v-chip>
          </div>

          <p v-if="v.status === 'rejected' && v.reason" class="dash-note">Reason: {{ v.reason }}</p>

          <div v-if="v.status === 'pending'" class="dash-item__actions">
            <v-btn color="secondary" rounded="lg" size="small" prepend-icon="mdi-check" @click="askApprove(v)">Approve</v-btn>
            <v-btn variant="outlined" color="error" rounded="lg" size="small" prepend-icon="mdi-close" @click="askReject(v)">Reject</v-btn>
          </div>
        </div>
      </DashCard>
    </div>
    <EmptyState v-else icon="mdi-shield-check-outline" title="Nothing here" text="No requests match these filters." />
  </LoadState>

  <ConfirmDialog
    v-model="approveOpen"
    title="Approve this request?"
    :text="target ? `${target.name} will get the verified badge and a notification.` : ''"
    confirm-label="Approve"
    :busy="busy"
    @confirm="decide('approve')"
  />

  <ConfirmDialog
    v-model="rejectOpen"
    title="Reject this request?"
    text="The reason is sent to them so they can fix it and try again."
    confirm-label="Reject"
    danger
    :busy="busy"
    :disabled="!reject.reason.trim()"
    @confirm="decide('reject', reject.reason.trim())"
  >
    <v-textarea v-model="reject.reason" label="Reason (required)" rows="2" auto-grow variant="outlined" density="comfortable" rounded="lg" class="mt-3" />
  </ConfirmDialog>
</template>
