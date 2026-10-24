<script setup>
import AppLogo from '@/components/ui/AppLogo.vue'
import { footerColumns, socialLinks } from '@/constants/navigation'
import { prefersReducedMotion } from '@/utils/motion'

const year = new Date().getFullYear()

function backToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <div class="app-footer__grid">
        <div class="app-footer__brand">
          <AppLogo />
          <p class="app-footer__tagline">
            A community where creators and brands meet, collaborate and grow.
          </p>
          <div class="app-footer__social">
            <v-btn
              v-for="social in socialLinks"
              :key="social.label"
              :icon="social.icon"
              :href="social.href"
              :aria-label="social.label"
              target="_blank"
              rel="noopener noreferrer"
              color="white"
              variant="text"
              size="small"
            />
          </div>
        </div>

        <nav v-for="column in footerColumns" :key="column.title" :aria-label="column.title">
          <h2 class="app-footer__title">{{ column.title }}</h2>
          <ul class="app-footer__links">
            <li v-for="link in column.links" :key="link.to">
              <router-link :to="link.to" class="app-footer__link">{{ link.label }}</router-link>
            </li>
          </ul>
        </nav>
      </div>

      <div class="app-footer__bottom">
        <p class="app-footer__copy">&copy; {{ year }} Talanta Connect. All rights reserved.</p>
        <v-btn color="white" variant="text" size="small" prepend-icon="mdi-arrow-up" @click="backToTop">
          Back to top
        </v-btn>
      </div>
    </div>
  </footer>
</template>
