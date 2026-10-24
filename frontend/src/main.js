import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Fonts (self-hosted). Install: npm i @fontsource-variable/unbounded @fontsource-variable/figtree
import '@fontsource-variable/unbounded'
import '@fontsource-variable/figtree'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Custom css styling linking
// Keep this AFTER vuetify/styles so our rules win when specificity is equal
import './main.css'


const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: "#1F70EA",
          secondary: "#FF8C00",
          accent1: "#FF3D00",
          accent2: "#FFC300",
          accent3: "#2a9d8f",
          accent4: "#005f73",
        },
      },
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)

app.mount('#app')
