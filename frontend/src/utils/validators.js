// Vuetify field rules: return true when valid, or the error message to show.
export const rules = {
  required: (label) => (value) => !!String(value ?? '').trim() || `${label} is required`,
  email: (value) => /^\S+@\S+\.\S+$/.test(value ?? '') || 'Enter a valid email address',
  minLength: (min) => (value) => (value ?? '').length >= min || `Use at least ${min} characters`,
}
