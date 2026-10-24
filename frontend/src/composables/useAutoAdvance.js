import { onBeforeUnmount } from 'vue'

// Calls `callback` every min..max milliseconds (random delay each time).
// start() also restarts the timer, so call it after a manual click or swipe.
export function useAutoAdvance(callback, { min = 6000, max = 10000, enabled = true } = {}) {
  let timer = null

  function stop() {
    clearTimeout(timer)
    timer = null
  }

  function start() {
    stop()
    if (!enabled) return
    timer = setTimeout(() => {
      callback()
      start()
    }, min + Math.random() * (max - min))
  }

  onBeforeUnmount(stop)

  return { start, stop }
}
