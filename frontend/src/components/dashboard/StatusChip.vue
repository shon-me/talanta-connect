<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true },
  label: { type: String, default: '' },
})

const STATUS = {
  verified: ['success', 'Verified'], pending: ['warning', 'Pending'], unverified: ['grey', 'Not verified'],
  paid: ['success', 'Paid'], refunded: ['info', 'Refunded'], failed: ['error', 'Failed'],
  awaiting_approval: ['warning', 'Awaiting approval'], in_escrow: ['info', 'In escrow'], processing: ['info', 'Processing'],
  draft: ['grey', 'Draft'], open: ['success', 'Open'], in_progress: ['info', 'In progress'], closed: ['grey', 'Closed'],
  active: ['success', 'Active'], completed: ['primary', 'Completed'], sent: ['info', 'Sent to brand'],
  approved: ['success', 'Approved'], rejected: ['error', 'Rejected'], denied: ['error', 'Denied'],
  info: ['info', 'Info'], warning: ['warning', 'Warning'], error: ['error', 'Error'],
  ok: ['success', 'Working'], degraded: ['warning', 'Slow'], down: ['error', 'Down'],
  high: ['error', 'High risk'], medium: ['warning', 'Medium risk'],
}

const entry = computed(() => STATUS[props.status] ?? ['grey', props.status])
</script>

<template>
  <v-chip size="small" variant="tonal" :color="entry[0]">{{ label || entry[1] }}</v-chip>
</template>
