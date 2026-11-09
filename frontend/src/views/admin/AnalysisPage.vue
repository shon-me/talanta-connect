<script setup>
import DashCard from '@/components/dashboard/DashCard.vue'
import LoadState from '@/components/dashboard/LoadState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import StatusChip from '@/components/dashboard/StatusChip.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { fetchSystemAnalysis } from '@/services/adminService' // BACKEND: system analysis (see service)

const { data, loading, error, reload } = useAsyncData(fetchSystemAnalysis, null)

const percent = (count, list) => Math.round((count / (list.reduce((sum, item) => sum + item.count, 0) || 1)) * 100)
</script>

<template>
  <PageHeader title="System analysis" lead="How the platform is growing and whether everything is running." />

  <LoadState :loading="loading" :error="error" @retry="reload">
    <template v-if="data">
      <div class="dash-grid dash-grid--stats">
        <StatCard v-for="(k, i) in data.kpis" :key="k.key" :label="k.label" :value="k.value" :hint="k.delta" :icon="k.icon" :tone="i" />
      </div>

      <DashCard title="Last 6 months">
        <div class="dash-grid dash-grid--three">
          <div>
            <p class="dash-legend"><span class="dash-legend__dot dash-legend__dot--a" /> New members</p>
            <v-sparkline class="dash-spark" :model-value="data.trend.signups" :labels="data.trend.labels" show-labels label-size="7" color="primary" line-width="3" smooth :padding="10" />
          </div>
          <div>
            <p class="dash-legend"><span class="dash-legend__dot dash-legend__dot--b" /> Tasks posted</p>
            <v-sparkline class="dash-spark" :model-value="data.trend.tasks" :labels="data.trend.labels" show-labels label-size="7" color="secondary" line-width="3" smooth :padding="10" />
          </div>
          <div>
            <p class="dash-legend"><span class="dash-legend__dot dash-legend__dot--c" /> Payment volume (KSh thousands)</p>
            <v-sparkline class="dash-spark" :model-value="data.trend.volume" :labels="data.trend.labels" show-labels label-size="7" color="accent3" line-width="3" smooth :padding="10" />
          </div>
        </div>
      </DashCard>

      <div class="dash-grid dash-grid--two">
        <DashCard title="Who is on the platform">
          <div class="dash-bar">
            <span class="dash-bar__label">Creators</span>
            <v-progress-linear :model-value="data.split.creators" height="10" rounded color="primary" bg-color="primary" bg-opacity="0.12" />
            <span class="dash-bar__count">{{ data.split.creators }}%</span>
          </div>
          <div class="dash-bar">
            <span class="dash-bar__label">Brands</span>
            <v-progress-linear :model-value="data.split.brands" height="10" rounded color="secondary" bg-color="secondary" bg-opacity="0.15" />
            <span class="dash-bar__count">{{ data.split.brands }}%</span>
          </div>
        </DashCard>

        <DashCard title="Tasks by status">
          <div v-for="row in data.taskStatus" :key="row.label" class="dash-bar">
            <span class="dash-bar__label">{{ row.label }}</span>
            <v-progress-linear :model-value="percent(row.count, data.taskStatus)" height="10" rounded color="accent3" bg-color="accent3" bg-opacity="0.15" />
            <span class="dash-bar__count">{{ row.count }}</span>
          </div>
        </DashCard>
      </div>

      <DashCard title="Service health">
        <div class="dash-table-wrap">
          <table class="dash-table">
            <thead><tr><th>Service</th><th>Response time</th><th>Status</th></tr></thead>
            <tbody>
              <tr v-for="s in data.health" :key="s.service">
                <td>{{ s.service }}</td><td>{{ s.latency }}</td><td><StatusChip :status="s.status" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </DashCard>
    </template>
  </LoadState>
</template>
