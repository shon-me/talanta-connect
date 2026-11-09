<script setup>
import { computed } from 'vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import EmptyState from '@/components/dashboard/EmptyState.vue'
import LoadState from '@/components/dashboard/LoadState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import StatusChip from '@/components/dashboard/StatusChip.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { DASHBOARD_BASE, TYPE_ICONS } from '@/constants/dashboardNav'
import { fetchOverview } from '@/services/dashboardService' // BACKEND: overview (see service)
import { useAuthStore } from '@/stores/auth'
import { formatDate, formatRelative } from '@/utils/format'

const auth = useAuthStore()
const base = computed(() => DASHBOARD_BASE[auth.role])
const { data, loading, error, reload } = useAsyncData(() => fetchOverview(auth.role), null)

const name = computed(() => auth.user?.fullName || data.value?.profile.name || '')
const initial = computed(() => name.value.trim()[0]?.toUpperCase() ?? '?')
</script>

<template>
  <PageHeader title="Overview" lead="How your profile and work are doing." />

  <LoadState :loading="loading" :error="error" @retry="reload">
    <template v-if="data">
      <div class="dash-grid dash-grid--stats">
        <StatCard v-for="(stat, i) in data.stats" :key="stat.key" :label="stat.label" :value="stat.value" :hint="stat.hint" :icon="stat.icon" :tone="i" />
      </div>

      <div class="dash-grid dash-grid--two">
        <DashCard title="Your profile">
          <template #actions>
            <v-btn :to="`${base}/settings`" variant="text" color="primary" size="small">Edit</v-btn>
          </template>

          <div class="dash-profile">
            <v-avatar color="secondary" size="56">{{ initial }}</v-avatar>
            <div>
              <p class="dash-profile__name">{{ name }}</p>
              <p class="dash-profile__meta">{{ data.profile.location }} · Member since {{ data.profile.memberSince }}</p>
            </div>
            <StatusChip :status="data.profile.verification" />
          </div>

          <p class="dash-text">{{ data.profile.bio }}</p>

          <div class="dash-progress">
            <div class="dash-progress__row">
              <span>Profile {{ data.profile.completeness }}% complete</span>
            </div>
            <v-progress-linear :model-value="data.profile.completeness" height="8" rounded color="secondary" bg-color="primary" bg-opacity="0.12" />
            <ul v-if="data.profile.missing.length" class="dash-checklist">
              <li v-for="item in data.profile.missing" :key="item">
                <v-icon icon="mdi-circle-outline" size="16" /> {{ item }}
              </li>
            </ul>
          </div>
        </DashCard>

        <DashCard title="Reminders">
          <template #actions>
            <v-btn :to="`${base}/notifications`" variant="text" color="primary" size="small">See all</v-btn>
          </template>
          <ul v-if="data.reminders.length" class="dash-list">
            <li v-for="reminder in data.reminders" :key="reminder.id" class="dash-list__item">
              <v-icon icon="mdi-alarm" />
              <div class="dash-list__main">
                <p class="dash-list__title">{{ reminder.title }}</p>
                <p class="dash-list__meta">Due {{ formatDate(reminder.due) }}</p>
              </div>
            </li>
          </ul>
          <EmptyState v-else icon="mdi-check-circle-outline" title="Nothing coming up" />
        </DashCard>
      </div>

      <DashCard title="Recent activity">
        <ul v-if="data.activity.length" class="dash-list">
          <li v-for="item in data.activity" :key="item.id" class="dash-list__item">
            <v-icon :icon="TYPE_ICONS[item.type] ?? TYPE_ICONS.system" />
            <div class="dash-list__main">
              <p class="dash-list__title">{{ item.text }}</p>
            </div>
            <span class="dash-list__side">{{ formatRelative(item.time) }}</span>
          </li>
        </ul>
        <EmptyState v-else title="No activity yet" text="Things that happen on your account show up here." />
      </DashCard>
    </template>
  </LoadState>
</template>
