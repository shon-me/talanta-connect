<script setup>
import { reactive, ref, watch } from 'vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import LoadState from '@/components/dashboard/LoadState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import { useAction } from '@/composables/useAction'
import { useAsyncData } from '@/composables/useAsyncData'
import { useToast } from '@/composables/useToast'
import { fetchSettings, requestPasswordChange, saveSettings } from '@/services/dashboardService' // BACKEND: settings (see service)
import { useAuthStore } from '@/stores/auth'
import { rules } from '@/utils/validators'

const auth = useAuthStore()
const { notify } = useToast()
const { data, loading, error, reload } = useAsyncData(() => fetchSettings(auth.role), null)

// Changes to these need an admin to approve them before they take effect
const NEEDS_REVIEW = { email: 'Email', phone: 'Phone number' }

const profile = reactive({})
const original = ref({})
const prefs = reactive({})
const waiting = reactive({}) // field -> the value that is waiting for review

watch(data, (d) => {
  if (!d) return
  Object.assign(profile, d.profile)
  original.value = { ...d.profile }
  Object.assign(prefs, d.preferences)
})

const profileForm = ref(null)
const passwordForm = ref(null)
const profileAction = useAction()
const prefsAction = useAction()
const passwordAction = useAction()
const password = reactive({ current: '', next: '', again: '' })
const showPassword = ref(false)

async function saveProfile() {
  const { valid } = await profileForm.value.validate()
  if (!valid) return
  const changed = Object.fromEntries(Object.entries(profile).filter(([key, value]) => value !== original.value[key]))
  if (!Object.keys(changed).length) return notify('Nothing to save yet.')

  const { ok, value } = await profileAction.run(() => saveSettings(auth.role, { profile: changed }))
  if (!ok) return
  value.applied.forEach((field) => { original.value[field] = profile[field] })
  value.pendingReview.forEach((field) => {
    waiting[field] = profile[field]
    profile[field] = original.value[field] // the saved value stays until an admin approves
  })
  notify(value.pendingReview.length
    ? `Saved. ${value.pendingReview.map((f) => NEEDS_REVIEW[f]).join(' and ')} will change once an admin has reviewed it.`
    : 'Saved.')
}

const savePrefs = () => prefsAction.run(() => saveSettings(auth.role, { preferences: { ...prefs } }), 'Notification settings saved.')

async function changePassword() {
  const { valid } = await passwordForm.value.validate()
  if (!valid) return
  const { ok, value } = await passwordAction.run(() => requestPasswordChange({ current: password.current, next: password.next }))
  if (!ok) return
  Object.assign(password, { current: '', next: '', again: '' })
  passwordForm.value.resetValidation()
  notify(value.pendingReview ? 'Your password change was sent for a security check.' : 'Password updated.')
}
</script>

<template>
  <PageHeader title="Settings" lead="Your profile, your password and how we contact you." />

  <LoadState :loading="loading" :error="error" @retry="reload">
    <template v-if="data">
      <DashCard title="Profile" subtitle="This is what other people see on your page.">
        <v-form ref="profileForm" class="dash-form" validate-on="blur" @submit.prevent="saveProfile">
          <div class="dash-form__grid">
            <v-text-field v-model="profile.displayName" label="Display name" :rules="[rules.required('Display name')]" variant="outlined" density="comfortable" rounded="lg" />
            <v-text-field v-model="profile.location" label="Location" variant="outlined" density="comfortable" rounded="lg" />
            <v-text-field
              v-model="profile.email"
              label="Email"
              type="email"
              :rules="[rules.required('Email'), rules.email]"
              :hint="waiting.email ? `Waiting for review: ${waiting.email}` : 'Changes are checked by an admin first'"
              persistent-hint
              variant="outlined"
              density="comfortable"
              rounded="lg"
            />
            <v-text-field
              v-model="profile.phone"
              label="Phone number"
              inputmode="tel"
              :hint="waiting.phone ? `Waiting for review: ${waiting.phone}` : 'Changes are checked by an admin first'"
              persistent-hint
              variant="outlined"
              density="comfortable"
              rounded="lg"
            />
            <v-text-field v-model="profile.website" label="Website" class="dash-form__full" variant="outlined" density="comfortable" rounded="lg" />
            <v-textarea v-model="profile.bio" label="About you" rows="3" auto-grow counter="300" :rules="[(v) => (v ?? '').length <= 300 || 'Keep it to 300 characters']" class="dash-form__full" variant="outlined" density="comfortable" rounded="lg" />
          </div>
          <!-- Profile image: the upload is added here once image upload is built -->
          <div class="dash-form__actions">
            <v-btn type="submit" color="secondary" size="large" rounded="lg" :loading="profileAction.busy.value">Save profile</v-btn>
          </div>
        </v-form>
      </DashCard>

      <DashCard title="Password" subtitle="Password changes get an extra security check, so they may not apply straight away.">
        <v-form ref="passwordForm" class="dash-form" validate-on="blur" @submit.prevent="changePassword">
          <div class="dash-form__grid">
            <v-text-field v-model="password.current" label="Current password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" :rules="[rules.required('Current password')]" class="dash-form__full" variant="outlined" density="comfortable" rounded="lg" />
            <v-text-field v-model="password.next" label="New password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" :rules="[rules.required('New password'), rules.minLength(8)]" variant="outlined" density="comfortable" rounded="lg" />
            <v-text-field v-model="password.again" label="Repeat new password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" :rules="[rules.required('Repeat the password'), rules.matches(() => password.next, 'Passwords')]" variant="outlined" density="comfortable" rounded="lg" />
          </div>
          <v-checkbox v-model="showPassword" label="Show passwords" density="compact" hide-details />
          <div class="dash-form__actions">
            <v-btn type="submit" color="secondary" size="large" rounded="lg" :loading="passwordAction.busy.value">Change password</v-btn>
          </div>
        </v-form>
      </DashCard>

      <DashCard title="Notifications" subtitle="Choose what we email or text you about.">
        <div class="dash-switches">
          <v-switch v-model="prefs.emailPayments" label="Email me about payments" color="secondary" hide-details density="comfortable" />
          <v-switch v-model="prefs.emailCollabs" :label="auth.role === 'brand' ? 'Email me about creator applications' : 'Email me about brand invites'" color="secondary" hide-details density="comfortable" />
          <v-switch v-model="prefs.emailReminders" label="Email me reminders" color="secondary" hide-details density="comfortable" />
          <v-switch v-model="prefs.smsReminders" label="Text me reminders" color="secondary" hide-details density="comfortable" />
        </div>
        <div class="dash-form__actions">
          <v-btn color="secondary" size="large" rounded="lg" :loading="prefsAction.busy.value" @click="savePrefs">Save notification settings</v-btn>
        </div>
      </DashCard>
    </template>
  </LoadState>
</template>
