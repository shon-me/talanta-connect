// Placeholder dashboard data for creators and brands, used while there is no backend.
// Changes you make (saving a campaign, adding a payment method, ...) are kept until the page is refreshed.
// Delete once the dashboard services talk to the real API.

const DAY = 86400000
const ago = (days, hours = 0) => new Date(Date.now() - days * DAY - hours * 3600000).toISOString()
const ahead = (days) => new Date(Date.now() + days * DAY).toISOString().slice(0, 10)
const clone = (value) => JSON.parse(JSON.stringify(value))
const wait = (value, ms = 350) => new Promise((resolve) => setTimeout(() => resolve(clone(value)), ms))
let uid = 1000
const nextId = () => ++uid

const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']

// ---------------------------------------------------------------- overview
const OVERVIEW = {
  creator: {
    profile: { name: 'Preview creator', location: 'Nairobi', bio: 'Photographer and video editor working with local brands.', verification: 'verified', memberSince: '2026', completeness: 75, missing: ['Add a portfolio piece', 'Add a withdrawal method'] },
    stats: [
      { key: 'earned', label: 'Earned this month', value: 'KSh 48,500', hint: '12% more than last month', icon: 'mdi-cash-multiple' },
      { key: 'jobs', label: 'Active jobs', value: '3', hint: '1 is due this week', icon: 'mdi-briefcase-outline' },
      { key: 'pending', label: 'Pending payments', value: 'KSh 21,000', hint: '2 payments', icon: 'mdi-clock-outline' },
      { key: 'views', label: 'Profile views', value: '214', hint: 'Last 30 days', icon: 'mdi-eye-outline' },
    ],
    activity: [
      { id: 1, type: 'payment', text: 'Brand 4 paid KSh 12,000 for "Campaign portraits".', time: ago(0, 3) },
      { id: 2, type: 'collaboration', text: 'Brand 9 invited you to "Unboxing video".', time: ago(1) },
      { id: 3, type: 'task', text: 'You applied for "Short videos for a menu launch".', time: ago(2) },
      { id: 4, type: 'system', text: 'Your profile was verified.', time: ago(6) },
    ],
  },
  brand: {
    profile: { name: 'Preview brand', location: 'Nairobi', bio: 'Lifestyle brand working with local creators.', verification: 'pending', memberSince: '2026', completeness: 60, missing: ['Add a company description', 'Add a payment method'] },
    stats: [
      { key: 'spent', label: 'Spent this month', value: 'KSh 96,000', hint: '4 payments released', icon: 'mdi-cash-multiple' },
      { key: 'campaigns', label: 'Open campaigns', value: '3', hint: '14 applicants', icon: 'mdi-bullhorn-outline' },
      { key: 'creators', label: 'Active creators', value: '5', hint: '2 requests waiting', icon: 'mdi-account-group-outline' },
      { key: 'pending', label: 'Pending payments', value: 'KSh 27,500', hint: '3 payments', icon: 'mdi-clock-outline' },
    ],
    activity: [
      { id: 1, type: 'collaboration', text: 'Creator 7 applied to "Recap video for last weekend".', time: ago(0, 2) },
      { id: 2, type: 'payment', text: 'You released KSh 9,500 to Creator 3.', time: ago(1) },
      { id: 3, type: 'task', text: '"Unboxing video" received 4 new applicants.', time: ago(2) },
      { id: 4, type: 'system', text: 'Your brand verification is being reviewed.', time: ago(5) },
    ],
  },
}

export const overview = (role) =>
  wait({ ...OVERVIEW[role], reminders: REMINDERS[role].slice(0, 3) })

