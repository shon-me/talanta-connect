<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  fallback: { type: String, default: '/' }, // where to go when the page was opened directly
  label: { type: String, default: 'Back' },
})

const router = useRouter()

function goBack() {
  // vue-router keeps the previous address in history.state.back when there is one inside the app
  if (window.history.state?.back) router.back()
  else router.push(props.fallback)
}
</script>

<template>
  <v-btn class="back-button" variant="text" prepend-icon="mdi-arrow-left" @click="goBack">
    {{ label }}
  </v-btn>
</template>
