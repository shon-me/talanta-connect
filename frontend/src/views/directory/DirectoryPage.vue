<script setup>
import { computed, ref } from 'vue'
import FeedList from '@/components/feed/FeedList.vue'
import { directoryCopy } from '@/constants/feed'
import { useFeed } from '@/composables/useFeed'
import { fetchDirectory } from '@/services/directoryService' // BACKEND: brands / creators lists (see service)
import { useAuthStore } from '@/stores/auth'
import { matchesQuery } from '@/utils/search'

// Every brand, or every creator, in the same card style as the feed.
const props = defineProps({
  kind: { type: String, required: true }, // 'brand' | 'creator'
})

const auth = useAuthStore()
const copy = computed(() => directoryCopy[props.kind])

const { items, loading, error, done, loadMore, reload } = useFeed((args) => fetchDirectory(props.kind, args))

const query = ref('')
const visible = computed(() => items.value.filter((item) => matchesQuery(item, query.value)))
</script>

<template>
  <FeedList
    :title="copy.title"
    :lead="auth.isAuthenticated ? copy.lead : copy.guestLead"
    :items="visible"
    :total="items.length"
    :loading="loading"
    :error="error"
    :done="done"
    :reset-key="query"
    @load-more="loadMore"
    @retry="reload"
  >
    <template #controls>
      <v-text-field
        v-model="query"
        class="feed__search"
        :placeholder="copy.search"
        :aria-label="copy.search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        rounded="lg"
        hide-details
        clearable
      />
    </template>
  </FeedList>
</template>
