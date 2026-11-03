// Placeholder brand and creator pages built from the feed mock data. Delete once profileService
// talks to the real API. Optional images: public/images/tasks/task-1..6.jpg and
// public/images/portfolio/work-1..6.jpg (cards use brand-coloured backgrounds without them).
import { brandPool, creatorPool } from './feedData'

const wait = (value, ms = 450) => new Promise((resolve) => setTimeout(() => resolve(value), ms))
const notFound = () => Object.assign(new Error('Not found'), { status: 404 })

const TASKS = [
  ['Product photos for the new collection', 'Shoot 12 lifestyle photos of the range. Edited files are delivered within 5 days.', ['Photography', 'Editing']],
  ['Short videos for a menu launch', 'Film three 30-second clips for Instagram and TikTok.', ['Video', 'Food']],
  ['Recap video for last weekend', 'Cut a 60-second highlight reel from our footage, with music and titles.', ['Editing', 'Motion titles']],
  ['Illustrated care guide', 'Draw 8 spot illustrations for a printed guide.', ['Illustration']],
  ['Training session clips', 'Capture and edit a weekend session into five short clips.', ['Sports', 'Video']],
  ['Destination feature', 'Write 600 words and supply 10 photos for an itinerary page.', ['Writing', 'Photography']],
  ['Campaign portraits', 'Half-day shoot for six portraits for our site and packaging.', ['Portraits', 'Retouching']],
  ['Unboxing video', 'Film and edit a 90-second unboxing and first-look video.', ['Video', 'Product']],
]
const DEADLINES = ['In 3 days', 'In 5 days', 'In 1 week', 'In 10 days', 'In 2 weeks', 'In 3 weeks']

const WORKS = ['Coastal campaign', 'Market day', 'Studio sessions', 'Night run', 'Spring collection', 'Festival weekend', 'Family stories', 'Product launch']

export function mockBrandProfile(slug) {
  const brand = brandPool.find((b) => b.slug === slug)
  if (!brand) return Promise.reject(notFound())

  const tasks = Array.from({ length: 6 }, (_, k) => {
    const [title, description, skills] = TASKS[(brand.id + k) % TASKS.length]
    return {
      id: brand.id * 100 + k,
      title,
      description,
      skills,
      image: `/images/tasks/task-${(k % 6) + 1}.jpg`,
      tone: (brand.id + k) % 6,
      pay: brand.pay,
      deadline: DEADLINES[k % DEADLINES.length],
      applied: false,
    }
  })
  const location = brand.about.match(/based in (\w+)/)?.[1] ?? 'Nairobi'
  return wait({ ...brand, location, following: false, tasks })
}

export function mockCreatorProfile(slug) {
  const creator = creatorPool.find((c) => c.slug === slug)
  if (!creator) return Promise.reject(notFound())

  const portfolio = Array.from({ length: 6 }, (_, k) => ({
    id: creator.id * 100 + k,
    title: WORKS[(creator.id + k) % WORKS.length],
    category: creator.craft,
    year: 2026 - (k % 3),
    description: `A ${creator.craft.toLowerCase()} project for a local brand, delivered on schedule and ready to use.`,
    tags: creator.skills.slice(0, 2 + (k % 2)),
    image: `/images/portfolio/work-${(k % 6) + 1}.jpg`,
    tone: (creator.id + k + 2) % 6,
  }))
  return wait({ ...creator, following: false, portfolio })
}
