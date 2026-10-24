import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { prefersReducedMotion } from '@/utils/motion'

// State and playback for a carousel of stacked <video> elements.
// The slide changes when its video ends (and wraps to the first one), so the loop never stops.
export function useVideoCarousel(slideCount, { transitionMs = 1000 } = {}) {
  const active = ref(0)
  const leaving = ref(null)
  const progress = ref(0)                         // 0..100 for the active video
  const playing = ref(!prefersReducedMotion())    // the viewer's play/pause choice
  const inView = ref(true)                        // false while scrolled out of view

  const videos = []
  let cleanupTimer = null

  const setVideo = (el, i) => { videos[i] = el }
  const activeVideo = () => videos[active.value]

  function play() {
    if (!playing.value || !inView.value) return
    activeVideo()?.play()?.catch(() => {}) // a rejected play() just means the browser blocked or interrupted it
  }

  function goTo(index) {
    const n = slideCount.value
    if (!n) return
    const target = ((index % n) + n) % n
    if (target === active.value) return
    leaving.value = active.value
    active.value = target
  }

  const next = () => goTo(active.value + 1)

  watch(active, async () => {
    progress.value = 0
    await nextTick()
    const el = activeVideo()
    if (el) el.currentTime = 0
    play()

    // Let the old video keep playing under the fade, then stop everything that is not active
    clearTimeout(cleanupTimer)
    cleanupTimer = setTimeout(() => {
      videos.forEach((video, i) => { if (video && i !== active.value) video.pause() })
      leaving.value = null
    }, transitionMs)
  })

  // <video> events
  const onCanPlay = (i) => {
    if (i === active.value && videos[i]?.paused) play()
  }

  const onEnded = (i) => {
    if (i !== active.value) return
    if (slideCount.value > 1) {
      next()
    } else {
      videos[i].currentTime = 0
      play()
    }
  }

  const onTimeUpdate = (i) => {
    if (i !== active.value) return
    const { currentTime, duration } = videos[i]
    progress.value = duration ? (currentTime / duration) * 100 : 0
  }

  // A broken file should not freeze the carousel
  const onError = (i) => {
    if (i === active.value && slideCount.value > 1) setTimeout(next, 1500)
  }

  function toggle() {
    playing.value = !playing.value
    if (playing.value) play()
    else activeVideo()?.pause()
  }

  function setInView(visible) {
    inView.value = visible
    if (visible) play()
    else activeVideo()?.pause()
  }

  // Value for the indicator bars: finished slides full, current one live, upcoming ones empty
  const barValue = (i) => (i < active.value ? 100 : i === active.value ? progress.value : 0)

  onBeforeUnmount(() => clearTimeout(cleanupTimer))

  return {
    active, leaving, playing,
    setVideo, goTo, next, toggle, setInView, barValue,
    onCanPlay, onEnded, onTimeUpdate, onError,
  }
}
