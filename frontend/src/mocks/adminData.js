// Placeholder data for the admin dashboard. Changes are kept until the page is refreshed.
// Delete once adminService talks to the real API.
import { brandPool, creatorPool } from './feedData'
import { heroSlides } from './homeData'

const DAY = 86400000
const ago = (days, hours = 0) => new Date(Date.now() - days * DAY - hours * 3600000).toISOString()
const clone = (value) => JSON.parse(JSON.stringify(value))
const wait = (value, ms = 350) => new Promise((resolve) => setTimeout(() => resolve(clone(value)), ms))
let uid = 5000
const nextId = () => ++uid

// ---------------------------------------------------------------- verification
const ID_DOCS = [{ name: 'National ID (front)', type: 'image' }, { name: 'National ID (back)', type: 'image' }]
let QUEUE = [
  { id: 'v1', kind: 'creator', name: 'Creator 21', email: 'creator21@example.com', submittedAt: ago(2), documents: [...ID_DOCS, { name: 'Portfolio link', type: 'link' }], notes: 'Photographer based in Nairobi.', status: 'pending', reason: '' },
  { id: 'v2', kind: 'brand', name: 'Brand 14', email: 'hello@brand14.example', submittedAt: ago(2, 5), documents: [{ name: 'Business registration', type: 'pdf' }, { name: 'KRA PIN certificate', type: 'pdf' }], notes: 'Food and drink company.', status: 'pending', reason: '' },
  { id: 'v3', kind: 'creator', name: 'Creator 22', email: 'creator22@example.com', submittedAt: ago(1), documents: [...ID_DOCS], notes: 'Video editor. No portfolio link given.', status: 'pending', reason: '' },
  { id: 'v4', kind: 'brand', name: 'Brand 15', email: 'team@brand15.example', submittedAt: ago(0, 6), documents: [{ name: 'Business registration', type: 'pdf' }], notes: 'Tech and gadgets.', status: 'pending', reason: '' },
  { id: 'v5', kind: 'creator', name: 'Creator 18', email: 'creator18@example.com', submittedAt: ago(6), documents: [...ID_DOCS], notes: '', status: 'approved', reason: '' },
  { id: 'v6', kind: 'brand', name: 'Brand 11', email: 'info@brand11.example', submittedAt: ago(8), documents: [{ name: 'Business registration', type: 'pdf' }], notes: '', status: 'rejected', reason: 'The registration number could not be matched.' },
]
export const verificationQueue = () => wait(QUEUE)

export function decideVerification(id, decision, reason = '') {
  QUEUE = QUEUE.map((v) => (v.id === id ? { ...v, status: decision === 'approve' ? 'approved' : 'rejected', reason } : v))
  return wait({ ok: true }, 300)
}

// ---------------------------------------------------------------- logs
const SOURCES = ['auth', 'payments', 'api', 'scheduler', 'verification', 'email']
const MESSAGES = {
  info: ['User signed in', 'Payment released to creator', 'Verification approved', 'Weekly digest sent', 'Campaign published'],
  warning: ['Slow response from payment provider', 'Repeated failed sign in', 'Email bounced', 'Upload rejected: file too large'],
  error: ['Payment callback failed', 'Database connection reset', 'Could not send SMS reminder'],
}
const LOGS = Array.from({ length: 90 }, (_, i) => {
  const level = i % 11 === 0 ? 'error' : i % 4 === 0 ? 'warning' : 'info'
  const pool = MESSAGES[level]
  return { id: `l${i}`, time: new Date(Date.now() - i * 17 * 60000).toISOString(), level, source: SOURCES[i % SOURCES.length], message: pool[i % pool.length] }
})

export function logs({ level = '', q = '', cursor = null }) {
  const word = q.trim().toLowerCase()
  const matching = LOGS.filter((l) => (!level || l.level === level) && (!word || `${l.source} ${l.message}`.toLowerCase().includes(word)))
  const start = cursor ? Number(cursor) : 0
  const items = matching.slice(start, start + 20)
  return wait({ items, nextCursor: start + 20 < matching.length ? String(start + 20) : null }, 250)
}

