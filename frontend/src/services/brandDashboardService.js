// Brand only: the campaign (task) editor and the creators they work with.
import { getCamel, sendCamel, USE_MOCK } from './api'
import * as mock from '@/mocks/dashboardData'

export const fetchCampaigns = () => {
  // BACKEND: GET /api/brand/campaigns/
  //   -> [ { id, title, description, status: 'draft'|'open'|'in_progress'|'closed', payAmount, payMethod,
  //          deadline (YYYY-MM-DD), slots, skills: [string], applicants } ]
  //   These are the tasks shown on the brand's public page and in the feed. Task images are uploaded
  //   in this editor once image upload is built.
  return USE_MOCK ? mock.campaigns() : getCamel('/brand/campaigns/')
}

export const saveCampaign = (campaign) => {
  // BACKEND: POST /api/brand/campaigns/  to create, PATCH /api/brand/campaigns/<id>/  to change
  //   Validate on the server too: pay above 0, deadline in the future, a title and a description.
  //   Only `open` campaigns appear to creators.
  return USE_MOCK
    ? mock.saveCampaign(campaign)
    : campaign.id
      ? sendCamel('PATCH', `/brand/campaigns/${campaign.id}/`, campaign)
      : sendCamel('POST', '/brand/campaigns/', campaign)
}

export const deleteCampaign = (id) =>
  // BACKEND: DELETE /api/brand/campaigns/<id>/   (refuse if creators are already working on it: close it instead)
  USE_MOCK ? mock.removeCampaign(id) : sendCamel('DELETE', `/brand/campaigns/${id}/`)

export const changeCampaignStatus = (id, status) =>
  // BACKEND: POST /api/brand/campaigns/<id>/status/   body -> { status }
  USE_MOCK ? mock.setCampaignStatus(id, status) : sendCamel('POST', `/brand/campaigns/${id}/status/`, { status })

export const fetchBrandCollaborations = () => {
  // BACKEND: GET /api/brand/collaborations/
  //   -> { requests: [ { id, name, craft, task, message, appliedAt, slug } ],
  //        creators: [ { id, name, craft, task, status: 'active'|'completed', amount, since, slug } ] }
  return USE_MOCK ? mock.brandCollaborations() : getCamel('/brand/collaborations/')
}

export const answerRequest = (id, decision) =>
  // BACKEND: POST /api/brand/collaborations/requests/<id>/   body -> { decision: 'accept'|'decline' }
  //   Accepting starts the job (and the scope of work on the creator's side) and notifies the creator.
  USE_MOCK ? mock.respondToRequest(id, decision) : sendCamel('POST', `/brand/collaborations/requests/${id}/`, { decision })
