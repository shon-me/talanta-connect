<script setup>
import { ref } from 'vue'
import ConfirmDialog from '@/components/dashboard/ConfirmDialog.vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import EmptyState from '@/components/dashboard/EmptyState.vue'
import { useAction } from '@/composables/useAction'
import { makeDefaultMethod, removePaymentMethod } from '@/services/dashboardService' // BACKEND: payment methods (see service)
import { formatDate } from '@/utils/format'
import AddMethodDialog from './AddMethodDialog.vue'

// Brands add the ways they pay creators. Creators add the places their money is sent.
const props = defineProps({
  methods: { type: Array, required: true },
  role: { type: String, required: true },
})

const list = ref(props.methods.map((m) => ({ ...m })))
const adding = ref(false)
const removing = ref(null)
const confirmOpen = ref(false)
const { busy, run } = useAction()

const ICONS = { mpesa: 'mdi-cellphone', bank: 'mdi-bank-outline', card: 'mdi-credit-card-outline' }

function added(method) {
  if (method.isDefault) list.value.forEach((m) => { m.isDefault = false })
  list.value.push(method)
}

async function makeDefault(method) {
  const { ok } = await run(() => makeDefaultMethod(props.role, method.id), 'Default method updated.')
  if (ok) list.value.forEach((m) => { m.isDefault = m.id === method.id })
}

function askRemove(method) {
  removing.value = method
  confirmOpen.value = true
}

async function remove() {
  const method = removing.value
  const { ok } = await run(() => removePaymentMethod(props.role, method.id), 'Method removed.')
  if (ok) {
    list.value = list.value.filter((m) => m.id !== method.id)
    if (method.isDefault && list.value[0]) list.value[0].isDefault = true
    confirmOpen.value = false
  }
}
</script>

<template>
  <DashCard
    :title="role === 'brand' ? 'Payment methods' : 'Withdrawal methods'"
    :subtitle="role === 'brand' ? 'How you pay creators.' : 'Where your earnings are sent.'"
  >
    <template #actions>
      <v-btn color="secondary" rounded="lg" prepend-icon="mdi-plus" @click="adding = true">Add method</v-btn>
    </template>

    <ul v-if="list.length" class="dash-list">
      <li v-for="m in list" :key="m.id" class="dash-list__item dash-list__item--wrap">
        <v-icon :icon="ICONS[m.type]" />
        <div class="dash-list__main">
          <p class="dash-list__title">{{ m.label }} <span class="dash-list__detail">{{ m.detail }}</span></p>
          <p class="dash-list__meta">Added {{ formatDate(m.addedAt) }}</p>
        </div>
        <v-chip v-if="m.isDefault" size="small" color="success" variant="tonal">Default</v-chip>
        <v-btn v-else variant="text" size="small" color="primary" @click="makeDefault(m)">Make default</v-btn>
        <v-btn icon="mdi-delete-outline" variant="text" size="small" :aria-label="`Remove ${m.label} ${m.detail}`" @click="askRemove(m)" />
      </li>
    </ul>
    <EmptyState
      v-else
      icon="mdi-wallet-plus-outline"
      :title="role === 'brand' ? 'No payment method yet' : 'No withdrawal method yet'"
      :text="role === 'brand' ? 'Add one so you can pay creators.' : 'Add one so your earnings can be paid out.'"
    />

    <AddMethodDialog v-model="adding" :role="role" @added="added" />

    <ConfirmDialog
      v-model="confirmOpen"
      title="Remove this method?"
      :text="removing ? `${removing.label} ${removing.detail} will be removed from your account.` : ''"
      confirm-label="Remove"
      danger
      :busy="busy"
      @confirm="remove"
    />
  </DashCard>
</template>