// ---------------------------------------------------------------- landing page content
let LANDING = {
  hero: heroSlides.map((s) => ({ id: s.id, title: s.title, subtitle: s.subtitle })),
  cta: { title: 'Your next collaboration starts with a profile', lead: 'Join Talanta Connect to share your work, meet brands that hire and grow alongside other creators.' },
  featuredBrandIds: [1, 2, 3, 4, 5, 6],
  featuredCreatorIds: [1, 2, 3, 4],
}
export const landingContent = () =>
  wait({
    ...LANDING,
    brands: brandPool.slice(0, 14).map((b) => ({ id: b.id, name: b.name })),
    creators: creatorPool.slice(0, 14).map((c) => ({ id: c.id, name: c.name })),
  })

export function saveLanding(content) {
  LANDING = { hero: content.hero, cta: content.cta, featuredBrandIds: content.featuredBrandIds, featuredCreatorIds: content.featuredCreatorIds }
  return wait({ ok: true }, 500)
}

// ---------------------------------------------------------------- system analysis
export const systemAnalysis = () =>
  wait({
    kpis: [
      { key: 'users', label: 'Members', value: '1,284', delta: '+6.2% this month', icon: 'mdi-account-multiple-outline' },
      { key: 'tasks', label: 'Open tasks', value: '212', delta: '+14 this week', icon: 'mdi-clipboard-text-outline' },
      { key: 'volume', label: 'Payment volume', value: 'KSh 3.4M', delta: '+9.8% this month', icon: 'mdi-cash-multiple' },
      { key: 'errors', label: 'Errors today', value: '7', delta: '3 fewer than yesterday', icon: 'mdi-alert-circle-outline' },
    ],
    trend: {
      labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
      signups: [60, 88, 120, 150, 210, 244],
      tasks: [30, 44, 61, 90, 128, 160],
      volume: [320, 540, 760, 1100, 1900, 3400],
    },
    split: { creators: 71, brands: 29 },
    taskStatus: [{ label: 'Open', count: 212 }, { label: 'In progress', count: 148 }, { label: 'Completed', count: 903 }],
    health: [
      { service: 'Website', status: 'ok', latency: '120 ms' },
      { service: 'API', status: 'ok', latency: '210 ms' },
      { service: 'Payments provider', status: 'degraded', latency: '1.9 s' },
      { service: 'Email', status: 'ok', latency: '340 ms' },
      { service: 'SMS', status: 'ok', latency: '410 ms' },
    ],
  })

// ---------------------------------------------------------------- security reviews
let SECURITY = [
  { id: 'x1', type: 'password_change', user: 'Creator 7', role: 'creator', requestedAt: ago(0, 5), risk: 'high', ip: '41.90.12.8', device: 'Unknown phone, new location', changes: [{ field: 'Password', from: 'Last changed 4 months ago', to: 'New password' }], status: 'pending' },
  { id: 'x2', type: 'payout_change', user: 'Creator 3', role: 'creator', requestedAt: ago(1), risk: 'high', ip: '102.68.4.77', device: 'Chrome on Windows', changes: [{ field: 'Withdrawal method', from: 'M-Pesa 0712 ••• 345', to: 'M-Pesa 0733 ••• 901' }], status: 'pending' },
  { id: 'x3', type: 'email_change', user: 'Brand 4', role: 'brand', requestedAt: ago(2), risk: 'medium', ip: '197.232.1.30', device: 'Safari on iPhone', changes: [{ field: 'Email', from: 'ops@brand4.example', to: 'finance@brand4.example' }], status: 'pending' },
  { id: 'x4', type: 'phone_change', user: 'Creator 12', role: 'creator', requestedAt: ago(4), risk: 'medium', ip: '41.89.5.5', device: 'Chrome on Android', changes: [{ field: 'Phone', from: '0701 ••• 220', to: '0702 ••• 118' }], status: 'approved' },
]
export const securityRequests = () => wait(SECURITY)

export function decideSecurity(id, decision) {
  SECURITY = SECURITY.map((r) => (r.id === id ? { ...r, status: decision === 'approve' ? 'approved' : 'denied' } : r))
  return wait({ ok: true }, 300)
}

export const announce = () => wait({ id: nextId() }, 500)
