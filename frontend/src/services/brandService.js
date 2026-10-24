import { get, USE_MOCK } from './api'
import { brands } from '@/mocks/homeData'

export async function fetchFeaturedBrands() {
  // BACKEND: GET /api/brands/featured/
  //   -> [{ id, slug, name, tagline, description, image_url }], 5 to 10 items, ordered by `featured_rank`
  //   Needs: `is_featured` + `featured_rank` on Brand (controlled from the admin panel),
  //   and the endpoint must be public because this is the logged-out homepage.
  if (USE_MOCK) return brands

  const data = await get('/brands/featured/')
  return data.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    tagline: b.tagline,
    description: b.description,
    image: b.image_url,
  }))
}
