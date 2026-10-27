// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  build: {
    // Inline all page CSS into the HTML: removes render-blocking stylesheet
    // requests, as on the clinic sites.
    inlineStylesheets: 'always',
  },
})
