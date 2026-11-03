import { ref, watch } from 'vue'
import { fetchFeed } from '@/services/feedService'
import { useAuthStore } from '@/stores/auth'

// Loads the feed page by page. Starts over whenever the viewer's role changes (log in, log out).
export function useFeed() {
  const auth = useAuthStore()
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)
  const done = ref(false)
  let cursor = null
  let run = 0 // ignores answers that arrive after the viewer changed

  async function load(reset = false) {
    if (reset) {
      run += 1
      items.value = []
      cursor = null
      done.value = false
      loading.value = false
    }
    if (loading.value || done.value) return

    const id = run
    loading.value = true
    error.value = null
    try {
      const page = await fetchFeed({ role: auth.role, cursor })
      if (id !== run) return
      items.value.push(...page.items)
      cursor = page.nextCursor
      done.value = page.nextCursor === null
    } catch (err) {
      if (id === run) error.value = err
    } finally {
      if (id === run) loading.value = false
    }
  }

  watch(() => auth.role, () => load(true), { immediate: true })

  return { items, loading, error, done, loadMore: () => load(false), reload: () => load(true) }
}
