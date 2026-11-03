import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// Loads the brand or creator named in the address (/brands/:slug) and reloads when the slug changes.
export function useProfile(fetcher) {
  const route = useRoute()
  const profile = ref(null)
  const loading = ref(true)
  const error = ref(null)
  let run = 0 // ignores an answer that arrives after the slug has changed

  async function load() {
    const id = ++run
    loading.value = true
    error.value = null
    profile.value = null
    try {
      const data = await fetcher(String(route.params.slug))
      if (id === run) profile.value = data
    } catch (err) {
      if (id === run) error.value = err
    } finally {
      if (id === run) loading.value = false
    }
  }

  watch(() => route.params.slug, (slug) => { if (slug) load() }, { immediate: true })

  return { profile, loading, error, reload: load }
}
