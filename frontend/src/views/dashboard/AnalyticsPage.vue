<script setup>
import { computed } from 'vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import LoadState from '@/components/dashboard/LoadState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { fetchAnalytics } from '@/services/dashboardService' // BACKEND: analytics (see service)
import { useAuthStore } from '@/stores/auth'
import { formatMoney } from '@/utils/format'

const auth = useAuthStore()
const isBrand = computed(() => auth.role === 'brand')
const { data, loading, error, reload } = useAsyncData(() => fetchAnalytics(auth.role), null)

// Same numbers, wording for each role
const words = computed(() =>
  isBrand.value
    ? { tasks: 'Tasks posted', tasksHint: 'Tasks you have published', jobs: 'Jobs given', jobsHint: 'Jobs awarded to creators', money: 'Total spent', partners: 'Creators you work with most', partner: 'Creator' }
    : { tasks: 'Tasks taken on', tasksHint: 'Tasks you applied for or were given', jobs: 'Jobs', jobsHint: 'Confirmed jobs with brands', money: 'Total earned', partners: 'Brands you work with most', partner: 'Brand' },
)

const percent = (count, list) => Math.round((count / (list.reduce((sum, item) => sum + item.count, 0) || 1)) * 100)
</script>

<template>
  <PageHeader title="Analytics" lead="The number of tasks and jobs you have, and how they change over time." />

  <LoadState :loading="loading" :error="error" @retry="reload">
    <template v-if="data">
      <div class="dash-grid dash-grid--stats">
        <StatCard :label="words.tasks" :value="data.totals.tasks" :hint="words.tasksHint" icon="mdi-clipboard-text-outline" :tone="0" />
        <StatCard :label="words.jobs" :value="data.totals.jobs" :hint="words.jobsHint" icon="mdi-briefcase-outline" :tone="1" />
        <StatCard :label="words.money" :value="formatMoney(data.totals.money)" hint="Since you joined" icon="mdi-cash-multiple" :tone="2" />
      </div>

      <DashCard title="Last 6 months">
        <div class="dash-grid dash-grid--two">
          <div>
            <p class="dash-legend"><span class="dash-legend__dot dash-legend__dot--a" /> {{ words.tasks }}</p>
            <v-sparkline class="dash-spark" :model-value="data.trend.tasks" :labels="data.trend.labels" show-labels label-size="7" color="primary" line-width="3" smooth :padding="10" />
          </div>
          <div>
            <p class="dash-legend"><span class="dash-legend__dot dash-legend__dot--b" /> {{ words.jobs }}</p>
            <v-sparkline class="dash-spark" :model-value="data.trend.jobs" :labels="data.trend.labels" show-labels label-size="7" color="secondary" line-width="3" smooth :padding="10" />
          </div>
        </div>
      </DashCard>

      <div class="dash-grid dash-grid--two">
        <DashCard :title="`${words.tasks} by status`">
          <div v-for="row in data.taskStatus" :key="row.label" class="dash-bar">
            <span class="dash-bar__label">{{ row.label }}</span>
            <v-progress-linear :model-value="percent(row.count, data.taskStatus)" height="10" rounded color="primary" bg-color="primary" bg-opacity="0.12" />
            <span class="dash-bar__count">{{ row.count }}</span>
          </div>
        </DashCard>

        <DashCard :title="`${words.jobs} by status`">
          <div v-for="row in data.jobStatus" :key="row.label" class="dash-bar">
            <span class="dash-bar__label">{{ row.label }}</span>
            <v-progress-linear :model-value="percent(row.count, data.jobStatus)" height="10" rounded color="secondary" bg-color="secondary" bg-opacity="0.15" />
            <span class="dash-bar__count">{{ row.count }}</span>
          </div>
        </DashCard>
      </div>

      <DashCard :title="words.partners">
        <div class="dash-table-wrap">
          <table class="dash-table">
            <thead>
              <tr><th>{{ words.partner }}</th><th>Jobs</th><th class="dash-table__num">Amount</th></tr>
            </thead>
            <tbody>
              <tr v-for="partner in data.partners" :key="partner.name">
                <td>{{ partner.name }}</td>
                <td>{{ partner.jobs }}</td>
                <td class="dash-table__num">{{ formatMoney(partner.amount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DashCard>
    </template>
  </LoadState>
</template>
