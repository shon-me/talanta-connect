<script setup>
import { computed, ref } from 'vue'
import ConfirmDialog from '@/components/dashboard/ConfirmDialog.vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import EmptyState from '@/components/dashboard/EmptyState.vue'
import LoadState from '@/components/dashboard/LoadState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import StatusChip from '@/components/dashboard/StatusChip.vue'
import { useAction } from '@/composables/useAction'
import { useAsyncData } from '@/composables/useAsyncData'
import { changeCampaignStatus, deleteCampaign, fetchCampaigns } from '@/services/brandDashboardService' // BACKEND: campaigns (see service)
import { formatDate, formatMoney } from '@/utils/format'
import CampaignEditor from './CampaignEditor.vue'

const { data: campaigns, loading, error, reload } = useAsyncData(fetchCampaigns, [])
const { busy, run } = useAction()

const filter = ref('all')
const shown = computed(() => (filter.value === 'all' ? campaigns.value : campaigns.value.filter((c) => c.status === filter.value)))

const editing = ref(null)
const editorOpen = ref(false)
const deleting = ref(null)
const confirmOpen = ref(false)

function openEditor(campaign = null) {
  editing.value = campaign
  editorOpen.value = true
}

function saved(campaign) {
  const index = campaigns.value.findIndex((c) => c.id === campaign.id)
  if (index >= 0) campaigns.value[index] = campaign
  else campaigns.value.unshift(campaign)
}

async function setStatus(campaign, status, message) {
  const { ok } = await run(() => changeCampaignStatus(campaign.id, status), message)
  if (ok) campaign.status = status
}

function askDelete(campaign) {
  deleting.value = campaign
  confirmOpen.value = true
}

async function remove() {
  const campaign = deleting.value
  const { ok } = await run(() => deleteCampaign(campaign.id), 'Campaign deleted.')
  if (ok) {
    campaigns.value = campaigns.value.filter((c) => c.id !== campaign.id)
    confirmOpen.value = false
  }
}
</script>

<template>
  <PageHeader title="Campaigns" lead="Create the tasks creators can apply for, and manage the ones you have posted.">
    <v-btn color="secondary" rounded="lg" size="large" prepend-icon="mdi-plus" @click="openEditor()">New campaign</v-btn>
  </PageHeader>

  <LoadState :loading="loading" :error="error" @retry="reload">
    <v-btn-toggle v-model="filter" class="dash-filter" mandatory divided variant="outlined" color="primary" density="comfortable" rounded="lg">
      <v-btn value="all">All</v-btn>
      <v-btn value="open">Open</v-btn>
      <v-btn value="in_progress">In progress</v-btn>
      <v-btn value="draft">Drafts</v-btn>
      <v-btn value="closed">Closed</v-btn>
    </v-btn-toggle>

    <div v-if="shown.length" class="dash-grid dash-grid--cards">
      <DashCard v-for="c in shown" :key="c.id">
        <div class="dash-item">
          <div class="dash-item__head">
            <h3 class="dash-item__title">{{ c.title }}</h3>
            <StatusChip :status="c.status" />
          </div>
          <p class="dash-item__text">{{ c.description }}</p>

          <dl class="dash-facts">
            <div><dt>Pays</dt><dd>{{ formatMoney(c.payAmount) }} per task</dd></div>
            <div><dt>Deadline</dt><dd>{{ formatDate(c.deadline) }}</dd></div>
            <div><dt>Creators needed</dt><dd>{{ c.slots }}</dd></div>
            <div><dt>Applicants</dt><dd>{{ c.applicants }}</dd></div>
          </dl>

          <div v-if="c.skills.length" class="dash-chips">
            <v-chip v-for="skill in c.skills" :key="skill" size="small" variant="tonal" color="primary">{{ skill }}</v-chip>
          </div>

          <div class="dash-item__actions">
            <v-btn variant="outlined" color="primary" rounded="lg" size="small" prepend-icon="mdi-pencil-outline" @click="openEditor(c)">Edit</v-btn>
            <v-btn v-if="c.status === 'draft'" color="secondary" rounded="lg" size="small" :loading="busy" @click="setStatus(c, 'open', 'Campaign published.')">Publish</v-btn>
            <v-btn v-else-if="c.status === 'open'" variant="outlined" rounded="lg" size="small" :loading="busy" @click="setStatus(c, 'closed', 'Campaign closed.')">Close</v-btn>
            <v-btn v-else-if="c.status === 'closed'" variant="outlined" rounded="lg" size="small" :loading="busy" @click="setStatus(c, 'open', 'Campaign reopened.')">Reopen</v-btn>
            <v-btn icon="mdi-delete-outline" variant="text" size="small" :aria-label="`Delete ${c.title}`" @click="askDelete(c)" />
          </div>
        </div>
      </DashCard>
    </div>
    <EmptyState v-else icon="mdi-bullhorn-outline" title="No campaigns here" text="Create a campaign to start receiving applications.">
      <v-btn color="secondary" rounded="lg" @click="openEditor()">New campaign</v-btn>
    </EmptyState>
  </LoadState>

  <CampaignEditor v-model="editorOpen" :campaign="editing" @saved="saved" />

  <ConfirmDialog
    v-model="confirmOpen"
    title="Delete this campaign?"
    :text="deleting ? `“${deleting.title}” will be removed. If creators are already working on it, close it instead.` : ''"
    confirm-label="Delete"
    danger
    :busy="busy"
    @confirm="remove"
  />
</template>
