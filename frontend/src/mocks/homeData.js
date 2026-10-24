// Placeholder content used while there is no backend (VITE_API_URL not set).
// Delete this folder once the services below talk to the real API.
// Put the matching files in /public/videos and /public/images.

export const heroSlides = [
  {
    id: 1,
    video: '/videos/vid1.mp4',
    poster: '/images/hero/poster-1.jpg',
    title: 'What is Talanta Connect?',
    subtitle: 'A community where creators share their work and brands find the people to bring ideas to life.',
  },
  {
    id: 2,
    video: '/videos/vid2.mp4',
    poster: '/images/hero/poster-2.jpg',
    title: 'Brands that back creators',
    subtitle: 'Post a brief, browse portfolios and hire talent whose work fits your brand.',
  },
  {
    id: 3,
    video: '/videos/vid3.mp4',
    poster: '/images/hero/poster-3.jpg',
    title: 'Show your work. Get booked.',
    subtitle: 'Build a profile, share your portfolio and take on projects that suit you.',
  },
]

const brandCopy = [
  ['Fashion and lifestyle', 'Looking for photographers and video creators for seasonal campaigns.'],
  ['Food and drink', 'Hiring food stylists and short-form video makers for new menu launches.'],
  ['Music and events', 'Needs designers and filmmakers for festival visuals and recap videos.'],
  ['Home and living', 'Working with illustrators and interior photographers on product stories.'],
  ['Sports and fitness', 'Looking for athletes who create content and editors who can keep up.'],
  ['Travel and tourism', 'Hiring writers, drone pilots and photographers for destination features.'],
]

export const brands = brandCopy.map(([tagline, description], i) => ({
  id: i + 1,
  slug: `brand-${i + 1}`,
  name: `Brand ${['One', 'Two', 'Three', 'Four', 'Five', 'Six'][i]}`,
  tagline,
  description,
  image: `/images/brands/brand-${i + 1}.jpg`,
}))

export const creators = [
  { id: 1, slug: 'creator-one', name: 'Creator One', craft: 'Photographer', bio: 'Portraits and events shot on location, with a focus on honest, natural light.', skills: ['Portraits', 'Events'], image: '/images/creators/creator-1.jpg' },
  { id: 2, slug: 'creator-two', name: 'Creator Two', craft: 'Video editor', bio: 'Edits short-form videos and brand stories that hold attention to the last second.', skills: ['Reels', 'Colour grading'], image: '/images/creators/creator-2.jpg' },
  { id: 3, slug: 'creator-three', name: 'Creator Three', craft: 'Illustrator', bio: 'Hand-drawn illustration and lettering for packaging, posters and social campaigns.', skills: ['Packaging', 'Lettering'], image: '/images/creators/creator-3.jpg' },
  { id: 4, slug: 'creator-four', name: 'Creator Four', craft: 'Musician and producer', bio: 'Writes and produces original music and jingles for ads, films and live events.', skills: ['Jingles', 'Live sets'], image: '/images/creators/creator-4.jpg' },
]
