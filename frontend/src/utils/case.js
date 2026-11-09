// The API speaks snake_case, the app uses camelCase. These convert whole responses and request bodies.
const camel = (key) => key.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase())
const snake = (key) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)

const walk = (value, rename) => {
  if (Array.isArray(value)) return value.map((v) => walk(v, rename))
  if (value && typeof value === 'object' && value.constructor === Object) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [rename(k), walk(v, rename)]))
  }
  return value
}

export const camelizeKeys = (value) => walk(value, camel)
export const snakeKeys = (value) => walk(value, snake)
