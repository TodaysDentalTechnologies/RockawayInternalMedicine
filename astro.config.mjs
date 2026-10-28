// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  // URLs have no trailing slash ("/about"), as before the migration.
  trailingSlash: 'never',
  build: {
    // Flat files (about.html, services/cardiology.html), not about/index.html:
    // Amplify 301s /about -> /about/ when a folder index exists. See deploy/DEPLOY.md.
    format: 'file',
    // Inline all page CSS into the HTML: removes render-blocking stylesheet
    // requests, as on the clinic sites.
    inlineStylesheets: 'always',
  },
})
