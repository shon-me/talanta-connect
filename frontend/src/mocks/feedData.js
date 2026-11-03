// Placeholder feed content used while there is no backend (VITE_API_URL not set).
// Delete once feedService talks to the real API.
// Optional images: /public/images/feed/brand-1..8.jpg and creator-1..8.jpg. Without them the cards use brand-coloured backgrounds.
import { FEED_MIX } from '@/constants/feed'

const CITIES = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika']

const BRAND_KINDS = [
  { category: 'Fashion and lifestyle', tagline: 'Everyday style made to be photographed', lookingFor: ['Photography', 'Styling'], task: ['Product photos for the new collection', 'Shoot 12 lifestyle photos of the spring range. Edited files are delivered within 5 days.'] },
  { category: 'Food and drink', tagline: 'Small-batch flavours from local kitchens', lookingFor: ['Food video', 'Photography'], task: ['Short videos for a menu launch', 'Film three 30-second clips of our new dishes for Instagram and TikTok.'] },
  { category: 'Music and events', tagline: 'Live nights and festival weekends', lookingFor: ['Videography', 'Graphic design'], task: ['Recap video for last weekend', 'Cut a 60-second highlight reel from our footage, with music and titles.'] },
  { category: 'Home and living', tagline: 'Furniture and decor for small spaces', lookingFor: ['Illustration', 'Interior photography'], task: ['Illustrated product guide', 'Draw 8 spot illustrations for our printed care guide.'] },
  { category: 'Sports and fitness', tagline: 'Training gear for every level', lookingFor: ['Sports content', 'Editing'], task: ['Training session clips', 'Capture and edit a weekend training session into five short clips.'] },
  { category: 'Travel and tourism', tagline: 'Weekend escapes and safari stays', lookingFor: ['Drone', 'Writing'], task: ['Destination feature', 'Write 600 words and supply 10 photos for our coast itinerary page.'] },
  { category: 'Beauty and care', tagline: 'Skincare made with local ingredients', lookingFor: ['Beauty photography', 'Modelling'], task: ['Campaign portraits', 'Half-day shoot for six portraits to use across our site and packaging.'] },
  { category: 'Tech and gadgets', tagline: 'Simple tools for busy people', lookingFor: ['Product video', 'Copywriting'], task: ['Unboxing video', 'Film and edit a 90-second unboxing and first-look video.'] },
]

const PAYS = [
  { amount: 'KSh 6,000', unit: 'task', method: 'M-Pesa, within 7 days of approval' },
  { amount: 'KSh 4,500', unit: 'task', method: 'M-Pesa, paid on delivery' },
  { amount: 'KSh 8,000', unit: 'task', method: 'Bank transfer, within 14 days' },
  { amount: 'KSh 3,000', unit: 'task', method: 'M-Pesa, half upfront and half on delivery' },
]

const CRAFTS = [
  { craft: 'Photographer', bio: 'Portraits and events shot on location, with a focus on honest, natural light.', skills: ['Portraits', 'Events', 'Retouching'] },
  { craft: 'Video editor', bio: 'Edits short-form videos and brand stories that hold attention to the last second.', skills: ['Reels', 'Colour grading', 'Motion titles'] },
  { craft: 'Illustrator', bio: 'Hand-drawn illustration and lettering for packaging, posters and social campaigns.', skills: ['Packaging', 'Lettering', 'Posters'] },
  { craft: 'Musician and producer', bio: 'Writes and produces original music and jingles for ads, films and live events.', skills: ['Jingles', 'Live sets', 'Sound design'] },
  { craft: 'Videographer', bio: 'Shoots product films and event coverage with a small, fast crew.', skills: ['Product film', 'Events', 'Drone'] },
  { craft: 'Graphic designer', bio: 'Brand identities and campaign graphics that stay clear at any size.', skills: ['Branding', 'Social graphics', 'Print'] },
  { craft: 'Content writer', bio: 'Clear, warm copy for websites, captions and long-form stories.', skills: ['Web copy', 'Captions', 'Features'] },
  { craft: 'Content creator', bio: 'Builds a loyal audience with relatable lifestyle and review content.', skills: ['Reviews', 'Lifestyle', 'Short video'] },
]

const RATES = ['KSh 3,000', 'KSh 5,000', 'KSh 2,500', 'KSh 7,500']
const AVAILABILITY = ['Open to work', 'Booking for next month', 'Open to work', 'Limited availability']

const POOL = 40

export const brandPool = Array.from({ length: POOL }, (_, i) => {
  const kind = BRAND_KINDS[i % BRAND_KINDS.length]
  return {
    type: 'brand',
    id: i + 1,
    slug: `brand-${i + 1}`,
    tone: i % 6,
    name: `Brand ${i + 1}`,
    category: kind.category,
    tagline: kind.tagline,
    about: `A ${kind.category.toLowerCase()} brand based in ${CITIES[i % CITIES.length]}, working with creators on regular projects.`,
    image: `/images/feed/brand-${(i % 8) + 1}.jpg`,
    task: { title: kind.task[0], description: kind.task[1] },
    pay: PAYS[i % PAYS.length],
    lookingFor: kind.lookingFor,
  }
})

export const creatorPool = Array.from({ length: POOL }, (_, i) => {
  const kind = CRAFTS[i % CRAFTS.length]
  return {
    type: 'creator',
    id: i + 1,
    slug: `creator-${i + 1}`,
    tone: (i + 3) % 6,
    name: `Creator ${i + 1}`,
    craft: kind.craft,
    location: CITIES[(i + 2) % CITIES.length],
    bio: kind.bio,
    skills: kind.skills,
    startingRate: RATES[i % RATES.length],
    availability: AVAILABILITY[i % AVAILABILITY.length],
    image: `/images/feed/creator-${(i % 8) + 1}.jpg`,
  }
})

// Spread the smaller list evenly through the larger one (equal lists alternate)
export function interleave(a, b) {
  const [big, small] = a.length >= b.length ? [a, b] : [b, a]
  const out = [...big]
  const total = big.length + small.length
  small.forEach((item, k) => out.splice(Math.floor(((k + 0.5) * total) / small.length), 0, item))
  return out
}

const MAX_PAGES = 4

export function mockFeedPage({ role, cursor }) {
  const mix = FEED_MIX[role] ?? FEED_MIX.guest
  const page = cursor ? Number(cursor) : 0
  const creators = creatorPool.slice(page * mix.creators, (page + 1) * mix.creators)
  const brands = brandPool.slice(page * mix.brands, (page + 1) * mix.brands)
  const hasMore = role !== 'guest' && page + 1 < MAX_PAGES // guests only ever get the first, smaller page
  return new Promise((resolve) =>
    setTimeout(() => resolve({ items: interleave(creators, brands), nextCursor: hasMore ? String(page + 1) : null }), 450),
  )
}
