<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useAction } from '@/composables/useAction'
import { addPaymentMethod } from '@/services/dashboardService' // BACKEND: add a payment method (see service)
import { rules } from '@/utils/validators'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  role: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue', 'added'])

const formRef = ref(null)
const { busy, run } = useAction()
const blank = () => ({ type: 'mpesa', phone: '', accountName: '', bankName: '', accountNumber: '' })
const form = reactive(blank())

// Brands can also pay by card. Creators withdraw to M-Pesa or a bank account.
const types = computed(() => [
  { value: 'mpesa', title: 'M-Pesa' },
  { value: 'bank', title: 'Bank account' },
  ...(props.role === 'brand' ? [{ value: 'card', title: 'Card' }] : []),
])

watch(() => props.modelValue, (open) => { if (open) Object.assign(form, blank()) })

async function save() {
  if (form.type !== 'card') {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }
  const { ok, value } = await run(() => addPaymentMethod(props.role, { ...form }), 'Method added.')
  if (ok) {
    emit('added', value)
    emit('update:modelValue', false)
  }
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="480" @update:model-value="emit('update:modelValue', $event)">
    <v-card class="dash-dialog" rounded="xl">
      <h2 class="dash-dialog__title">{{ role === 'brand' ? 'Add a payment method' : 'Add a withdrawal method' }}</h2>

      <v-form ref="formRef" class="dash-form" validate-on="blur" @submit.prevent="save">
        <v-select v-model="form.type" :items="types" label="Type" variant="outlined" density="comfortable" rounded="lg" />

        <template v-if="form.type === 'mpesa'">
          <v-text-field v-model="form.phone" label="M-Pesa phone number" placeholder="0712 345 678" inputmode="tel" :rules="[rules.required('Phone number'), rules.phone]" variant="outlined" density="comfortable" rounded="lg" />
          <v-text-field v-model="form.accountName" label="Name registered on M-Pesa" :rules="[rules.required('Name')]" variant="outlined" density="comfortable" rounded="lg" />
        </template>

        <template v-else-if="form.type === 'bank'">
          <v-text-field v-model="form.bankName" label="Bank" :rules="[rules.required('Bank')]" variant="outlined" density="comfortable" rounded="lg" />
          <v-text-field v-model="form.accountName" label="Account name" :rules="[rules.required('Account name')]" variant="outlined" density="comfortable" rounded="lg" />
          <v-text-field v-model="form.accountNumber" label="Account number" inputmode="numeric" :rules="[rules.required('Account number'), rules.digits(6, 20)]" variant="outlined" density="comfortable" rounded="lg" />
        </template>

        <p v-else class="dash-note">
          Card details are entered in our payment partner's secure form, so they never pass through Talanta Connect.
        </p>

        <p v-if="form.type !== 'card'" class="dash-note">We keep only the last digits on screen. A new method may be checked before it is first used.</p>

        <div class="dash-form__actions">
          <v-btn variant="text" @click="emit('update:modelValue', false)">Cancel</v-btn>
          <v-btn type="submit" color="secondary" size="large" rounded="lg" :loading="busy">
            {{ form.type === 'card' ? 'Continue to secure form' : 'Add method' }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>
