<script setup>
import { ref } from 'vue'
import { setFollowing } from '@/services/profileService' // BACKEND: follow / unfollow (see service)

const props = defineProps({
  kind: { type: String, required: true }, // 'brand' | 'creator'
  slug: { type: String, required: true },
  following: { type: Boolean, default: false },
})

const isFollowing = ref(props.following)
const busy = ref(false)
const toast = ref(false)
const message = ref('')

function notify(text) {
  message.value = text
  toast.value = true
}

async function toggleFollow() {
  const next = !isFollowing.value
  isFollowing.value = next // shows straight away, undone if the request fails
  busy.value = true
  try {
    await setFollowing(props.kind, props.slug, next)
  } catch {
    isFollowing.value = !next
    notify("Couldn't update that. Try again.")
  } finally {
    busy.value = false
  }
}

async function share() {
  const url = window.location.href
  try {
    if (navigator.share) {
      await navigator.share({ url }) // phones: the native share sheet
    } else {
      await navigator.clipboard.writeText(url)
      notify('Link copied')
    }
  } catch (err) {
    if (err?.name !== 'AbortError') notify("Couldn't copy the link.") // AbortError = they closed the share sheet
  }
}
</script>

<template>
  <div class="profile-actions">
    <v-btn
      :color="isFollowing ? undefined : 'secondary'"
      :variant="isFollowing ? 'outlined' : 'flat'"
      :prepend-icon="isFollowing ? 'mdi-check' : 'mdi-plus'"
      :loading="busy"
      size="large"
      rounded="lg"
      @click="toggleFollow"
    >
      {{ isFollowing ? 'Following' : 'Follow' }}
    </v-btn>
    <v-btn variant="text" prepend-icon="mdi-share-variant-outline" @click="share">Share</v-btn>

    <v-snackbar v-model="toast" timeout="2500">{{ message }}</v-snackbar>
  </div>
</template>
