import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { USE_MOCK } from '@/services/api'
import { fetchCurrentUser } from '@/services/authService'

const DEV_KEY = 'tc_dev_as'

// Who is signed in. The app bar, the feed and the route guard read this.
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null) // { id, fullName, email, role }  role: 'creator' | 'brand'
  const isAuthenticated = computed(() => !!user.value)
  const role = computed(() => user.value?.role ?? 'guest') // 'creator' | 'brand' | 'guest'

  function setUser(value) {
    user.value = value
  }

  async function logout() {
    // BACKEND: POST /api/auth/logout/  (blacklist the refresh token or clear the session cookie)
    user.value = null
    if (USE_MOCK) sessionStorage.removeItem(DEV_KEY)
  }

  // DEV ONLY, remove once login exists. Lets you preview the three views without a backend:
  //   add ?as=brand, ?as=creator or ?as=guest to any address, e.g. /brands/brand-3?as=creator
  // The choice is kept for the browser tab, so a refresh does not log you out.
  function devPreview(as) {
    user.value = as === 'brand' || as === 'creator'
      ? { id: 0, fullName: `Preview ${as}`, email: '', role: as }
      : null
    sessionStorage.setItem(DEV_KEY, as)
  }

  // Runs once. The router waits for it before deciding whether a page needs a login, so a
  // refresh does not bounce a signed-in user to the login page.
  let restoring = null
  function restore() {
    restoring ??= (async () => {
      if (USE_MOCK) {
        const saved = sessionStorage.getItem(DEV_KEY)
        if (saved && !user.value) devPreview(saved)
        return
      }
      try {
        user.value = await fetchCurrentUser() // BACKEND: GET /api/auth/me/
      } catch {
        user.value = null
      }
    })()
    return restoring
  }

  return { user, isAuthenticated, role, setUser, logout, devPreview, restore }
})