// ---------------------------------------------------------------- analytics
const ANALYTICS = {
  creator: {
    totals: { tasks: 18, jobs: 11, money: 214500 },
    taskStatus: [{ label: 'Applied', count: 5 }, { label: 'Accepted', count: 8 }, { label: 'Declined', count: 5 }],
    jobStatus: [{ label: 'Active', count: 3 }, { label: 'Completed', count: 7 }, { label: 'Cancelled', count: 1 }],
    trend: { labels: MONTHS, tasks: [1, 2, 2, 4, 5, 4], jobs: [0, 1, 2, 2, 3, 3], money: [12000, 22000, 31000, 40500, 60500, 48500] },
    partners: [{ name: 'Brand 4', jobs: 4, amount: 62000 }, { name: 'Brand 9', jobs: 3, amount: 51500 }, { name: 'Brand 2', jobs: 2, amount: 24000 }],
  },
  brand: {
    totals: { tasks: 14, jobs: 22, money: 612000 },
    taskStatus: [{ label: 'Open', count: 3 }, { label: 'In progress', count: 5 }, { label: 'Closed', count: 6 }],
    jobStatus: [{ label: 'Active', count: 5 }, { label: 'Completed', count: 16 }, { label: 'Cancelled', count: 1 }],
    trend: { labels: MONTHS, tasks: [1, 2, 3, 2, 3, 3], jobs: [2, 3, 4, 5, 4, 4], money: [64000, 88000, 120000, 96000, 148000, 96000] },
    partners: [{ name: 'Creator 7', jobs: 5, amount: 91000 }, { name: 'Creator 3', jobs: 4, amount: 74500 }, { name: 'Creator 12', jobs: 3, amount: 52000 }],
  },
}
export const analytics = (role) => wait(ANALYTICS[role])

// ---------------------------------------------------------------- payments
const PAYMENTS = {
  creator: {
    summary: [
      { key: 'earned', label: 'Total earned', value: 'KSh 214,500', hint: 'Since you joined' },
      { key: 'pending', label: 'Pending', value: 'KSh 21,000', hint: '2 payments on their way' },
      { key: 'withdrawn', label: 'Withdrawn', value: 'KSh 160,000', hint: 'To your withdrawal methods' },
    ],
    transactions: [
      { id: 't1', date: ago(0, 3), reference: 'TC-20481', description: 'Campaign portraits', counterparty: 'Brand 4', amount: 12000, status: 'paid', method: 'M-Pesa' },
      { id: 't2', date: ago(3), reference: 'TC-20455', description: 'Withdrawal', counterparty: 'M-Pesa 0712 ••• 345', amount: -40000, status: 'paid', method: 'M-Pesa' },
      { id: 't3', date: ago(5), reference: 'TC-20431', description: 'Product photos for the new collection', counterparty: 'Brand 2', amount: 6000, status: 'paid', method: 'M-Pesa' },
      { id: 't4', date: ago(9), reference: 'TC-20390', description: 'Recap video', counterparty: 'Brand 9', amount: 8000, status: 'refunded', method: 'Bank' },
      { id: 't5', date: ago(12), reference: 'TC-20344', description: 'Illustrated care guide', counterparty: 'Brand 4', amount: 14500, status: 'paid', method: 'Bank' },
      { id: 't6', date: ago(15), reference: 'TC-20310', description: 'Withdrawal', counterparty: 'Bank •••• 4471', amount: -60000, status: 'failed', method: 'Bank' },
    ],
    pending: [
      { id: 'p1', description: 'Unboxing video', counterparty: 'Brand 9', amount: 12000, status: 'awaiting_approval', since: ago(2), dueDate: ahead(3) },
      { id: 'p2', description: 'Destination feature', counterparty: 'Brand 6', amount: 9000, status: 'in_escrow', since: ago(4), dueDate: ahead(6) },
    ],
    methods: [
      { id: 'm1', type: 'mpesa', label: 'M-Pesa', detail: '0712 ••• 345', isDefault: true, addedAt: ago(60) },
      { id: 'm2', type: 'bank', label: 'Equity Bank', detail: '•••• 4471', isDefault: false, addedAt: ago(40) },
    ],
  },
  brand: {
    summary: [
      { key: 'spent', label: 'Total spent', value: 'KSh 612,000', hint: 'Since you joined' },
      { key: 'pending', label: 'Pending', value: 'KSh 27,500', hint: '3 payments to release' },
      { key: 'escrow', label: 'Held in escrow', value: 'KSh 45,000', hint: 'Released when work is approved' },
    ],
    transactions: [
      { id: 't1', date: ago(1), reference: 'TC-20470', description: 'Product photos', counterparty: 'Creator 3', amount: -9500, status: 'paid', method: 'M-Pesa' },
      { id: 't2', date: ago(4), reference: 'TC-20449', description: 'Recap video', counterparty: 'Creator 7', amount: -18000, status: 'paid', method: 'Card' },
      { id: 't3', date: ago(8), reference: 'TC-20401', description: 'Illustrated care guide', counterparty: 'Creator 12', amount: -14500, status: 'paid', method: 'M-Pesa' },
      { id: 't4', date: ago(11), reference: 'TC-20360', description: 'Campaign portraits', counterparty: 'Creator 5', amount: -12000, status: 'refunded', method: 'Card' },
      { id: 't5', date: ago(16), reference: 'TC-20322', description: 'Training session clips', counterparty: 'Creator 2', amount: -22000, status: 'failed', method: 'Card' },
    ],
    pending: [
      { id: 'p1', description: 'Unboxing video', counterparty: 'Creator 7', amount: 12000, status: 'awaiting_approval', since: ago(1), dueDate: ahead(2) },
      { id: 'p2', description: 'Destination feature', counterparty: 'Creator 3', amount: 9500, status: 'awaiting_approval', since: ago(3), dueDate: ahead(4) },
      { id: 'p3', description: 'Menu launch videos', counterparty: 'Creator 12', amount: 6000, status: 'processing', since: ago(1), dueDate: ahead(1) },
    ],
    methods: [
      { id: 'm1', type: 'mpesa', label: 'M-Pesa', detail: '0722 ••• 118', isDefault: true, addedAt: ago(70) },
      { id: 'm2', type: 'card', label: 'Visa', detail: '•••• 4242', isDefault: false, addedAt: ago(30) },
    ],
  },
}
export const payments = (role) => wait(PAYMENTS[role])

