import { post, USE_MOCK } from './api'

export async function registerUser({ fullName, email, password, role }) {
  // BACKEND: POST /api/auth/register/
  //   body -> { full_name, email, password, role: 'creator' | 'brand' }
  //   201  -> { user: { id, email, role }, access, refresh }   (or set an httpOnly session cookie)
  //   400  -> field errors, e.g. { email: ['An account with this email already exists.'] }
  //   Needs: a `role` field on the user model, an email verification step after sign up,
  //   password rules that match the 8 character minimum used in the form, and rate limiting on this endpoint.
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return { id: 0, email, role }
  }

  return post('/auth/register/', { full_name: fullName, email, password, role })
}
