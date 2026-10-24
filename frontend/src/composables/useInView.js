import { onBeforeUnmount, onMounted, ref } from 'vue'

// True while the element is on screen. Used to pause videos and auto-advance off screen.
export function useInView(target, { threshold = 0.35 } = {}) {
  const inView = ref(true)
  let observer = null

  onMounted(() => {
    if (!target.value || !('IntersectionObserver' in window)) return
    observer = new IntersectionObserver(([entry]) => {
      inView.value = entry.isIntersecting
    }, { threshold })
    observer.observe(target.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { inView }
}
