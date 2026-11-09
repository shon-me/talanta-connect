<script setup>
import { computed, ref } from 'vue'
import LoadState from '@/components/dashboard/LoadState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { fetchPayments } from '@/services/dashboardService' // BACKEND: payments (see service)
import { useAuthStore } from '@/stores/auth'
import MethodsPanel from './payments/MethodsPanel.vue'
import PendingList from './payments/PendingList.vue'
import TransactionsTable from './payments/TransactionsTable.vue'

const auth = useAuthStore()
const isBrand = computed(() => auth.role === 'brand')
const tab = ref('history')
const { data, loading, error, reload } = useAsyncData(() => fetchPayments(auth.role), null)

const methodsTitle = computed(() => (isBrand.value ? 'Payment methods' : 'Withdrawal methods'))
</script>

<template>
  <PageHeader
    title="Payments"
    :lead="isBrand ? 'What you have paid, what is waiting to be paid, and how you pay creators.' : 'What you have earned, what is on its way, and where your money goes.'"
  />

  <LoadState :loading="loading" :error="error" @retry="reload">
    <template v-if="data">
      <div class="dash-grid dash-grid--stats">
        <StatCard v-for="(item, i) in data.summary" :key="item.key" :label="item.label" :value="item.value" :hint="item.hint" icon="mdi-wallet-outline" :tone="i" />
      </div>

      <v-tabs v-model="tab" class="dash-tabs" color="primary" show-arrows>
        <v-tab value="history">History and receipts</v-tab>
        <v-tab value="pending">
          Pending
          <v-chip v-if="data.pending.length" size="x-small" class="ml-2" color="warning" variant="flat">{{ data.pending.length }}</v-chip>
        </v-tab>
        <v-tab value="methods">{{ methodsTitle }}</v-tab>
      </v-tabs>

      <v-window v-model="tab" class="dash-window">
        <v-window-item value="history"><TransactionsTable :transactions="data.transactions" /></v-window-item>
        <v-window-item value="pending"><PendingList :pending="data.pending" :role="auth.role" /></v-window-item>
        <v-window-item value="methods"><MethodsPanel :methods="data.methods" :role="auth.role" /></v-window-item>
      </v-window>
    </template>
  </LoadState>
</template>
