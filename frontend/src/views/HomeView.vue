<script setup>
import HeroSection from './home/HeroSection.vue'
import FeaturedBrands from './home/FeaturedBrands.vue'
import FeaturedCreators from './home/FeaturedCreators.vue'
import JoinCta from './home/JoinCta.vue'

// BACKEND (optional): the three sections each make their own request. If you want one round trip
// instead, expose GET /api/home/ returning { hero_slides, featured_brands, featured_creators }
// and load it here, passing the pieces down as props.
</script>

<template>
  <div class="home">
    <HeroSection />
    <FeaturedBrands />
    <FeaturedCreators />
    <JoinCta />
  </div>
</template>