const maskPhone = (phone) => `${phone.replace(/\s/g, '').slice(0, 4)} ••• ${phone.slice(-3)}`

export function addMethod(role, input) {
  const list = PAYMENTS[role].methods
  const method = { id: `m${nextId()}`, type: input.type, isDefault: list.length === 0, addedAt: new Date().toISOString() }
  if (input.type === 'mpesa') Object.assign(method, { label: 'M-Pesa', detail: maskPhone(input.phone) })
  else if (input.type === 'bank') Object.assign(method, { label: input.bankName, detail: `•••• ${input.accountNumber.slice(-4)}` })
  else Object.assign(method, { label: 'Visa', detail: '•••• 4242' })
  list.push(method)
  return wait(method)
}

export function removeMethod(role, id) {
  const list = PAYMENTS[role].methods
  const index = list.findIndex((m) => m.id === id)
  if (index < 0) return Promise.reject(new Error('That method no longer exists.'))
  const [removed] = list.splice(index, 1)
  if (removed.isDefault && list[0]) list[0].isDefault = true
  return wait({ ok: true })
}

export function setDefaultMethod(role, id) {
  PAYMENTS[role].methods.forEach((m) => { m.isDefault = m.id === id })
  return wait({ ok: true })
}

export function releasePayment(role, id) {
  const list = PAYMENTS[role].pending
  const index = list.findIndex((p) => p.id === id)
  if (index < 0) return Promise.reject(new Error('That payment is no longer pending.'))
  const [done] = list.splice(index, 1)
  PAYMENTS[role].transactions.unshift({ id: `t${nextId()}`, date: new Date().toISOString(), reference: `TC-${20500 + uid}`, description: done.description, counterparty: done.counterparty, amount: -done.amount, status: 'paid', method: 'M-Pesa' })
  return wait({ ok: true })
}

