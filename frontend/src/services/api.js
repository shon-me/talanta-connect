// Thin fetch wrapper. Set VITE_API_URL (e.g. http://localhost:8000/api) in .env to use the real backend.
// Without it, every service falls back to the mock data in src/mocks.
const BASE_URL = import.meta.env.VITE_API_URL || ''

export const USE_MOCK = !BASE_URL

function messageFrom(data) {
  if (!data) return 'Something went wrong. Try again.'
  if (typeof data.detail === 'string') return data.detail
  const first = Object.values(data).flat()[0]
  return typeof first === 'string' ? first : 'Something went wrong. Try again.'
}

export async function request(path, { method = 'GET', body, signal } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      'Content-Type': 'application/json',
      // BACKEND: add the auth header (Authorization: Bearer <token>) or CSRF header here once login exists
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(messageFrom(data))
    error.status = response.status
    error.fields = data
    throw error
  }
  return data
}

export const get = (path, options) => request(path, options)
export const post = (path, body, options) => request(path, { ...options, method: 'POST', body })
