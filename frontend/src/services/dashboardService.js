// Everything the creator and brand dashboards share: overview, analytics, payments, notifications, settings.
// The server knows who is asking from the session, so the endpoints do not take a role.
// `role` is only used by the mock data.
import { getCamel, sendCamel, USE_MOCK } from './api'
import * as mock from '@/mocks/dashboardData'

export const fetchOverview = (role) => {
  // BACKEND: GET /api/dashboard/overview/
  //   -> { profile: { name, location, bio, verification: 'verified'|'pending'|'unverified', memberSince,
  //                   completeness: 0-100, missing: [string] },
  //        stats: [ { key, label, value, hint, icon } ]  (4 items: money this month, active jobs/campaigns, ...),
  //        activity: [ { id, type: 'payment'|'collaboration'|'task'|'system', text, time } ],
  //        reminders: [ { id, title, due } ] }
  return USE_MOCK ? mock.overview(role) : getCamel('/dashboard/overview/')
}

export const fetchAnalytics = (role) => {
  // BACKEND: GET /api/dashboard/analytics/
  //   -> { totals: { tasks, jobs, money },
  //        taskStatus: [ { label, count } ], jobStatus: [ { label, count } ],
  //        trend: { labels: [month], tasks: [n], jobs: [n], money: [n] }   (last 6 months),
  //        partners: [ { name, jobs, amount } ] }
  //   Creator: tasks = tasks they applied for or were given, jobs = confirmed jobs, money = earned.
  //   Brand:   tasks = tasks they posted, jobs = jobs given to creators, money = spent.
  return USE_MOCK ? mock.analytics(role) : getCamel('/dashboard/analytics/')
}

// ---------------------------------------------------------------- payments
export const fetchPayments = (role) => {
  // BACKEND: GET /api/dashboard/payments/
  //   -> { summary: [ { key, label, value, hint } ],
  //        transactions: [ { id, date, reference, description, counterparty, amount (negative = money out),
  //                          status: 'paid'|'refunded'|'failed', method } ],
  //        pending: [ { id, description, counterparty, amount, status: 'awaiting_approval'|'in_escrow'|'processing',
  //                     since, dueDate } ],
  //        methods: [ { id, type: 'mpesa'|'bank'|'card', label, detail (already masked), isDefault, addedAt } ] }
  //   Page the transactions (GET .../transactions/?cursor=) once there are many.
  return USE_MOCK ? mock.payments(role) : getCamel('/dashboard/payments/')
}

export const addPaymentMethod = (role, input) => {
  // BACKEND: POST /api/dashboard/payment-methods/
  //   body -> { type: 'mpesa', phone }  or  { type: 'bank', bankName, accountName, accountNumber }
  //   -> the saved method with `detail` already masked. The server must never send the full number back.
  //   Cards: never send card numbers through this API. Use the payment provider's hosted form or SDK,
  //   which gives back a token, and send only that token plus the last 4 digits and brand.
  //   Creators add withdrawal methods, brands add payment methods: the same endpoint, the server
  //   decides by role. Verify the M-Pesa number (name match) and bank account before first use.
  return USE_MOCK ? mock.addMethod(role, input) : sendCamel('POST', '/dashboard/payment-methods/', input)
}

export const removePaymentMethod = (role, id) => {
  // BACKEND: DELETE /api/dashboard/payment-methods/<id>/   (refuse if it is the only method and money is pending)
  return USE_MOCK ? mock.removeMethod(role, id) : sendCamel('DELETE', `/dashboard/payment-methods/${id}/`)
}

export const makeDefaultMethod = (role, id) => {
  // BACKEND: POST /api/dashboard/payment-methods/<id>/default/
  return USE_MOCK ? mock.setDefaultMethod(role, id) : sendCamel('POST', `/dashboard/payment-methods/${id}/default/`)
}

export const releasePayment = (role, id) => {
  // BACKEND: POST /api/dashboard/payments/<id>/release/   (brands only: approves the work and pays the creator)
  return USE_MOCK ? mock.releasePayment(role, id) : sendCamel('POST', `/dashboard/payments/${id}/release/`)
}

export const receiptUrl = (id) => {
  // BACKEND: GET /api/dashboard/payments/<id>/receipt/  -> a PDF the signed-in user is allowed to see
  return `${import.meta.env.VITE_API_URL || ''}/dashboard/payments/${id}/receipt/`
}

// ---------------------------------------------------------------- notifications and reminders
export const fetchNotifications = (role) => {
  // BACKEND: GET /api/dashboard/notifications/
  //   -> { notifications: [ { id, type: 'payment'|'collaboration'|'reminder'|'system', title, body, time, read } ],
  //        reminders: [ { id, title, due } ] }
  //   Newest first. For live updates use a WebSocket or poll the unread count every minute or so.
  return USE_MOCK ? mock.notifications(role) : getCamel('/dashboard/notifications/')
}

export const markNotificationRead = (role, id) =>
  // BACKEND: POST /api/dashboard/notifications/<id>/read/
  USE_MOCK ? mock.markNotificationRead(role, id) : sendCamel('POST', `/dashboard/notifications/${id}/read/`)

export const markAllNotificationsRead = (role) =>
  // BACKEND: POST /api/dashboard/notifications/read-all/
  USE_MOCK ? mock.markAllNotificationsRead(role) : sendCamel('POST', '/dashboard/notifications/read-all/')

export const addReminder = (role, reminder) =>
  // BACKEND: POST /api/dashboard/reminders/  body -> { title, due }  -> { id, title, due }
  //   Needs a scheduled job that sends the reminder by email / SMS / notification on the due date.
  USE_MOCK ? mock.addReminder(role, reminder) : sendCamel('POST', '/dashboard/reminders/', reminder)

export const dismissReminder = (role, id) =>
  // BACKEND: DELETE /api/dashboard/reminders/<id>/
  USE_MOCK ? mock.dismissReminder(role, id) : sendCamel('DELETE', `/dashboard/reminders/${id}/`)

// ---------------------------------------------------------------- settings
export const fetchSettings = (role) => {
  // BACKEND: GET /api/dashboard/settings/
  //   -> { profile: { displayName, email, phone, location, bio, website },
  //        preferences: { emailPayments, emailCollabs, emailReminders, smsReminders } }
  return USE_MOCK ? mock.settings(role) : getCamel('/dashboard/settings/')
}

export const saveSettings = (role, changes) => {
  // BACKEND: PATCH /api/dashboard/settings/   body -> { profile?: { ...changed fields }, preferences?: { ... } }
  //   -> { applied: [field], pendingReview: [field] }
  //   Low risk fields (name, bio, location, website, preferences) apply straight away.
  //   High risk fields (email, phone) are NOT applied: create a review request for the admin dashboard
  //   (Security reviews), notify the old email, and answer with them listed in pendingReview.
  //   Profile image upload belongs here too, once it is built.
  return USE_MOCK ? mock.saveSettings(role, changes) : sendCamel('PATCH', '/dashboard/settings/', changes)
}

export const requestPasswordChange = ({ current, next }) => {
  // BACKEND: POST /api/dashboard/password-change/   body -> { current, next }
  //   Check `current` first (400 if wrong). Then follow your security policy: change it and email the
  //   owner a "was this you?" link, or hold it as a review request for an admin when it looks risky
  //   (new device or location). -> { pendingReview: bool }
  return USE_MOCK ? mock.requestPasswordChange() : sendCamel('POST', '/dashboard/password-change/', { current, next })
}
