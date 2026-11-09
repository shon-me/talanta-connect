import { ref } from 'vue'
import { useToast } from './useToast'

// Runs a save / delete / approve request: shows a busy state, then a toast with the result.
//   const { busy, run } = useAction()
//   const { ok, value } = await run(() => saveThing(data), 'Saved')
export function useAction() {
  const { notify } = useToast()
  const busy = ref(false)

  async function run(task, success = '') {
    busy.value = true
    try {
      const value = await task()
      if (success) notify(success)
      return { ok: true, value }
    } catch (err) {
      notify(err.message || 'Something went wrong. Try again.', 'error')
      return { ok: false, value: null }
    } finally {
      busy.value = false
    }
  }

  return { busy, run }
}