// ---------------------------------------------------------------- notifications and reminders
const NOTIFICATIONS = {
  creator: [
    { id: 'n1', type: 'payment', title: 'Payment received', body: 'Brand 4 paid KSh 12,000 for "Campaign portraits".', time: ago(0, 3), read: false },
    { id: 'n2', type: 'collaboration', title: 'New invite', body: 'Brand 9 invited you to "Unboxing video".', time: ago(1), read: false },
    { id: 'n3', type: 'reminder', title: 'Deadline soon', body: '"Destination feature" is due in 3 days.', time: ago(1, 4), read: false },
    { id: 'n4', type: 'system', title: 'Profile verified', body: 'Your profile now shows the verified badge.', time: ago(6), read: true },
  ],
  brand: [
    { id: 'n1', type: 'collaboration', title: 'New application', body: 'Creator 7 applied to "Recap video for last weekend".', time: ago(0, 2), read: false },
    { id: 'n2', type: 'payment', title: 'Payment released', body: 'KSh 9,500 was sent to Creator 3.', time: ago(1), read: false },
    { id: 'n3', type: 'reminder', title: 'Approve work', body: '"Unboxing video" is waiting for your approval.', time: ago(2), read: true },
    { id: 'n4', type: 'system', title: 'Verification in review', body: 'We are checking the documents you sent.', time: ago(5), read: true },
  ],
  admin: [
    { id: 'n1', type: 'system', title: '3 verifications waiting', body: 'The oldest request is 2 days old.', time: ago(0, 1), read: false },
    { id: 'n2', type: 'system', title: 'High risk request', body: 'A password change was asked for from a new device.', time: ago(0, 5), read: false },
    { id: 'n3', type: 'system', title: 'Error rate up', body: 'Payment callbacks failed 4 times in the last hour.', time: ago(1), read: true },
  ],
}

const REMINDERS = {
  creator: [
    { id: 'r1', title: 'Send final files for "Destination feature"', due: ahead(3) },
    { id: 'r2', title: 'Update your scope of work for Brand 9', due: ahead(5) },
    { id: 'r3', title: 'Add a withdrawal method', due: ahead(7) },
  ],
  brand: [
    { id: 'r1', title: 'Approve "Unboxing video"', due: ahead(2) },
    { id: 'r2', title: 'Close "Training session clips" applications', due: ahead(4) },
    { id: 'r3', title: 'Add a payment method', due: ahead(7) },
  ],
  admin: [{ id: 'r1', title: 'Review the weekly system report', due: ahead(2) }],
}

export const notifications = (role) => wait({ notifications: NOTIFICATIONS[role], reminders: REMINDERS[role] })

export function markNotificationRead(role, id) {
  const item = NOTIFICATIONS[role].find((n) => n.id === id)
  if (item) item.read = true
  return wait({ ok: true }, 120)
}

export function markAllNotificationsRead(role) {
  NOTIFICATIONS[role].forEach((n) => { n.read = true })
  return wait({ ok: true }, 120)
}

export function addReminder(role, input) {
  const reminder = { id: `r${nextId()}`, title: input.title, due: input.due }
  REMINDERS[role].push(reminder)
  return wait(reminder, 150)
}

export function dismissReminder(role, id) {
  REMINDERS[role] = REMINDERS[role].filter((r) => r.id !== id)
  return wait({ ok: true }, 120)
}

// ---------------------------------------------------------------- settings
const SETTINGS = {
  creator: { profile: { displayName: 'Preview creator', email: 'creator@example.com', phone: '0712345678', location: 'Nairobi', bio: 'Photographer and video editor working with local brands.', website: '' }, preferences: { emailPayments: true, emailCollabs: true, emailReminders: true, smsReminders: false } },
  brand: { profile: { displayName: 'Preview brand', email: 'brand@example.com', phone: '0722345118', location: 'Nairobi', bio: 'Lifestyle brand working with local creators.', website: 'https://example.com' }, preferences: { emailPayments: true, emailCollabs: true, emailReminders: true, smsReminders: false } },
  admin: { profile: { displayName: 'Preview admin', email: 'admin@example.com', phone: '', location: '', bio: '', website: '' }, preferences: { emailPayments: false, emailCollabs: false, emailReminders: true, smsReminders: false } },
}

