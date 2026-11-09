// Creator only: brand collaborations and the scope of work editor.
import { getCamel, sendCamel, USE_MOCK } from './api'
import * as mock from '@/mocks/dashboardData'

export const fetchCreatorCollaborations = () => {
  // BACKEND: GET /api/creator/collaborations/
  //   -> { invites: [ { id, name, category, task, amount, message, slug } ],
  //        brands: [ { id, name, category, task, status: 'active'|'completed', amount, since, slug } ] }
  return USE_MOCK ? mock.creatorCollaborations() : getCamel('/creator/collaborations/')
}

export const answerInvite = (id, decision) =>
  // BACKEND: POST /api/creator/collaborations/invites/<id>/   body -> { decision: 'accept'|'decline' }
  USE_MOCK ? mock.respondToInvite(id, decision) : sendCamel('POST', `/creator/collaborations/invites/${id}/`, { decision })

export const fetchScopes = () => {
  // BACKEND: GET /api/creator/scopes/
  //   -> { scopes: [ { id, brand, title, summary, deliverables: [ { id, text } ], price, dueDate,
  //                    revisions, status: 'draft'|'sent'|'approved' } ],
  //        brands: [string] }   brands = the brands the creator can write a scope for
  return USE_MOCK ? mock.scopes() : getCamel('/creator/scopes/')
}

export const saveScope = (scope) =>
  // BACKEND: POST /api/creator/scopes/ to create, PATCH /api/creator/scopes/<id>/ to change (draft only)
  USE_MOCK
    ? mock.saveScope(scope)
    : scope.id
      ? sendCamel('PATCH', `/creator/scopes/${scope.id}/`, scope)
      : sendCamel('POST', '/creator/scopes/', scope)

export const deleteScope = (id) =>
  // BACKEND: DELETE /api/creator/scopes/<id>/   (drafts only)
  USE_MOCK ? mock.removeScope(id) : sendCamel('DELETE', `/creator/scopes/${id}/`)

export const submitScope = (id) =>
  // BACKEND: POST /api/creator/scopes/<id>/send/   locks it for editing and asks the brand to approve it
  USE_MOCK ? mock.sendScope(id) : sendCamel('POST', `/creator/scopes/${id}/send/`)
