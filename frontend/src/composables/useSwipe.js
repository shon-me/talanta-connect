import { onBeforeUnmount, onMounted } from 'vue'

// Horizontal swipe / drag on an element (touch, pen or mouse).
// Pair it with `touch-action: pan-y` on the element so vertical scrolling still works.
export function useSwipe(target, { onLeft, onRight, threshold = 48 } = {}) {
  let startX = 0
  let startY = 0
  let tracking = false

  const onDown = (event) => {
    tracking = true
    startX = event.clientX
    startY = event.clientY
  }

  const onUp = (event) => {
    if (!tracking) return
    tracking = false
    const dx = event.clientX - startX
    const dy = event.clientY - startY
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) onLeft?.()
    else onRight?.()
  }

  const onCancel = () => { tracking = false }

  onMounted(() => {
    const el = target.value
    if (!el) return
    el.addEventListener('pointerdown', onDown, { passive: true })
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onCancel)
  })

  onBeforeUnmount(() => {
    const el = target.value
    if (!el) return
    el.removeEventListener('pointerdown', onDown)
    el.removeEventListener('pointerup', onUp)
    el.removeEventListener('pointercancel', onCancel)
  })
}
