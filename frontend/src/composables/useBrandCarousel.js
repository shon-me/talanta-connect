import { computed, ref } from 'vue'

// Fewer cards than this and a card would have to cross the stage to wrap around,
// so short lists are repeated until there are enough.
const MIN_CARDS = 5

const STATE_BY_SLOT = { 0: 'center', '-1': 'left', 1: 'right' }

// Every card stays mounted. Its position is just a state, so the move is a smooth CSS transition:
// 'center' | 'left' | 'right' | 'far-left' | 'far-right'
export function useBrandCarousel(brands) {
  const current = ref(0)

  const slides = computed(() => {
    const base = brands.value
    if (!base.length) return []
    const copies = Math.ceil(MIN_CARDS / base.length)
    return Array.from({ length: base.length * copies }, (_, k) => {
      const brand = base[k % base.length]
      return { ...brand, key: `${brand.id}-${Math.floor(k / base.length)}` }
    })
  })

  const cards = computed(() => {
    const n = slides.value.length
    const half = Math.floor(n / 2)
    const centre = current.value % n
    return slides.value.map((brand, i) => {
      // shortest signed distance from the centre card, wrapping around the list
      const slot = ((i - centre + n + half) % n) - half
      return { ...brand, state: STATE_BY_SLOT[slot] ?? (slot < 0 ? 'far-left' : 'far-right') }
    })
  })

  const next = () => {
    const n = slides.value.length
    if (n) current.value = (current.value + 1) % n
  }

  const prev = () => {
    const n = slides.value.length
    if (n) current.value = (current.value - 1 + n) % n
  }

  return { cards, next, prev }
}
