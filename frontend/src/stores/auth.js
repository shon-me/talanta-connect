import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Who is signed in. The app bar reads this to show Log in / Sign up or the account menu.
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null) // { id, fullName, email, role }
  const isAuthenticated = computed(() => !!user.value)

  function setUser(value) {
    user.value = value
  }

  async function logout() {
    // BACKEND: POST /api/auth/logout/  (blacklist the refresh token or clear the session cookie)
    user.value = null
  }

  // BACKEND: on app start, restore the session so returning visitors stay signed in:
  //   GET /api/auth/me/  -> { id, full_name, email, role }   (401 when nobody is signed in)
  //   then call setUser({ id, fullName: data.full_name, email, role })

  return { user, isAuthenticated, setUser, logout }
})
