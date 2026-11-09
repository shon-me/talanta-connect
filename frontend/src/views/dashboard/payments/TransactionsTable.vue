<script setup>
import { computed, ref } from 'vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import EmptyState from '@/components/dashboard/EmptyState.vue'
import StatusChip from '@/components/dashboard/StatusChip.vue'
import { receiptUrl } from '@/services/dashboardService' // BACKEND: receipt PDF (see service)
import { USE_MOCK } from '@/services/api'
import { downloadTextFile, formatDate, formatMoney } from '@/utils/format'

const props = defineProps({
  transactions: { type: Array, required: true },
})

const query = ref('')
const status = ref('all')

const rows = computed(() => {
  const word = query.value.trim().toLowerCase()
  return props.transactions.filter(
    (t) =>
      (status.value === 'all' || t.status === status.value) &&
      (!word || `${t.description} ${t.counterparty} ${t.reference}`.toLowerCase().includes(word)),
  )
})

const sign = (amount) => (amount > 0 ? '+' : '')

function downloadReceipt(t) {
  if (!USE_MOCK) {
    window.open(receiptUrl(t.id), '_blank', 'noopener')
    return
  }
  // Until the backend serves real PDF receipts, save a plain text one
  downloadTextFile(`receipt-${t.reference}.txt`, [
    'Talanta Connect receipt',
    `Reference: ${t.reference}`,
    `Date: ${formatDate(t.date)}`,
    `For: ${t.description}`,
    `With: ${t.counterparty}`,
    `Method: ${t.method}`,
    `Amount: ${formatMoney(t.amount)}`,
    `Status: ${t.status}`,
  ].join('\n'))
}
</script>

<template>
  <DashCard title="History and receipts">
    <div class="dash-toolbar">
      <v-text-field v-model="query" class="dash-toolbar__search" placeholder="Search payments" aria-label="Search payments" prepend-inner-icon="mdi-magnify" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
      <v-btn-toggle v-model="status" mandatory divided variant="outlined" color="primary" density="comfortable" rounded="lg">
        <v-btn value="all">All</v-btn>
        <v-btn value="paid">Paid</v-btn>
        <v-btn value="refunded">Refunded</v-btn>
        <v-btn value="failed">Failed</v-btn>
      </v-btn-toggle>
    </div>

    <div v-if="rows.length" class="dash-table-wrap">
      <table class="dash-table">
        <thead>
          <tr>
            <th>Date</th><th>For</th><th>With</th><th>Method</th><th class="dash-table__num">Amount</th><th>Status</th><th><span class="visually-hidden">Receipt</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in rows" :key="t.id">
            <td>{{ formatDate(t.date) }}</td>
            <td>
              {{ t.description }}
              <span class="dash-table__sub">{{ t.reference }}</span>
            </td>
            <td>{{ t.counterparty }}</td>
            <td>{{ t.method }}</td>
            <td class="dash-table__num" :class="t.amount > 0 ? 'dash-money--in' : 'dash-money--out'">{{ sign(t.amount) }}{{ formatMoney(t.amount) }}</td>
            <td><StatusChip :status="t.status" /></td>
            <td>
              <v-btn icon="mdi-receipt-text-outline" variant="text" size="small" :aria-label="`Download receipt ${t.reference}`" @click="downloadReceipt(t)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <EmptyState v-else title="No payments match" text="Try another search or filter." />
  </DashCard>
</template>
