<script setup>
import { ref } from 'vue'
import ConfirmDialog from '@/components/dashboard/ConfirmDialog.vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import EmptyState from '@/components/dashboard/EmptyState.vue'
import StatusChip from '@/components/dashboard/StatusChip.vue'
import { useAction } from '@/composables/useAction'
import { releasePayment } from '@/services/dashboardService' // BACKEND: release a payment (see service)
import { formatDate, formatMoney } from '@/utils/format'

const props = defineProps({
  pending: { type: Array, required: true },
  role: { type: String, required: true },
})

const list = ref([...props.pending])
const { busy, run } = useAction()
const target = ref(null)
const confirmOpen = ref(false)

function ask(payment) {
  target.value = payment
  confirmOpen.value = true
}

async function release() {
  const payment = target.value
  const { ok } = await run(() => releasePayment(props.role, payment.id), `${formatMoney(payment.amount)} sent to ${payment.counterparty}.`)
  if (ok) {
    list.value = list.value.filter((p) => p.id !== payment.id)
    confirmOpen.value = false
  }
}
</script>

<template>
  <DashCard
    title="Pending payments"
    :subtitle="role === 'brand' ? 'Approve the work to release the money to the creator.' : 'These are on their way to you.'"
  >
    <ul v-if="list.length" class="dash-list">
      <li v-for="p in list" :key="p.id" class="dash-list__item dash-list__item--wrap">
        <div class="dash-list__main">
          <p class="dash-list__title">{{ p.description }}</p>
          <p class="dash-list__meta">{{ p.counterparty }} · started {{ formatDate(p.since) }} · due {{ formatDate(p.dueDate) }}</p>
        </div>
        <StatusChip :status="p.status" />
        <span class="dash-list__amount">{{ formatMoney(p.amount) }}</span>
        <v-btn v-if="role === 'brand' && p.status === 'awaiting_approval'" color="secondary" size="small" rounded="lg" @click="ask(p)">
          Release
        </v-btn>
      </li>
    </ul>
    <EmptyState v-else icon="mdi-check-circle-outline" title="Nothing pending" text="Payments that are still on their way appear here." />

    <ConfirmDialog
      v-model="confirmOpen"
      title="Release this payment?"
      :text="target ? `${formatMoney(target.amount)} will be sent to ${target.counterparty} for “${target.description}”. This cannot be undone.` : ''"
      confirm-label="Release payment"
      :busy="busy"
      @confirm="release"
    />
  </DashCard>
</template>
