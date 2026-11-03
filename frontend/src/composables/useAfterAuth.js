import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// What happens after a successful login or sign up: remember the user, then go to the page they
// were trying to reach (?redirect=...) or to the feed.
export function useAfterAuth() {
  const router = useRouter()
  const route = useRoute()
  const auth = useAuthStore()

  function target() {
    const wanted = route.query.redirect
    // only addresses inside this app, never another site
    const inApp = typeof wanted === 'string' && wanted.startsWith('/') && !wanted.startsWith('//') && !wanted.includes('\\')
    return inApp ? wanted : '/home'
  }

  function finish(user) {
    auth.setUser(user)
    router.push(target())
  }

  return { finish }
}
