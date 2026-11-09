// Admin dashboard. Every endpoint here must be limited to admin accounts ON THE SERVER:
//   - require an admin session with two-step verification, answer 404 (not 403) to everyone else
//   - allow only office or VPN IP addresses for /api/admin/*, rate limit it, and keep sessions short
//   - write an audit log entry for every read of personal data and every decision (who, what, when, IP)
import { getCamel, sendCamel, USE_MOCK } from './api'
import * as mock from '@/mocks/adminData'

export const fetchVerificationQueue = () =>
  // BACKEND: GET /api/admin/verifications/
  //   -> [ { id, kind: 'creator'|'brand', name, email, submittedAt, documents: [ { name, type } ],
  //          notes, status: 'pending'|'approved'|'rejected', reason } ]
  //   Documents are opened through short-lived signed links, never public URLs.
  USE_MOCK ? mock.verificationQueue() : getCamel('/admin/verifications/')

export const decideVerification = (id, decision, reason = '') =>
  // BACKEND: POST /api/admin/verifications/<id>/   body -> { decision: 'approve'|'reject', reason }
  //   A reason is required to reject. Notify the user by email and in their dashboard.
  USE_MOCK ? mock.decideVerification(id, decision, reason) : sendCamel('POST', `/admin/verifications/${id}/`, { decision, reason })

export const fetchLogs = ({ level = '', q = '', cursor = null }) => {
  // BACKEND: GET /api/admin/logs/?level=&q=&cursor=
  //   -> { items: [ { id, time, level: 'info'|'warning'|'error', source, message } ], nextCursor }
  //   Never put passwords, tokens or full card / account numbers into log messages.
  if (USE_MOCK) return mock.logs({ level, q, cursor })
  const params = new URLSearchParams({ level, q, ...(cursor ? { cursor } : {}) })
  return getCamel(`/admin/logs/?${params}`)
}

export const fetchLandingContent = () =>
  // BACKEND: GET /api/admin/landing/
  //   -> { hero: [ { id, title, subtitle } ], cta: { title, lead }, featuredBrandIds: [id], featuredCreatorIds: [id],
  //        brands: [ { id, name } ], creators: [ { id, name } ] }   brands/creators = the choices for "featured"
  //   The public landing page must read the same content from GET /api/home/... (heroService, brandService, creatorService).
  USE_MOCK ? mock.landingContent() : getCamel('/admin/landing/')

export const saveLandingContent = (content) =>
  // BACKEND: PUT /api/admin/landing/   body -> { hero, cta, featuredBrandIds, featuredCreatorIds }
  //   Clean the text on the server. Keep the previous version so a change can be undone.
  USE_MOCK ? mock.saveLanding(content) : sendCamel('PUT', '/admin/landing/', content)

export const fetchSystemAnalysis = () =>
  // BACKEND: GET /api/admin/analysis/
  //   -> { kpis: [ { key, label, value, delta, icon } ],
  //        trend: { labels, signups, tasks, volume }, split: { creators, brands },
  //        taskStatus: [ { label, count } ],
  //        health: [ { service, status: 'ok'|'degraded'|'down', latency } ] }
  USE_MOCK ? mock.systemAnalysis() : getCamel('/admin/analysis/')

export const fetchSecurityRequests = () =>
  // BACKEND: GET /api/admin/security-requests/
  //   -> [ { id, type: 'password_change'|'email_change'|'phone_change'|'payout_change', user, role, requestedAt,
  //          risk: 'high'|'medium', ip, device, changes: [ { field, from, to } ], status: 'pending'|'approved'|'denied' } ]
  //   `from` and `to` must be masked (never a real password, never a full account number).
  USE_MOCK ? mock.securityRequests() : getCamel('/admin/security-requests/')

export const decideSecurityRequest = (id, decision) =>
  // BACKEND: POST /api/admin/security-requests/<id>/   body -> { decision: 'approve'|'deny' }
  //   Approving applies the change and emails the account owner at the OLD address. Denying tells the owner.
  USE_MOCK ? mock.decideSecurity(id, decision) : sendCamel('POST', `/admin/security-requests/${id}/`, { decision })

export const sendAnnouncement = (announcement) =>
  // BACKEND: POST /api/admin/announcements/   body -> { audience: 'all'|'creators'|'brands', title, message }
  //   Creates a notification for every member of that audience (queue it, do not do it in the request).
  USE_MOCK ? mock.announce(announcement) : sendCamel('POST', '/admin/announcements/', announcement)
