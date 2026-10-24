import { get, USE_MOCK } from './api'
import { creators } from '@/mocks/homeData'

const LIMIT = 4 // the homepage grid is 2 x 2

export async function fetchFeaturedCreators() {
  // BACKEND: GET /api/creators/featured/?limit=4
  //   -> [{ id, slug, name, craft, bio, skills: string[], image_url }]
  //   Needs: `is_featured` + `featured_rank` on Creator (admin-controlled), a short `bio` (max ~160 chars),
  //   and a public endpoint (no auth) for the logged-out homepage.
  if (USE_MOCK) return creators.slice(0, LIMIT)

  const data = await get(`/creators/featured/?limit=${LIMIT}`)
  return data.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    craft: c.craft,
    bio: c.bio,
    skills: c.skills ?? [],
    image: c.image_url,
  }))
}
