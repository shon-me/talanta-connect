import { ADMIN_BASE } from '@/constants/dashboardNav'

// Decides whether a signed-in or signed-out visitor may open a route.
// Returns where to send them instead, or undefined to let them in.
//   to    -> the route being opened (needs .path, .fullPath and .meta)
//   auth  -> { isAuthenticated, role }
//
// BACKEND: this only decides which page to show. The API must enforce the same rules itself
// (401 when signed out, 403 / 404 for the wrong role), otherwise the data is still reachable
// by calling the API directly.
export function resolveAccess(to, auth) {
  // The admin area pretends not to exist: anyone who is signed in but not an admin just sees "not found"
  if (to.meta.admin) {
    const looksMissing = {
      name: 'notfound',
      params: { pathMatch: to.path.substring(1).split('/') },
      replace: true,
    }
    if (to.meta.adminLogin) {
      if (auth.role === 'admin') return { path: ADMIN_BASE }
      return auth.isAuthenticated ? looksMissing : undefined
    }
    if (!auth.isAuthenticated) return { path: `${ADMIN_BASE}/login` }
    if (auth.role !== 'admin') return looksMissing
    return undefined
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.meta.role && auth.role !== to.meta.role) {
    return { path: '/home' }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { path: '/home' }
  }
  return undefined
}
