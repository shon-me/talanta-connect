import { onBeforeUnmount, ref, watch } from 'vue'

// Downloads every hero video once, right after mount, and keeps the file in memory as a blob URL.
// The carousel can then loop forever without going back to the network.
//
// - The active slide streams from the original URL so playback starts immediately.
// - Its cached copy is swapped in only while that slide is off screen, never under a playing video.
// - If a download fails (offline, no CORS on the video host) the slide just keeps streaming.
export function useVideoPreload(urls, activeIndex) {
  const sources = ref([]) // what each <video> should use as its src
  let blobUrls = []
  let run = 0

  function release() {
    blobUrls.forEach((url) => url && URL.revokeObjectURL(url))
    blobUrls = []
  }

  function syncSources() {
    urls.value.forEach((url, i) => {
      if (i === activeIndex.value) {
        // Not cached yet? Stream it rather than leave the slide empty
        if (!sources.value[i]) sources.value[i] = url
      } else if (blobUrls[i] && sources.value[i] !== blobUrls[i]) {
        sources.value[i] = blobUrls[i]
      }
    })
  }

  async function warmCache(list, id) {
    for (let i = 0; i < list.length; i++) {
      if (id !== run) return
      try {
        const response = await fetch(list[i])
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const blob = await response.blob()
        if (id !== run) return
        blobUrls[i] = URL.createObjectURL(blob)
        syncSources()
      } catch (err) {
        console.warn('[hero] video not cached, it will stream instead:', list[i], err)
      }
    }
  }

  watch(urls, (list) => {
    release()
    run += 1
    sources.value = list.map((url, i) => (i === activeIndex.value ? url : ''))
    warmCache(list, run)
  }, { immediate: true })

  watch(activeIndex, syncSources)

  onBeforeUnmount(() => {
    run += 1
    release()
  })

  return { sources }
}
