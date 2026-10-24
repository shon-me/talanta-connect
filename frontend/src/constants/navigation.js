// One place for every link in the app bar, side menu and footer.
// The routes below are not built yet: add them to router/index.js as the pages get made.

export const navLinks = [
  { label: 'Home', to: '/', icon: 'mdi-home-outline', exact: true },
  { label: 'Brands', to: '/brands', icon: 'mdi-storefront-outline' },
  { label: 'Creators', to: '/creators', icon: 'mdi-palette-outline' },
  { label: 'About', to: '/about', icon: 'mdi-information-outline' },
]

export const footerColumns = [
  {
    title: 'Explore',
    links: [
      { label: 'Brands', to: '/brands' },
      { label: 'Creators', to: '/creators' },
      { label: 'Join the community', to: '/signup' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', to: '/privacy' },
      { label: 'Terms of service', to: '/terms' },
    ],
  },
]

// TODO: replace the '#' placeholders with the real profile URLs.
// If your @mdi/font version no longer ships the brand icons, swap these for another icon set.
export const socialLinks = [
  { label: 'Instagram', icon: 'mdi-instagram', href: '#' },
  { label: 'X (Twitter)', icon: 'mdi-twitter', href: '#' },
  { label: 'Facebook', icon: 'mdi-facebook', href: '#' },
  { label: 'LinkedIn', icon: 'mdi-linkedin', href: '#' },
  { label: 'YouTube', icon: 'mdi-youtube', href: '#' },
]
