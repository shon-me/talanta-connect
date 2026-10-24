import { reactive, ref } from 'vue'
import { registerUser } from '@/services/authService'
import { rules } from '@/utils/validators'

export function useSignupForm({ onSuccess } = {}) {
  const form = reactive({ fullName: '', email: '', password: '', role: 'creator' })
  const formRef = ref(null)
  const loading = ref(false)
  const error = ref('')
  const showPassword = ref(false)

  const fieldRules = {
    fullName: [rules.required('Full name')],
    email: [rules.required('Email'), rules.email],
    password: [rules.required('Password'), rules.minLength(8)],
  }

  async function submit() {
    error.value = ''
    const { valid } = await formRef.value.validate()
    if (!valid) return

    loading.value = true
    try {
      const user = await registerUser({ ...form })
      onSuccess?.(user)
    } catch (err) {
      // BACKEND: err.fields holds per-field errors from a 400 response (e.g. duplicate email).
      // Map them onto the inputs here if you want field-level messages instead of one banner.
      error.value = err.message || 'Something went wrong. Try again.'
    } finally {
      loading.value = false
    }
  }

  return { form, formRef, loading, error, showPassword, fieldRules, submit }
}
