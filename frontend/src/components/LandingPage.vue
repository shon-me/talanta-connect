<script setup>
import { ref } from 'vue'

// For carousel to change only when the video ends
const slide = ref(0)
const total = 3
const next =()=>{
    slide.value = (slide.value + 1) % total
}

</script>

<template>
    <v-container max-width="100%" class="ma-0 pa-0">
        <v-row class="bg-primary">
            <v-col md="6" class="pa-0 ma-0">
                <v-carousel v-model="slide" cycle hide-delimiters :show-arrows="false" class="pa-0 ma-0">
                    <v-carousel-item>
                        <video src="/videos/vid1.mp4" class="w-100 h-100 video-cover ma-0" autoplay muted playsinline @ended="next"></video>
                    </v-carousel-item>
                    <v-carousel-item>
                        <video src="/videos/vid2.mp4" class="w-100 h-100 video-cover ma-0" autoplay muted playsinline cover @ended="next"></video>
                    </v-carousel-item>
                    <v-carousel-item>
                        <video src="/videos/vid3.mp4" class="w-100 h-100 video-cover ma-0" autoplay muted playsinline cover @ended="next"></video>
                    </v-carousel-item>
                </v-carousel>
            </v-col>
            <v-col md="6" class="ma-0">
                <v-card class="h-100 ma-0">
                    <v-card-title>Sign up today!</v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    
    <v-container>
        <v-row>
            <v-col>
                <V-card class="glass" height="300" width="300">
                </V-card>
            </v-col>
        </v-row>
    </v-container>
</template>