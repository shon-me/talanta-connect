import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  addReminder as addReminderRequest,
  dismissReminder as dismissReminderRequest,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/services/dashboardService'

// Notifications and reminders, shared so the bell in the header and the notifications page agree.
export const useNotificationStore = defineStore('notifications', () => {
  const items = ref([])
  const reminders = ref([])
  const loading = ref(false)
  const error = ref(null)
  const unread = computed(() => items.value.filter((n) => !n.read).length)

  async function load(role) {
    loading.value = true
    error.value = null
    try {
      const data = await fetchNotifications(role)
      items.value = data.notifications
      reminders.value = data.reminders
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function markRead(role, id) {
    const item = items.value.find((n) => n.id === id)
    if (!item || item.read) return
    item.read = true // shows straight away
    try {
      await markNotificationRead(role, id)
    } catch {
      item.read = false
    }
  }

  async function markAllRead(role) {
    const before = items.value.map((n) => n.read)
    items.value.forEach((n) => { n.read = true })
    try {
      await markAllNotificationsRead(role)
    } catch {
      items.value.forEach((n, i) => { n.read = before[i] })
    }
  }

  async function addReminder(role, reminder) {
    const created = await addReminderRequest(role, reminder)
    reminders.value.push(created)
    reminders.value.sort((a, b) => a.due.localeCompare(b.due))
  }

  async function dismissReminder(role, id) {
    await dismissReminderRequest(role, id)
    reminders.value = reminders.value.filter((r) => r.id !== id)
  }

  return { items, reminders, loading, error, unread, load, markRead, markAllRead, addReminder, dismissReminder }
})
