<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Confirm' },
  danger: { type: Boolean, default: false },
  busy: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'confirm'])
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="420" @update:model-value="emit('update:modelValue', $event)">
    <v-card class="dash-confirm" rounded="xl">
      <h2 class="dash-confirm__title">{{ title }}</h2>
      <p v-if="text" class="dash-confirm__text">{{ text }}</p>
      <slot />
      <div class="dash-confirm__actions">
        <v-btn variant="text" @click="emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn :color="danger ? 'error' : 'secondary'" :loading="busy" :disabled="disabled" @click="emit('confirm')">{{ confirmLabel }}</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