// Changes to these need an admin to approve them first
export const HIGH_RISK_FIELDS = ['email', 'phone']

export const settings = (role) => wait(SETTINGS[role])

export function saveSettings(role, changes) {
  const applied = []
  const pendingReview = []
  Object.entries(changes.profile ?? {}).forEach(([field, value]) => {
    if (HIGH_RISK_FIELDS.includes(field)) pendingReview.push(field)
    else { SETTINGS[role].profile[field] = value; applied.push(field) }
  })
  Object.assign(SETTINGS[role].preferences, changes.preferences ?? {})
  if (changes.preferences) applied.push('preferences')
  return wait({ applied, pendingReview })
}

export function requestPasswordChange() {
  return wait({ pendingReview: true }, 600)
}

// ---------------------------------------------------------------- brand: campaigns and creators
let CAMPAIGNS = [
  { id: 'c1', title: 'Recap video for last weekend', description: 'Cut a 60-second highlight reel from our footage, with music and titles.', status: 'open', payAmount: 18000, payMethod: 'M-Pesa', deadline: ahead(6), slots: 1, skills: ['Editing', 'Motion titles'], applicants: 6 },
  { id: 'c2', title: 'Unboxing video', description: 'Film and edit a 90-second unboxing and first-look video.', status: 'in_progress', payAmount: 12000, payMethod: 'M-Pesa', deadline: ahead(2), slots: 1, skills: ['Video', 'Product'], applicants: 4 },
  { id: 'c3', title: 'Campaign portraits', description: 'Half-day shoot for six portraits for our site and packaging.', status: 'open', payAmount: 12000, payMethod: 'Bank transfer', deadline: ahead(12), slots: 2, skills: ['Portraits', 'Retouching'], applicants: 4 },
  { id: 'c4', title: 'Spring collection photos', description: 'Twelve lifestyle photos of the range, edited and delivered in 5 days.', status: 'draft', payAmount: 6000, payMethod: 'M-Pesa', deadline: ahead(20), slots: 1, skills: ['Photography'], applicants: 0 },
]

export const campaigns = () => wait(CAMPAIGNS)

export function saveCampaign(input) {
  if (input.id) {
    CAMPAIGNS = CAMPAIGNS.map((c) => (c.id === input.id ? { ...c, ...input } : c))
    return wait(CAMPAIGNS.find((c) => c.id === input.id))
  }
  const created = { ...input, id: `c${nextId()}`, applicants: 0 }
  CAMPAIGNS = [created, ...CAMPAIGNS]
  return wait(created)
}

export function removeCampaign(id) {
  CAMPAIGNS = CAMPAIGNS.filter((c) => c.id !== id)
  return wait({ ok: true }, 200)
}

export function setCampaignStatus(id, status) {
  CAMPAIGNS = CAMPAIGNS.map((c) => (c.id === id ? { ...c, status } : c))
  return wait({ ok: true }, 200)
}

let BRAND_COLLABS = {
  requests: [
    { id: 'q1', name: 'Creator 7', craft: 'Video editor', task: 'Recap video for last weekend', message: 'I have edited three event recaps for local brands and can deliver in 4 days.', appliedAt: ago(0, 2), slug: 'creator-7' },
    { id: 'q2', name: 'Creator 12', craft: 'Photographer', task: 'Campaign portraits', message: 'Studio portraits are my speciality. Happy to share samples.', appliedAt: ago(1), slug: 'creator-12' },
  ],
  creators: [
    { id: 'k1', name: 'Creator 3', craft: 'Illustrator', task: 'Destination feature', status: 'active', amount: 9500, since: ago(14), slug: 'creator-3' },
    { id: 'k2', name: 'Creator 5', craft: 'Photographer', task: 'Product photos', status: 'completed', amount: 12000, since: ago(30), slug: 'creator-5' },
    { id: 'k3', name: 'Creator 2', craft: 'Video editor', task: 'Training session clips', status: 'completed', amount: 22000, since: ago(45), slug: 'creator-2' },
  ],
}
export const brandCollaborations = () => wait(BRAND_COLLABS)

