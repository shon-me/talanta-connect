import { get, post, request, USE_MOCK } from './api'
import { mockBrandProfile, mockCreatorProfile } from '@/mocks/profileData'

export async function fetchBrandProfile(slug) {
  // BACKEND: GET /api/brands/<slug>/        (members only: 401 when not signed in, 404 when unknown)
  //   -> { id, slug, name, category, tagline, about, location, image_url, following: bool,
  //        pay: { amount, unit, method }, looking_for: [string],
  //        tasks: [ { id, title, description, image_url, skills: [string],
  //                   pay: { amount, unit, method }, deadline, applied: bool } ] }
  //   `applied` is for the signed-in creator. If brands can post many tasks, move `tasks` to
  //   GET /api/brands/<slug>/tasks/?cursor=... and load it page by page.
  //   The brand image and each task image are uploaded by the brand manager in their dashboard.
  if (USE_MOCK) return mockBrandProfile(slug)

  const d = await get(`/brands/${encodeURIComponent(slug)}/`)
  return {
    type: 'brand',
    id: d.id,
    slug: d.slug,
    name: d.name,
    category: d.category,
    tagline: d.tagline,
    about: d.about,
    location: d.location,
    image: d.image_url,
    tone: d.id % 6,
    following: !!d.following,
    pay: d.pay,
    lookingFor: d.looking_for ?? [],
    tasks: (d.tasks ?? []).map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      image: t.image_url,
      tone: t.id % 6,
      skills: t.skills ?? [],
      pay: t.pay,
      deadline: t.deadline,
      applied: !!t.applied,
    })),
  }
}

export async function fetchCreatorProfile(slug) {
  // BACKEND: GET /api/creators/<slug>/      (members only: 401 when not signed in, 404 when unknown)
  //   -> { id, slug, name, craft, location, bio, skills: [string], starting_rate, availability,
  //        image_url, following: bool,
  //        portfolio: [ { id, title, category, year, description, tags: [string], image_url } ] }
  //   Everything here is written and uploaded by the creator in their dashboard.
  //   Portfolio can be its own paginated endpoint if creators will have many pieces.
  if (USE_MOCK) return mockCreatorProfile(slug)

  const d = await get(`/creators/${encodeURIComponent(slug)}/`)
  return {
    type: 'creator',
    id: d.id,
    slug: d.slug,
    name: d.name,
    craft: d.craft,
    location: d.location,
    bio: d.bio,
    skills: d.skills ?? [],
    startingRate: d.starting_rate,
    availability: d.availability,
    image: d.image_url,
    tone: d.id % 6,
    following: !!d.following,
    portfolio: (d.portfolio ?? []).map((w) => ({
      id: w.id,
      title: w.title,
      category: w.category,
      year: w.year,
      description: w.description,
      tags: w.tags ?? [],
      image: w.image_url,
      tone: w.id % 6,
    })),
  }
}

export async function applyToTask(taskId) {
  // BACKEND: POST /api/tasks/<id>/apply/
  //   Creators only: 403 for brand managers, 409 if they already applied, 404 if the task is closed.
  //   Needs: an Application model, and a notification to the brand manager.
  if (USE_MOCK) return new Promise((resolve) => setTimeout(resolve, 600))
  return post(`/tasks/${taskId}/apply/`)
}

export async function setFollowing(kind, slug, value) {
  // BACKEND: PUT /api/<brands|creators>/<slug>/follow/ to follow, DELETE the same address to unfollow
  if (USE_MOCK) return new Promise((resolve) => setTimeout(resolve, 300))
  return request(`/${kind}s/${encodeURIComponent(slug)}/follow/`, { method: value ? 'PUT' : 'DELETE' })
}
