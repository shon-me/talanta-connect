const FIELDS = ['name', 'category', 'tagline', 'about', 'craft', 'location', 'bio']

// True when every word typed appears somewhere in the brand or creator.
// BACKEND: with a large number of brands or creators, search on the server (GET /api/brands/?q=...)
// instead, because this only searches what has been loaded so far.
export function matchesQuery(item, query) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return true
  const text = [...FIELDS.map((f) => item[f]), ...(item.skills ?? []), ...(item.lookingFor ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return words.every((w) => text.includes(w))
}
