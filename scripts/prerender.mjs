// Post-build step: give every route its own static HTML file with its JSON-LD
// baked into <head>. The body still hydrates client-side — this only prerenders
// the structured data (and <title>), which is what the Rich Results Test and
// crawlers need to see without executing JavaScript.
//
// The route list + schema come straight from src/data/seo.ts (allRoutes), so the
// prerendered markup can never drift from what the pages render at runtime.

import { build } from 'esbuild'
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const DIST = join(ROOT, 'dist')
const TMP = join(ROOT, 'node_modules', '.rim-prerender')

// Bundle seo.ts (and its pure-data deps) so this plain-Node script can call the
// same schema builders the app uses.
async function loadSeo() {
  mkdirSync(TMP, { recursive: true })
  const entry = join(TMP, 'entry.ts')
  writeFileSync(entry, `export { allRoutes } from ${JSON.stringify(join(ROOT, 'src/data/seo.ts'))};\n`)
  const out = join(TMP, 'seo.mjs')
  await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
  return import(pathToFileURL(out).href)
}

const escapeText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// JSON-LD lives inside <script>, so the only thing that must be escaped is a
// sequence that could close the tag early.
const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c')

const { allRoutes } = await loadSeo()

const template = readFileSync(join(DIST, 'index.html'), 'utf8')
if (!template.includes('</head>')) throw new Error('dist/index.html has no </head> to inject into')

const routes = allRoutes()
let written = 0

for (const route of routes) {
  const scripts = route.schema
    .map((s) => `<script type="application/ld+json" data-rim-jsonld>${jsonLd(s)}</script>`)
    .join('\n    ')

  let html = template.replace('</head>', `  ${scripts}\n  </head>`)
  if (route.title && /<title>.*?<\/title>/s.test(html)) {
    html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeText(route.title)}</title>`)
  }

  // "/" stays dist/index.html; "/services/cardiology" -> dist/services/cardiology/index.html
  const file = route.path === '/' ? join(DIST, 'index.html') : join(DIST, route.path, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  written++
}

rmSync(TMP, { recursive: true, force: true })
console.log(`prerendered ${written} routes with structured data`)
