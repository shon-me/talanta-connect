<script setup>
import { reactive, ref, watch } from 'vue'
import { useAction } from '@/composables/useAction'
import { useToast } from '@/composables/useToast'
import { saveScope, submitScope } from '@/services/creatorDashboardService' // BACKEND: scopes (see service)
import { rules } from '@/utils/validators'

// Write what you will deliver for a brand, for how much, and by when.
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  scope: { type: Object, default: null }, // null = a new scope
  brands: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'saved'])

const formRef = ref(null)
const { busy, run } = useAction()
const { notify } = useToast()
let counter = 0
const row = (text = '') => ({ id: `new-${++counter}`, text })
const blank = () => ({ brand: '', title: '', summary: '', deliverables: [row()], price: 5000, dueDate: '', revisions: 2, status: 'draft' })
const form = reactive(blank())

watch(() => props.modelValue, (open) => {
  if (!open) return
  Object.assign(form, blank(), props.scope ? { ...props.scope, deliverables: props.scope.deliverables.map((d) => ({ ...d })) } : {})
  formRef.value?.resetValidation()
})

const payload = () => ({
  ...form,
  price: Number(form.price),
  revisions: Number(form.revisions),
  deliverables: form.deliverables.filter((d) => d.text.trim()),
})

async function save(send = false) {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  if (!payload().deliverables.length) return notify('Add at least one deliverable.', 'error')

  const { ok, value } = await run(async () => {
    const saved = await saveScope(payload())
    if (send) await submitScope(saved.id)
    return send ? { ...saved, status: 'sent' } : saved
  }, send ? 'Scope sent to the brand.' : 'Scope saved as a draft.')
  if (ok) {
    emit('saved', value)
    emit('update:modelValue', false)
  }
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="680" scrollable @update:model-value="emit('update:modelValue', $event)">
    <v-card class="dash-dialog" rounded="xl">
      <h2 class="dash-dialog__title">{{ scope ? 'Edit scope of work' : 'New scope of work' }}</h2>

      <v-form ref="formRef" class="dash-form" validate-on="blur" @submit.prevent="save(false)">
        <div class="dash-form__grid">
          <v-select v-model="form.brand" :items="brands" label="Brand" :rules="[rules.required('Brand')]" variant="outlined" density="comfortable" rounded="lg" />
          <v-text-field v-model="form.title" label="Task" :rules="[rules.required('Task')]" variant="outlined" density="comfortable" rounded="lg" />
        </div>
        <v-textarea v-model="form.summary" label="Summary" rows="2" auto-grow variant="outlined" density="comfortable" rounded="lg" />

        <div>
          <p class="dash-form__label">What you will deliver</p>
          <div v-for="(d, i) in form.deliverables" :key="d.id" class="dash-deliverable">
            <v-text-field v-model="d.text" :label="`Deliverable ${i + 1}`" hide-details variant="outlined" density="comfortable" rounded="lg" />
            <v-btn icon="mdi-close" variant="text" size="small" :disabled="form.deliverables.length === 1" :aria-label="`Remove deliverable ${i + 1}`" @click="form.deliverables.splice(i, 1)" />
          </div>
          <v-btn variant="text" color="primary" size="small" prepend-icon="mdi-plus" @click="form.deliverables.push(row())">Add deliverable</v-btn>
        </div>

        <div class="dash-form__grid">
          <v-text-field v-model="form.price" label="Price (KSh)" type="number" inputmode="numeric" :rules="[rules.positive('Price')]" variant="outlined" density="comfortable" rounded="lg" />
          <v-text-field v-model="form.dueDate" label="Due date" type="date" :rules="[rules.required('Due date'), rules.notPast]" variant="outlined" density="comfortable" rounded="lg" />
          <v-text-field v-model="form.revisions" label="Rounds of changes included" type="number" inputmode="numeric" :rules="[rules.wholeNumber(0, 'Rounds of changes')]" variant="outlined" density="comfortable" rounded="lg" />
        </div>

        <div class="dash-form__actions">
          <v-btn variant="text" @click="emit('update:modelValue', false)">Cancel</v-btn>
          <v-btn variant="outlined" color="primary" size="large" rounded="lg" :loading="busy" @click="save(false)">Save draft</v-btn>
          <v-btn color="secondary" size="large" rounded="lg" :loading="busy" @click="save(true)">Send to brand</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>
