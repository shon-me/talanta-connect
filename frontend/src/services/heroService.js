import { get, USE_MOCK } from './api'
import { heroSlides } from '@/mocks/homeData'

export async function fetchHeroSlides() {
  // BACKEND: GET /api/home/hero-slides/
  //   -> [{ id, video_url, poster_url, title, subtitle }], ordered by `position`
  //   Needs: an admin-editable HeroSlide model (video file, poster image, title, subtitle, position, is_active).
  //   Video files must be served with CORS enabled and HTTP range support (CDN or media bucket),
  //   so the browser can both stream them and cache them in memory (see useVideoPreload).
  if (USE_MOCK) return heroSlides

  const data = await get('/home/hero-slides/')
  return data.map((s) => ({
    id: s.id,
    video: s.video_url,
    poster: s.poster_url,
    title: s.title,
    subtitle: s.subtitle,
  }))
}
