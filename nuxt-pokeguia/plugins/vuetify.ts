import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
    ssr: true,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: { dark: false, colors: { primary: '#764ba2' } },
        dark: { dark: true, colors: { primary: '#764ba2' } }
      }
    }
  })
  nuxtApp.vueApp.use(vuetify)
})
