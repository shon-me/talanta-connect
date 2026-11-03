import { get, post, USE_MOCK } from './api'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Every auth response is turned into the one user shape the app uses
const toUser = (u) => ({ id: u.id, fullName: u.full_name, email: u.email, role: u.role })

export async function registerUser({ fullName, email, password, role }) {
  // BACKEND: POST /api/auth/register/
  //   body -> { full_name, email, password, role: 'creator' | 'brand' }
  //   201  -> { user: { id, full_name, email, role }, access, refresh }   (or set an httpOnly session cookie)
  //   400  -> field errors, e.g. { email: ['An account with this email already exists.'] }
  //   Needs: a `role` field on the user model, an email verification step after sign up,
  //   password rules that match the 8 character minimum used in the form, and rate limiting on this endpoint.
  if (USE_MOCK) {
    await wait(800)
    return { id: 0, fullName, email, role }
  }

  const data = await post('/auth/register/', { full_name: fullName, email, password, role })
  return toUser(data.user)
}

export async function loginUser({ email, password }) {
  // BACKEND: POST /api/auth/login/
  //   body -> { email, password }
  //   200  -> { user: { id, full_name, email, role }, access, refresh }   (or set an httpOnly session cookie)
  //   401  -> { detail: 'Incorrect email or password.' }  (same message for an unknown email and a wrong password)
  //   Needs: rate limiting and a temporary lockout after repeated failures.
  if (USE_MOCK) {
    await wait(700)
    // Mock only: an email containing "brand" logs in as a brand manager, anything else as a creator
    return { id: 0, fullName: 'Preview user', email, role: /brand/i.test(email) ? 'brand' : 'creator' }
  }

  const data = await post('/auth/login/', { email, password })
  return toUser(data.user)
}

export async function fetchCurrentUser() {
  // BACKEND: GET /api/auth/me/ -> { id, full_name, email, role }
  //   401 when nobody is signed in. Called once on app start so a refresh keeps the user signed in.
  return toUser(await get('/auth/me/'))
}
