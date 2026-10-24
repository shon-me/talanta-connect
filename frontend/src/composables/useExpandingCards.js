import { computed, onBeforeUnmount, ref } from 'vue'

const COLUMNS = 2

// One card open at a time in a 2-column grid.
// Mouse: opens on click, closes when the pointer leaves the card.
// Touch / pen: opens on tap, closes as soon as the page starts scrolling.
// Keyboard: Enter / Space opens, Escape or moving focus away closes.
export function useExpandingCards(items) {
  const expandedId = ref(null)
  let pointerType = 'mouse'
  let scrollOrigin = 0

  // Row and column of the open card, so the grid can give that row and column more space
  const expandedPos = computed(() => {
    const index = items.value.findIndex((item) => item.id === expandedId.value)
    return index < 0 ? null : { col: index % COLUMNS, row: Math.floor(index / COLUMNS) }
  })

  function onScroll() {
    // small threshold so the tap itself (or scroll-snap settling) does not close the card
    if (Math.abs(window.scrollY - scrollOrigin) > 12) collapse()
  }

  function stopWatchingScroll() {
    window.removeEventListener('scroll', onScroll)
  }

  function collapse() {
    expandedId.value = null
    stopWatchingScroll()
  }

  function onPointerDown(event) {
    pointerType = event.pointerType
  }

  function toggle(id) {
    if (expandedId.value === id) return collapse()
    expandedId.value = id
    stopWatchingScroll()
    if (pointerType !== 'mouse') {
      scrollOrigin = window.scrollY
      window.addEventListener('scroll', onScroll, { passive: true })
    }
  }

  function onPointerLeave(event, id) {
    if (event.pointerType === 'mouse' && expandedId.value === id) collapse()
  }

  function onFocusOut(event, id) {
    if (expandedId.value === id && !event.currentTarget.contains(event.relatedTarget)) collapse()
  }

  onBeforeUnmount(stopWatchingScroll)

  return { expandedId, expandedPos, toggle, collapse, onPointerDown, onPointerLeave, onFocusOut }
}
