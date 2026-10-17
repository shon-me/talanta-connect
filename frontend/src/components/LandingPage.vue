<script setup>
import { ref, computed, onMounted, onBeforeUnmount, compile } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

// For carousel to change only when the video ends
const slide = ref(0)
const total = 3
const next = () => {
    slide.value = (slide.value + 1) % total
}

// Brands sliding effect
const brands = [
    { id: 1, name: 'Brand One', tagline: 'Short tagline', description: 'Longer description shown only when this brand is in the center.' },
    { id: 2, name: 'Brand Two', tagline: 'Short tagline', description: 'Longer description shown only when this brand is in the center.' },
    { id: 3, name: 'Brand Three', tagline: 'Short tagline', description: 'Longer description shown only when this brand is in the center.' },
    { id: 4, name: 'Brand Four', tagline: 'Short tagline', description: 'Longer description shown only when this brand is in the center.' },
    { id: 5, name: 'Brand Five', tagline: 'Short tagline', description: 'Longer description shown only when this brand is in the center.' },
    { id: 6, name: 'Brand Six', tagline: 'Short tagline', description: 'Longer description shown only when this brand is in the center.' },
]

const current = ref(0)

// One card on small screen
const visible = computed(() => {
    const n = brands.length
    const offsets = mdAndUp.value ? [-1, 0, 1] : [0]
    return offsets.map(o => ({
        brand: brands[(current.value + o + n) % n],
        isCenter: o === 0,
    }))
})

const nxt = () => { current.value = (current.value + 1) % brands.length }
const prev = () => { current.value = (current.value - 1 + brands.length) % brands.length }

// Delay of 6 to 10 seconds rendomly
let timer
function schedule() {
    clearTimeout(timer)
    timer = setTimeout(() => { nxt(); schedule() }, 6000 + Math.random() * 4000)
}
function pause() { clearTimeout(timer) }
function go(fn) { fn(); schedule() }

onMounted(schedule)
onBeforeUnmount(() => clearTimeout(timer))

//Sliding cards in the featured section
const selected = ref(0)
const creators = ref([
    { id: 1, name: 'Creator One' },
    { id: 2, name: 'Creator Two' },
    { id: 3, name: 'Creator Three' },
    { id: 4, name: 'Creator Four' },
    { id: 5, name: 'Creator Five' },
    { id: 6, name: 'Creator Six' },
    { id: 7, name: 'Creator Seven' },
    { id: 8, name: 'Creator Eight' },
])

const selectedCreator = computed(() => creators.value[selected.value])

</script>

<template>
    <!-- Head of page -->
    <v-container align="center" max-width="100%" class="ma-0 pa-0">
        <v-row class="animated-gradient">
            <v-col md="8" class="pa-0 ma-0">
                <v-carousel v-model="slide" hide-delimiters :show-arrows="false" class="pa-0 ma-0">
                    <v-carousel-item>
                        <video src="/videos/vid1.mp4" class="w-100 h-100 video-cover text-white" autoplay muted
                            playsinline @ended="next">
                            <div class="align-start d-flex flex-column position-absolute bottom-0 top-1 right-0 left-0">
                                <v-card-title>What is Talanta connnect?</v-card-title>
                            </div>
                        </video>
                    </v-carousel-item>
                    <v-carousel-item>
                        <video src="/videos/vid2.mp4" class="w-100 h-100 video-cover" autoplay muted playsinline cover
                            @ended="next"></video>
                    </v-carousel-item>
                    <v-carousel-item>
                        <video src="/videos/vid3.mp4" class="w-100 h-100 video-cover" autoplay muted playsinline cover
                            @ended="next"></video>
                    </v-carousel-item>
                </v-carousel>
            </v-col>
            <v-col md="4" class="d-flex align-center justify-center pa-4">

                <v-card max-width="80%"
                    class="glass glass-strong d-flex flex-column align-center justify-center ga-6 pa-8 w-100 h-100">
                    <v-card-title class="text-display-small">Sign up today!</v-card-title>
                    <v-card-text class="text-title-small">Don't have an account?</v-card-text>
                    <v-btn class="text-body-large">Sign up</v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <!-- Featured Brands -->
    <v-container fluid class="mt-6 mb-6 pa-0">
        <h2 class="text-display-small text-center mb-6">Featured Brands</h2>

        <div class="d-flex align-center justify-center ga-2" @mouseenter="pause" @mouseleave="schedule">
            <v-btn icon="mdi-chevron-left" variant="text" @click="go(prev)" />

            <transition-group name="brand" tag="div" class="d-flex align-center justify-center ga-4">
                <v-card v-for="item in visible" :key="item.brand.id"
                    class="glass brand-card d-flex flex-column align-center justify-center text-center pa-4"
                    :class="{ 'glass-strong': item.isCenter }" :width="item.isCenter ? 420 : 200"
                    :height="item.isCenter ? 380 : 280">
                    <v-card-title>{{ item.brand.name }}</v-card-title>

                    <template v-if="item.isCenter">
                        <v-card-subtitle>{{ item.brand.tagline }}</v-card-subtitle>
                        <v-card-text>{{ item.brand.description }}</v-card-text>
                        <v-btn>View brand</v-btn>
                    </template>
                </v-card>
            </transition-group>

            <v-btn icon="mdi-chevron-right" variant="text" @click="go(nxt)" />
        </div>
    </v-container>

    <!-- Featured creators section -->
    <v-container align="center" max-width="100%" class="mt-6 mb-6 pa-0">

        <h2 class="text-display-small text-center mb-6">Feartured Creators</h2>
        <v-sheet class="mx-auto bg-transparent" max-width="100%">
            <v-slide-group v-model="selected" show-arrows center-active>
                <v-slide-group-item v-for="creator in creators" :key="creator.id" v-slot="{ isSelected, toggle }">
                    <v-card class="d-flex flex-column align-center justify-center ma-2"
                        :class="{ 'glass-strong': isSelected }" width="260" height="300" @click="toggle">
                        <v-card-title>{{ creator.name }}</v-card-title>
                    </v-card>
                </v-slide-group-item>
            </v-slide-group>

            <v-expand-transition v-if="selected">
                <v-sheet v-if="selected != null" height="200">
                    <div class="d-flex fill-height align-center justify-center">
                        <h3 class="text-title-large my-0">
                            Selected creator: {{ selectedCreator.name }}
                        </h3>
                    </div>
                </v-sheet>
            </v-expand-transition>
        </v-sheet>
    </v-container>

    <!-- How it works -->
    <v-container class="mt-6 mb-6 pa-0">
        <h2 class="text-display-small text-center mb-6">How we work.</h2>

        <v-card class="h-100 w-100">
            <v-card-text class="text-center text-body-large">Explanation on how the platform works for both brands and
                creators. </v-card-text>
        </v-card>
    </v-container>

    <!-- Call to action -->
    <v-container>
        <h2 class="text-display-small text-center mb-6">Join us to begin your journey.</h2>

        <v-card class="h-100 w-100">
            <v-card-text class="text-center text-body-large">Call to action by our team. convince client to join. </v-card-text>
        </v-card>
    </v-container>
</template>