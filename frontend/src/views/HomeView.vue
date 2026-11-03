<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { feedCopy } from '@/constants/feed'
import { useExpandableFeed } from '@/composables/useExpandableFeed'
import { useFeed } from '@/composables/useFeed'
import { useInView } from '@/composables/useInView'
import { USE_MOCK } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import BrandCard from './home/BrandCard.vue'
import CreatorCard from './home/CreatorCard.vue'

const route = useRoute()
const auth = useAuthStore()

// DEV ONLY (mock mode): /home?as=brand, /home?as=creator or /home?as=guest to preview each feed
if (import.meta.env.DEV && USE_MOCK && route.query.as) auth.devPreview(String(route.query.as))

const copy = computed(() => feedCopy[auth.role] ?? feedCopy.guest)

// ---------- data ----------
const { items, loading, error, done, loadMore, reload } = useFeed()

const filter = ref('all')
const visible = computed(() =>
  filter.value === 'all' ? items.value : items.value.filter((item) => item.type === filter.value),
)
const keyOf = (item) => `${item.type}-${item.id}`

// ---------- cards that open to the full row ----------
const grid = ref(null)
const { expandedKey, toggle, collapse } = useExpandableFeed(grid)
watch([filter, () => auth.role], collapse)

// ---------- endless scroll (signed-in users only: guests get a single preview page) ----------
const sentinel = ref(null)
const { inView } = useInView(sentinel, { threshold: 0, rootMargin: '600px 0px' })
watch([inView, loading, () => items.value.length], () => {
  if (inView.value && !loading.value && !done.value && !error.value && items.value.length) loadMore()
})

// ---------- visitors can look but not open profile pages ----------
const gate = reactive({ open: false, item: null })
const gateTarget = computed(() =>
  gate.item ? `/${gate.item.type === 'brand' ? 'brands' : 'creators'}/${gate.item.slug}` : '/',
)

function openLocked(item) {
  gate.item = item
  gate.open = true
}
</script>

<template>
  <section class="feed" aria-labelledby="feed-title">
    <div class="feed__inner">
      <header class="feed__head">
        <div>
          <h1 id="feed-title" class="section-title">{{ copy.title }}</h1>
          <p class="section-lead">{{ copy.lead }}</p>
        </div>

        <v-btn-toggle v-model="filter" class="feed__filter" mandatory divided variant="outlined" color="primary"
          density="comfortable" rounded="lg">
          <v-btn value="all">All</v-btn>
          <v-btn value="creator">Creators</v-btn>
          <v-btn value="brand">Brands</v-btn>
        </v-btn-toggle>
      </header>

      <aside v-if="!auth.isAuthenticated" class="feed__banner">
        <p class="feed__banner-text">
          <strong>You're browsing as a guest.</strong>
          Sign up to see more brands and creators and to open their pages.
        </p>
        <div class="feed__banner-actions">
          <v-btn to="/signup" color="secondary" rounded="lg">Sign up</v-btn>
          <v-btn to="/login" variant="text" color="primary">Log in</v-btn>
        </div>
      </aside>

      <div ref="grid" class="feed__grid" :aria-busy="loading">
        <component :is="item.type === 'brand' ? BrandCard : CreatorCard" v-for="item in visible" :key="keyOf(item)"
          :data-flip-id="keyOf(item)" :item="item" :expanded="expandedKey === keyOf(item)"
          :locked="!auth.isAuthenticated" @toggle="toggle(keyOf(item))" @open="openLocked" />

        <template v-if="loading && !items.length">
          <div v-for="n in 4" :key="n" class="feed-card feed-card--skeleton" aria-hidden="true" />
        </template>
      </div>

      <p v-if="error" class="feed__status" role="alert">
        Couldn't load the feed.
        <v-btn variant="text" size="small" color="primary" @click="reload">Try again</v-btn>
      </p>

      <p v-else-if="!loading && !visible.length && items.length" class="feed__status">
        Nothing to show with this filter yet.
      </p>

      <!-- Signed in: loads the next page when this scrolls into view -->
      <div v-if="auth.isAuthenticated && !done" ref="sentinel" class="feed__more">
        <v-progress-circular v-if="loading && items.length" indeterminate color="primary" size="28" />
      </div>
      <p v-else-if="auth.isAuthenticated && done && items.length" class="feed__status">You're all caught up.</p>

      <!-- Visitors: the preview ends here -->
      <div v-if="!auth.isAuthenticated && done && items.length" class="feed__end">
        <h2 class="feed__end-title">That's the preview</h2>
        <p class="feed__end-text">Join Talanta Connect to see the full feed and open brand and creator pages.</p>
        <div class="feed__banner-actions">
          <v-btn to="/signup" color="secondary" size="large" rounded="lg">Create your free account</v-btn>
          <v-btn to="/login" variant="text" color="primary">Log in</v-btn>
        </div>
      </div>
    </div>

    <v-dialog v-model="gate.open" max-width="440">
      <v-card class="feed-gate" rounded="xl">
        <v-icon icon="mdi-lock-outline" size="36" color="primary" />
        <h2 class="feed-gate__title">Sign up to view {{ gate.item?.name }}</h2>
        <p class="feed-gate__text">Create a free account or log in to see full profiles and get in touch.</p>
        <div class="feed-gate__actions">
          <!-- redirect brings them back to the page they wanted after they sign up or log in -->
          <v-btn color="secondary" size="large" rounded="lg" block
            :to="{ path: '/signup', query: { redirect: gateTarget } }" @click="gate.open = false">
            Sign up
          </v-btn>
          <v-btn variant="outlined" color="primary" size="large" rounded="lg" block
            :to="{ path: '/login', query: { redirect: gateTarget } }" @click="gate.open = false">
            Log in
          </v-btn>
          <v-btn variant="text" block @click="gate.open = false">Not now</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </section>
</template>