export function respondToRequest(id, decision) {
  const request = BRAND_COLLABS.requests.find((r) => r.id === id)
  BRAND_COLLABS.requests = BRAND_COLLABS.requests.filter((r) => r.id !== id)
  if (request && decision === 'accept') {
    BRAND_COLLABS.creators.unshift({ id: `k${nextId()}`, name: request.name, craft: request.craft, task: request.task, status: 'active', amount: 0, since: new Date().toISOString(), slug: request.slug })
  }
  return wait({ ok: true }, 250)
}

// ---------------------------------------------------------------- creator: brands and scope of work
let CREATOR_COLLABS = {
  invites: [
    { id: 'i1', name: 'Brand 9', category: 'Tech and gadgets', task: 'Unboxing video', amount: 12000, message: 'We liked your product work. Can you take this on next week?', slug: 'brand-9' },
  ],
  brands: [
    { id: 'b1', name: 'Brand 6', category: 'Travel and tourism', task: 'Destination feature', status: 'active', amount: 9000, since: ago(10), slug: 'brand-6' },
    { id: 'b2', name: 'Brand 4', category: 'Home and living', task: 'Campaign portraits', status: 'active', amount: 12000, since: ago(18), slug: 'brand-4' },
    { id: 'b3', name: 'Brand 2', category: 'Food and drink', task: 'Product photos', status: 'completed', amount: 6000, since: ago(40), slug: 'brand-2' },
  ],
}
export const creatorCollaborations = () => wait(CREATOR_COLLABS)

export function respondToInvite(id, decision) {
  const invite = CREATOR_COLLABS.invites.find((i) => i.id === id)
  CREATOR_COLLABS.invites = CREATOR_COLLABS.invites.filter((i) => i.id !== id)
  if (invite && decision === 'accept') {
    CREATOR_COLLABS.brands.unshift({ id: `b${nextId()}`, name: invite.name, category: invite.category, task: invite.task, status: 'active', amount: invite.amount, since: new Date().toISOString(), slug: invite.slug })
  }
  return wait({ ok: true }, 250)
}

let SCOPES = [
  { id: 's1', brand: 'Brand 6', title: 'Destination feature', summary: 'Written feature and photo set for the coast itinerary page.', deliverables: [{ id: 'd1', text: '600 word feature' }, { id: 'd2', text: '10 edited photos' }], price: 9000, dueDate: ahead(6), revisions: 2, status: 'approved' },
  { id: 's2', brand: 'Brand 4', title: 'Campaign portraits', summary: 'Half-day studio shoot with six final portraits.', deliverables: [{ id: 'd3', text: '6 retouched portraits' }], price: 12000, dueDate: ahead(10), revisions: 1, status: 'sent' },
  { id: 's3', brand: 'Brand 9', title: 'Unboxing video', summary: '', deliverables: [{ id: 'd4', text: '90 second video' }], price: 12000, dueDate: ahead(14), revisions: 2, status: 'draft' },
]

export const scopes = () => wait({ scopes: SCOPES, brands: CREATOR_COLLABS.brands.map((b) => b.name).concat(CREATOR_COLLABS.invites.map((i) => i.name)) })

export function saveScope(input) {
  const scope = { ...input, id: input.id ?? `s${nextId()}`, status: input.status ?? 'draft' }
  SCOPES = input.id ? SCOPES.map((s) => (s.id === input.id ? scope : s)) : [scope, ...SCOPES]
  return wait(scope)
}

export function removeScope(id) {
  SCOPES = SCOPES.filter((s) => s.id !== id)
  return wait({ ok: true }, 200)
}

export function sendScope(id) {
  SCOPES = SCOPES.map((s) => (s.id === id ? { ...s, status: 'sent' } : s))
  return wait({ ok: true }, 300)
}
