<script setup>
import { computed, reactive, ref, watch } from 'vue'
import DashCard from '@/components/dashboard/DashCard.vue'
import LoadState from '@/components/dashboard/LoadState.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import { useAction } from '@/composables/useAction'
import { useAsyncData } from '@/composables/useAsyncData'
import { fetchLandingContent, saveLandingContent } from '@/services/adminService' // BACKEND: landing content (see service)
import { rules } from '@/utils/validators'

const { data, loading, error, reload } = useAsyncData(fetchLandingContent, null)
const { busy, run } = useAction()

const formRef = ref(null)
const form = reactive({ hero: [], cta: { title: '', lead: '' }, featuredBrandIds: [], featuredCreatorIds: [] })
const saved = ref('')

const snapshot = () => JSON.stringify({ hero: form.hero, cta: form.cta, b: form.featuredBrandIds, c: form.featuredCreatorIds })
watch(data, (d) => {
  if (!d) return
  Object.assign(form, { hero: d.hero, cta: d.cta, featuredBrandIds: d.featuredBrandIds, featuredCreatorIds: d.featuredCreatorIds })
  saved.value = snapshot()
})
const changed = computed(() => !!data.value && snapshot() !== saved.value)

async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  const { ok } = await run(
    () => saveLandingContent({ hero: form.hero, cta: form.cta, featuredBrandIds: form.featuredBrandIds, featuredCreatorIds: form.featuredCreatorIds }),
    'Landing page updated.',
  )
  if (ok) saved.value = snapshot()
}
</script>

<template>
  <PageHeader title="Landing page editor" lead="Change the words and the featured brands and creators visitors see on the landing page.">
    <v-btn variant="outlined" color="primary" rounded="lg" :disabled="!changed || busy" @click="reload">Discard changes</v-btn>
    <v-btn color="secondary" rounded="lg" size="large" :disabled="!changed" :loading="busy" @click="save">Publish changes</v-btn>
  </PageHeader>

  <LoadState :loading="loading" :error="error" @retry="reload">
    <v-form v-if="data" ref="formRef" class="dash-stack" validate-on="blur" @submit.prevent="save">
      <DashCard title="Hero slides" subtitle="The text over each video at the top of the page. The videos are managed in the media library.">
        <div v-for="(slide, i) in form.hero" :key="slide.id" class="dash-form dash-form--block">
          <p class="dash-form__label">Slide {{ i + 1 }}</p>
          <v-text-field v-model="slide.title" label="Title" :rules="[rules.required('Title')]" variant="outlined" density="comfortable" rounded="lg" />
          <v-textarea v-model="slide.subtitle" label="Text under the title" rows="2" auto-grow :rules="[rules.required('Text')]" variant="outlined" density="comfortable" rounded="lg" />
        </div>
      </DashCard>

      <DashCard title="Featured brands" subtitle="Shown in the carousel. The first one you pick comes first.">
        <v-autocomplete v-model="form.featuredBrandIds" :items="data.brands" item-title="name" item-value="id" label="Brands" multiple chips closable-chips variant="outlined" density="comfortable" rounded="lg" />
      </DashCard>

      <DashCard title="Featured creators" subtitle="Shown in the 2 by 2 grid. Four fit best.">
        <v-autocomplete v-model="form.featuredCreatorIds" :items="data.creators" item-title="name" item-value="id" label="Creators" multiple chips closable-chips variant="outlined" density="comfortable" rounded="lg" />
      </DashCard>

      <DashCard title="Call to action" subtitle="The closing section that asks people to join.">
        <div class="dash-form">
          <v-text-field v-model="form.cta.title" label="Heading" :rules="[rules.required('Heading')]" variant="outlined" density="comfortable" rounded="lg" />
          <v-textarea v-model="form.cta.lead" label="Text" rows="2" auto-grow :rules="[rules.required('Text')]" variant="outlined" density="comfortable" rounded="lg" />
        </div>
      </DashCard>
    </v-form>
  </LoadState>
</template>
