import { get, USE_MOCK } from './api'
import { mockFeedPage } from '@/mocks/feedData'

export async function fetchFeed({ role, cursor = null }) {
  // BACKEND: GET /api/feed/?cursor=<opaque string>
  //   Auth is optional. The request must carry the session (cookie or Authorization header) so the
  //   server can read the user's role. Anonymous requests get the guest feed.
  //   -> { results: [ brand | creator ], next_cursor: string | null }
  //
  //   Mix (server side):
  //     brand manager -> mostly creators (about 3 in 4), a few brands
  //     creator       -> mostly brands (about 3 in 4), a few creators
  //     anonymous     -> equal number of each, a smaller page than signed-in users, and next_cursor is
  //                      always null (no endless scrolling for guests)
  //   Items should be spread evenly (not all creators first). Keep the order stable between pages.
  //
  //   brand   -> { type: 'brand', id, slug, name, category, tagline, about, image_url,
  //                task: { title, description }, pay: { amount, unit, method }, looking_for: [] }
  //   creator -> { type: 'creator', id, slug, name, craft, location, bio, skills: [],
  //                starting_rate, availability, image_url }
  //   image_url comes from what the brand manager / creator uploaded in their dashboard.
  //   Anonymous responses should leave out anything you only want members to see.
  if (USE_MOCK) return mockFeedPage({ role, cursor })

  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
  const data = await get(`/feed/${query}`)
  return { items: data.results.map(toFeedItem), nextCursor: data.next_cursor ?? null }
}

function toFeedItem(raw) {
  const base = { type: raw.type, id: raw.id, slug: raw.slug, name: raw.name, image: raw.image_url, tone: raw.id % 6 }
  if (raw.type === 'brand') {
    return {
      ...base,
      category: raw.category,
      tagline: raw.tagline,
      about: raw.about,
      task: raw.task,
      pay: raw.pay,
      lookingFor: raw.looking_for ?? [],
    }
  }
  return {
    ...base,
    craft: raw.craft,
    location: raw.location,
    bio: raw.bio,
    skills: raw.skills ?? [],
    startingRate: raw.starting_rate,
    availability: raw.availability,
  }
}
