<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ADMIN_BASE } from '@/constants/dashboardNav'
import { loginAdmin } from '@/services/authService' // BACKEND: admin sign in (see service)
import { useAuthStore } from '@/stores/auth'
import { rules } from '@/utils/validators'

// Not linked from anywhere. Staff open it by typing the address.
const router = useRouter()
const auth = useAuthStore()

const formRef = ref(null)
const form = reactive({ email: '', password: '', code: '' })
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  const { valid } = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  try {
    auth.setUser(await loginAdmin({ ...form }))
    router.push(ADMIN_BASE)
  } catch (err) {
    error.value = err.message || 'Incorrect details.' // one message for every failure on purpose
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth" aria-labelledby="admin-login-title">
    <div class="auth__inner">
      <div class="auth__card">
        <h1 id="admin-login-title" class="auth__title">Staff sign in</h1>
        <p class="auth__lead">Authorised staff only. Every attempt is recorded.</p>

        <v-form ref="formRef" class="auth-form" validate-on="blur" @submit.prevent="submit">
          <v-text-field v-model="form.email" label="Email" type="email" autocomplete="username" :rules="[rules.required('Email'), rules.email]" variant="outlined" density="comfortable" rounded="lg" />
          <v-text-field
            v-model="form.password"
            label="Password"
            autocomplete="current-password"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            :rules="[rules.required('Password')]"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            @click:append-inner="showPassword = !showPassword"
          />
          <v-text-field v-model="form.code" label="6 digit code from your authenticator app" inputmode="numeric" autocomplete="one-time-code" maxlength="6" :rules="[rules.required('Code'), rules.digits(6, 6)]" variant="outlined" density="comfortable" rounded="lg" />

          <v-alert v-if="error" class="auth-form__error" type="error" variant="flat" density="compact">{{ error }}</v-alert>

          <v-btn type="submit" color="secondary" size="large" rounded="lg" block :loading="loading">Sign in</v-btn>
        </v-form>
      </div>
    </div>
  </section>
</template>
