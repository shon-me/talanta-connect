<script setup>
import { computed, reactive, ref } from 'vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import EmptyState from '@/components/dashboard/EmptyState.vue'
import LoadState from '@/components/dashboard/LoadState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import { useAction } from '@/composables/useAction'
import { TYPE_ICONS } from '@/constants/dashboardNav'
import { sendAnnouncement } from '@/services/adminService' // BACKEND: announcements (see service)
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import { formatDate, formatRelative } from '@/utils/format'
import { rules } from '@/utils/validators'

// Used by the creator, brand and admin dashboards. The list is loaded by DashboardLayout.
const auth = useAuthStore()
const notes = useNotificationStore()
const filter = ref('all')

const shown = computed(() => (filter.value === 'unread' ? notes.items.filter((n) => !n.read) : notes.items))

// ---------- reminders ----------
const reminderOpen = ref(false)
const reminderForm = ref(null)
const reminder = reactive({ title: '', due: '' })
const reminderAction = useAction()

async function addReminder() {
  const { valid } = await reminderForm.value.validate()
  if (!valid) return
  const { ok } = await reminderAction.run(() => notes.addReminder(auth.role, { ...reminder }), 'Reminder added.')
  if (ok) {
    Object.assign(reminder, { title: '', due: '' })
    reminderOpen.value = false
  }
}

const dismissAction = useAction()
const dismiss = (id) => dismissAction.run(() => notes.dismissReminder(auth.role, id))

// ---------- admin only: announcements ----------
const isAdmin = computed(() => auth.role === 'admin')
const announceOpen = ref(false)
const announceForm = ref(null)
const announcement = reactive({ audience: 'all', title: '', message: '' })
const announceAction = useAction()

async function announce() {
  const { valid } = await announceForm.value.validate()
  if (!valid) return
  const { ok } = await announceAction.run(() => sendAnnouncement({ ...announcement }), 'Announcement sent.')
  if (ok) {
    Object.assign(announcement, { audience: 'all', title: '', message: '' })
    announceOpen.value = false
  }
}
</script>

<template>
  <PageHeader title="Notifications" :lead="isAdmin ? 'System alerts and announcements.' : 'Updates about your work, and reminders.'">
    <v-btn v-if="isAdmin" color="secondary" rounded="lg" prepend-icon="mdi-bullhorn-outline" @click="announceOpen = true">New announcement</v-btn>
    <v-btn variant="outlined" color="primary" rounded="lg" :disabled="!notes.unread" @click="notes.markAllRead(auth.role)">Mark all as read</v-btn>
  </PageHeader>

  <LoadState :loading="notes.loading && !notes.items.length" :error="notes.error" @retry="notes.load(auth.role)">
    <div class="dash-grid dash-grid--notes">
      <DashCard title="Notifications">
        <template #actions>
          <v-btn-toggle v-model="filter" mandatory divided variant="outlined" color="primary" density="compact" rounded="lg">
            <v-btn value="all">All</v-btn>
            <v-btn value="unread">Unread <span v-if="notes.unread" class="dash-count">{{ notes.unread }}</span></v-btn>
          </v-btn-toggle>
        </template>

        <ul v-if="shown.length" class="dash-list">
          <li v-for="n in shown" :key="n.id">
            <button type="button" class="dash-list__item dash-list__item--button" :class="{ 'dash-list__item--unread': !n.read }" @click="notes.markRead(auth.role, n.id)">
              <v-icon :icon="TYPE_ICONS[n.type] ?? TYPE_ICONS.system" />
              <div class="dash-list__main">
                <p class="dash-list__title">{{ n.title }}</p>
                <p class="dash-list__meta">{{ n.body }}</p>
              </div>
              <span class="dash-list__side">{{ formatRelative(n.time) }}</span>
              <span v-if="!n.read" class="dash-dot" aria-label="Unread" />
            </button>
          </li>
        </ul>
        <EmptyState v-else icon="mdi-bell-check-outline" :title="filter === 'unread' ? 'You are all caught up' : 'No notifications yet'" />
      </DashCard>

      <DashCard title="Reminders">
        <template #actions>
          <v-btn color="primary" variant="text" size="small" prepend-icon="mdi-plus" @click="reminderOpen = true">Add</v-btn>
        </template>
        <ul v-if="notes.reminders.length" class="dash-list">
          <li v-for="r in notes.reminders" :key="r.id" class="dash-list__item">
            <v-icon icon="mdi-alarm" />
            <div class="dash-list__main">
              <p class="dash-list__title">{{ r.title }}</p>
              <p class="dash-list__meta">Due {{ formatDate(r.due) }}</p>
            </div>
            <v-btn icon="mdi-check" variant="text" size="small" :aria-label="`Done: ${r.title}`" @click="dismiss(r.id)" />
          </li>
        </ul>
        <EmptyState v-else icon="mdi-alarm-off" title="No reminders" text="Add one so you do not miss a deadline." />
      </DashCard>
    </div>
  </LoadState>

  <v-dialog v-model="reminderOpen" max-width="440">
    <v-card class="dash-dialog" rounded="xl">
      <h2 class="dash-dialog__title">Add a reminder</h2>
      <v-form ref="reminderForm" class="dash-form" validate-on="blur" @submit.prevent="addReminder">
        <v-text-field v-model="reminder.title" label="What should we remind you about?" :rules="[rules.required('Reminder')]" variant="outlined" density="comfortable" rounded="lg" />
        <v-text-field v-model="reminder.due" label="Date" type="date" :rules="[rules.required('Date'), rules.notPast]" variant="outlined" density="comfortable" rounded="lg" />
        <div class="dash-form__actions">
          <v-btn variant="text" @click="reminderOpen = false">Cancel</v-btn>
          <v-btn type="submit" color="secondary" size="large" rounded="lg" :loading="reminderAction.busy.value">Add reminder</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>

  <v-dialog v-if="isAdmin" v-model="announceOpen" max-width="480">
    <v-card class="dash-dialog" rounded="xl">
      <h2 class="dash-dialog__title">New announcement</h2>
      <v-form ref="announceForm" class="dash-form" validate-on="blur" @submit.prevent="announce">
        <v-select v-model="announcement.audience" :items="[{ value: 'all', title: 'Everyone' }, { value: 'creators', title: 'Creators' }, { value: 'brands', title: 'Brands' }]" label="Send to" variant="outlined" density="comfortable" rounded="lg" />
        <v-text-field v-model="announcement.title" label="Title" :rules="[rules.required('Title')]" variant="outlined" density="comfortable" rounded="lg" />
        <v-textarea v-model="announcement.message" label="Message" rows="3" auto-grow :rules="[rules.required('Message')]" variant="outlined" density="comfortable" rounded="lg" />
        <div class="dash-form__actions">
          <v-btn variant="text" @click="announceOpen = false">Cancel</v-btn>
          <v-btn type="submit" color="secondary" size="large" rounded="lg" :loading="announceAction.busy.value">Send</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>
