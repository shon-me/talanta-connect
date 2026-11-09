<script setup>
import { ref } from 'vue'
import ConfirmDialog from '@/components/dashboard/ConfirmDialog.vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import EmptyState from '@/components/dashboard/EmptyState.vue'
import LoadState from '@/components/dashboard/LoadState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import StatusChip from '@/components/dashboard/StatusChip.vue'
import { useAction } from '@/composables/useAction'
import { useAsyncData } from '@/composables/useAsyncData'
import { deleteScope, fetchScopes } from '@/services/creatorDashboardService' // BACKEND: scopes (see service)
import { formatDate, formatMoney } from '@/utils/format'
import ScopeEditor from './ScopeEditor.vue'

const { data, loading, error, reload } = useAsyncData(fetchScopes, null)
const { busy, run } = useAction()

const editing = ref(null)
const editorOpen = ref(false)
const deleting = ref(null)
const confirmOpen = ref(false)

function openEditor(scope = null) {
  editing.value = scope
  editorOpen.value = true
}

function saved(scope) {
  const index = data.value.scopes.findIndex((s) => s.id === scope.id)
  if (index >= 0) data.value.scopes[index] = scope
  else data.value.scopes.unshift(scope)
}

function askDelete(scope) {
  deleting.value = scope
  confirmOpen.value = true
}

async function remove() {
  const scope = deleting.value
  const { ok } = await run(() => deleteScope(scope.id), 'Scope deleted.')
  if (ok) {
    data.value.scopes = data.value.scopes.filter((s) => s.id !== scope.id)
    confirmOpen.value = false
  }
}
</script>

<template>
  <PageHeader title="Scope of work" lead="Agree what you will deliver, for how much and by when, before you start.">
    <v-btn color="secondary" rounded="lg" size="large" prepend-icon="mdi-plus" :disabled="!data" @click="openEditor()">New scope</v-btn>
  </PageHeader>

  <LoadState :loading="loading" :error="error" @retry="reload">
    <template v-if="data">
      <div v-if="data.scopes.length" class="dash-grid dash-grid--cards">
        <DashCard v-for="s in data.scopes" :key="s.id">
          <div class="dash-item">
            <div class="dash-item__head">
              <div>
                <h3 class="dash-item__title">{{ s.title }}</h3>
                <p class="dash-item__sub">for {{ s.brand }}</p>
              </div>
              <StatusChip :status="s.status" />
            </div>
            <p v-if="s.summary" class="dash-item__text">{{ s.summary }}</p>

            <ul class="dash-checklist dash-checklist--plain">
              <li v-for="d in s.deliverables" :key="d.id"><v-icon icon="mdi-check" size="16" /> {{ d.text }}</li>
            </ul>

            <dl class="dash-facts">
              <div><dt>Price</dt><dd>{{ formatMoney(s.price) }}</dd></div>
              <div><dt>Due</dt><dd>{{ formatDate(s.dueDate) }}</dd></div>
              <div><dt>Rounds of changes</dt><dd>{{ s.revisions }}</dd></div>
            </dl>

            <div class="dash-item__actions">
              <v-btn v-if="s.status === 'draft'" variant="outlined" color="primary" rounded="lg" size="small" prepend-icon="mdi-pencil-outline" @click="openEditor(s)">Edit</v-btn>
              <p v-else class="dash-note">Locked once it is sent to the brand.</p>
              <v-btn v-if="s.status === 'draft'" icon="mdi-delete-outline" variant="text" size="small" :aria-label="`Delete ${s.title}`" @click="askDelete(s)" />
            </div>
          </div>
        </DashCard>
      </div>
      <EmptyState v-else icon="mdi-file-document-edit-outline" title="No scopes yet" text="Write one before you start a job, so you and the brand agree on the work.">
        <v-btn color="secondary" rounded="lg" @click="openEditor()">New scope</v-btn>
      </EmptyState>

      <ScopeEditor v-model="editorOpen" :scope="editing" :brands="data.brands" @saved="saved" />
    </template>
  </LoadState>

  <ConfirmDialog
    v-model="confirmOpen"
    title="Delete this scope?"
    :text="deleting ? `“${deleting.title}” will be removed.` : ''"
    confirm-label="Delete"
    danger
    :busy="busy"
    @confirm="remove"
  />
</template>
