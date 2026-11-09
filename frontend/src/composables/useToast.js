import { ref } from 'vue'

// One snackbar for the whole dashboard (rendered by DashboardLayout)
const open = ref(false)
const message = ref('')
const color = ref('')

export function useToast() {
  function notify(text, kind = '') {
    message.value = text
    color.value = kind === 'error' ? 'error' : ''
    open.value = true
  }
  return { open, message, color, notify }
}
