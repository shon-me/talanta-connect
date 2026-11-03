<script setup>
import { useLoginForm } from '@/composables/useLoginForm'

defineProps({
  dark: { type: Boolean, default: false },
})

const emit = defineEmits(['success'])

const { form, formRef, loading, error, showPassword, fieldRules, submit } = useLoginForm({
  onSuccess: (user) => emit('success', user),
})
</script>

<template>
  <v-form ref="formRef" class="auth-form" :class="{ 'auth-form--dark': dark }" validate-on="blur"
    @submit.prevent="submit">

    <v-text-field v-model="form.email" label="Email" type="email" autocomplete="email"
      prepend-inner-icon="mdi-email-outline" :rules="fieldRules.email" variant="solo" flat rounded="lg"
      density="comfortable" />

    <v-text-field v-model="form.password" label="Password" autocomplete="new-password"
      prepend-inner-icon="mdi-lock-outline" :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" :rules="fieldRules.password"
      variant="solo" flat rounded="lg" density="comfortable" @click:append-inner="showPassword = !showPassword" />

    <v-alert v-if="error" class="auth-form__error" type="error" variant="flat" density="compact">
      {{ error }}
    </v-alert>

    <v-btn type="submit" color="secondary" size="large" rounded="lg" block :loading="loading">
      Login
    </v-btn>

    <p class="auth-form__footer">
      Don't have an account?
      <router-link to="/signup">Create Account</router-link>
    </p>
  </v-form>
</template>
