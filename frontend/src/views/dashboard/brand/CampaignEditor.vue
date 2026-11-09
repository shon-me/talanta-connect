<script setup>
import { reactive, ref, watch } from 'vue'
import { useAction } from '@/composables/useAction'
import { saveCampaign } from '@/services/brandDashboardService' // BACKEND: save a campaign (see service)
import { rules } from '@/utils/validators'

// Create or change a campaign (a task creators can apply for).
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  campaign: { type: Object, default: null }, // null = a new campaign
})

const emit = defineEmits(['update:modelValue', 'saved'])

const formRef = ref(null)
const { busy, run } = useAction()
const blank = () => ({ title: '', description: '', payAmount: 5000, payMethod: 'M-Pesa', deadline: '', slots: 1, skills: [], status: 'draft' })
const form = reactive(blank())

watch(() => props.modelValue, (open) => {
  if (!open) return
  Object.assign(form, blank(), props.campaign ? { ...props.campaign, skills: [...props.campaign.skills] } : {})
  formRef.value?.resetValidation()
})

async function save(status) {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  const payload = { ...form, status: status ?? form.status, payAmount: Number(form.payAmount), slots: Number(form.slots) }
  const { ok, value } = await run(() => saveCampaign(payload), status === 'open' ? 'Campaign published.' : 'Campaign saved.')
  if (ok) {
    emit('saved', value)
    emit('update:modelValue', false)
  }
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="640" scrollable @update:model-value="emit('update:modelValue', $event)">
    <v-card class="dash-dialog" rounded="xl">
      <h2 class="dash-dialog__title">{{ campaign ? 'Edit campaign' : 'New campaign' }}</h2>

      <v-form ref="formRef" class="dash-form" validate-on="blur" @submit.prevent="save()">
        <v-text-field v-model="form.title" label="Title" :rules="[rules.required('Title')]" variant="outlined" density="comfortable" rounded="lg" />
        <v-textarea v-model="form.description" label="What do you need?" rows="3" auto-grow :rules="[rules.required('Description'), rules.minLength(20)]" variant="outlined" density="comfortable" rounded="lg" />

        <div class="dash-form__grid">
          <v-text-field v-model="form.payAmount" label="Pay per task (KSh)" type="number" inputmode="numeric" :rules="[rules.positive('Pay')]" variant="outlined" density="comfortable" rounded="lg" />
          <v-select v-model="form.payMethod" :items="['M-Pesa', 'Bank transfer', 'Card']" label="How you pay" variant="outlined" density="comfortable" rounded="lg" />
          <v-text-field v-model="form.deadline" label="Deadline" type="date" :rules="[rules.required('Deadline'), rules.notPast]" variant="outlined" density="comfortable" rounded="lg" />
          <v-text-field v-model="form.slots" label="Creators needed" type="number" inputmode="numeric" :rules="[rules.wholeNumber(1, 'Creators needed')]" variant="outlined" density="comfortable" rounded="lg" />
        </div>

        <v-combobox v-model="form.skills" label="Skills needed" hint="Type a skill and press Enter" persistent-hint multiple chips closable-chips variant="outlined" density="comfortable" rounded="lg" />
        <!-- Cover image: the upload is added here once image upload is built -->

        <div class="dash-form__actions">
          <v-btn variant="text" @click="emit('update:modelValue', false)">Cancel</v-btn>
          <v-btn variant="outlined" color="primary" size="large" rounded="lg" :loading="busy" @click="save(form.status === 'open' ? 'open' : 'draft')">
            {{ form.status === 'open' ? 'Save changes' : 'Save as draft' }}
          </v-btn>
          <v-btn v-if="form.status !== 'open'" color="secondary" size="large" rounded="lg" :loading="busy" @click="save('open')">Publish</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>
