import { onMounted, ref } from 'vue'

// Runs `fetcher` on mount and exposes loading / error state plus a reload().
export function useAsyncData(fetcher, initial = []) {
  const data = ref(initial)
  const loading = ref(false)
  const error = ref(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetcher()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { data, loading, error, reload: load }
}
