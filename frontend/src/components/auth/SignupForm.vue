<script setup>
import { useSignupForm } from '@/composables/useSignupForm'

// Reusable: used in the homepage hero now, and can be dropped into a /signup page later.
defineProps({
  dark: { type: Boolean, default: false }, // use on dark or glass backgrounds
})

const emit = defineEmits(['success'])

const { form, formRef, loading, error, showPassword, fieldRules, submit } = useSignupForm({
  onSuccess: (user) => emit('success', user),
})
</script>

<template>
  <v-form ref="formRef" class="signup-form" :class="{ 'signup-form--dark': dark }" validate-on="blur"
    @submit.prevent="submit">
    <v-text-field v-model="form.fullName" label="Full name" autocomplete="name" prepend-inner-icon="mdi-account-outline"
      :rules="fieldRules.fullName" variant="solo" flat rounded="lg" density="comfortable" />

    <v-text-field v-model="form.email" label="Email" type="email" autocomplete="email"
      prepend-inner-icon="mdi-email-outline" :rules="fieldRules.email" variant="solo" flat rounded="lg"
      density="comfortable" />

    <v-text-field v-model="form.password" label="Password" autocomplete="new-password"
      prepend-inner-icon="mdi-lock-outline" :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" :rules="fieldRules.password"
      variant="solo" flat rounded="lg" density="comfortable" @click:append-inner="showPassword = !showPassword" />

    <div class="signup-form__role">
      <span id="signup-role-label" class="signup-form__role-label">I want to join as</span>
      <v-btn-toggle v-model="form.role" class="signup-form__role-toggle" aria-labelledby="signup-role-label" mandatory
        divided variant="outlined" density="comfortable" rounded="lg">
        <v-btn value="creator" class="flex-grow-1" prepend-icon="mdi-palette-outline">Creator</v-btn>
        <v-btn value="brand" class="flex-grow-1" prepend-icon="mdi-storefront-outline">Brand</v-btn>
      </v-btn-toggle>
    </div>

    <v-alert v-if="error" class="signup-form__error" type="error" variant="flat" density="compact">
      {{ error }}
    </v-alert>

    <v-btn type="submit" color="secondary" size="large" rounded="lg" block :loading="loading">
      Create account
    </v-btn>

    <p class="signup-form__footer">
      Already have an account?
      <router-link to="/login">Log in</router-link>
    </p>
  </v-form>
</template>
