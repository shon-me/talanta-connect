// How many of each card a feed page shows, per viewer.
// Brand managers mostly see creators, creators mostly see brands, guests see an equal (and smaller) mix.
// BACKEND: the server should apply this itself from the signed-in user's role. The numbers here
// only drive the mock data, so keep them in sync with whatever the API does.
export const FEED_MIX = {
  brand: { creators: 9, brands: 3 },
  creator: { creators: 3, brands: 9 },
  guest: { creators: 3, brands: 3 },
}

// Page title and intro line for each viewer
export const feedCopy = {
  brand: {
    title: 'Creators for your next project',
    lead: 'Browse creators who could fit your brand, with a few brands to keep an eye on.',
  },
  creator: {
    title: 'Brands to work with',
    lead: 'See which brands are working with creators, with a few creators to follow.',
  },
  guest: {
    title: "See who's on Talanta Connect",
    lead: 'A preview of the brands and creators in the community. Sign up to see the full feed.',
  },
}
