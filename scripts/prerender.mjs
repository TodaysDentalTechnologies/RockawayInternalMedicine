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
  writeFileSync(entry, `export { allRoutes, SITE_URL } from ${JSON.stringify(join(ROOT, 'src/data/seo.ts'))};\n`)
  const out = join(TMP, 'seo.mjs')
  await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
  return import(pathToFileURL(out).href)
}

const escapeText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
// JSON-LD lives inside <script>, so the only thing that must be escaped is a
// sequence that could close the tag early.
const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c')

const { allRoutes, SITE_URL } = await loadSeo()

// Strip any previously injected head tags (JSON-LD + meta) so re-running this
// script is idempotent (the home route writes back to dist/index.html, which is
// also the template).
const template = readFileSync(join(DIST, 'index.html'), 'utf8')
  .replace(/\s*<script type="application\/ld\+json" data-rim-jsonld[^>]*>[\s\S]*?<\/script>/g, '')
  .replace(/\s*<(?:meta|link)[^>]* data-rim-head[^>]*\/?>/g, '')
if (!template.includes('</head>')) throw new Error('dist/index.html has no </head> to inject into')

const routes = allRoutes()
let written = 0

for (const route of routes) {
  const canonical = `${SITE_URL}${route.path}`
  const ogImage = route.image
    ? route.image.startsWith('http')
      ? route.image
      : `${SITE_URL}${route.image}`
    : `${SITE_URL}/images/logo.png`
  const ogType = route.type || 'website'

  // Exactly ONE of each meta tag per page — this is the only injector, the
  // template carries none, and the runtime <Seo> updates these same tags
  // in place rather than adding new ones.
  const head = [
    `<meta name="description" content="${escapeAttr(route.description)}" data-rim-head />`,
    `<link rel="canonical" href="${escapeAttr(canonical)}" data-rim-head />`,
    `<meta property="og:site_name" content="Rockaway Internal Medicine" data-rim-head />`,
    `<meta property="og:title" content="${escapeAttr(route.title)}" data-rim-head />`,
    `<meta property="og:description" content="${escapeAttr(route.description)}" data-rim-head />`,
    `<meta property="og:type" content="${ogType}" data-rim-head />`,
    `<meta property="og:url" content="${escapeAttr(canonical)}" data-rim-head />`,
    `<meta property="og:image" content="${escapeAttr(ogImage)}" data-rim-head />`,
    `<meta name="twitter:card" content="summary_large_image" data-rim-head />`,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" data-rim-head />`,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" data-rim-head />`,
    `<meta name="twitter:image" content="${escapeAttr(ogImage)}" data-rim-head />`,
  ].join('\n    ')

  const scripts = route.schema
    .map((s) => `<script type="application/ld+json" data-rim-jsonld>${jsonLd(s)}</script>`)
    .join('\n    ')

  // Function replacers: a plain string replacement would interpret `$` patterns
  // ($$, $&, …) inside the JSON-LD and corrupt it.
  let html = template.replace('</head>', () => `  ${head}\n    ${scripts}\n  </head>`)
  if (route.title && /<title>.*?<\/title>/s.test(html)) {
    html = html.replace(/<title>.*?<\/title>/s, () => `<title>${escapeText(route.title)}</title>`)
  }

  // "/" stays dist/index.html; "/services/cardiology" -> dist/services/cardiology.html
  //
  // FLAT files, not <route>/index.html: Amplify Hosting 301s /about -> /about/
  // whenever about/index.html exists (its directory-index rule), which is the
  // opposite of the canonical form. With about.html it serves /about at 200 and
  // never redirects; the "/<*>/ -> /<*>" rule in deploy/amplify-custom-rules.json
  // strips the slash off anyone arriving at the old form.
  const file = route.path === '/' ? join(DIST, 'index.html') : join(DIST, `${route.path}.html`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  written++
}

// Generate sitemap.xml from the same route manifest so URLs can never drift
// (non-www, no trailing slash — root "/" is the one exception).
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map((r) => `  <url><loc>${SITE_URL}${r.path}</loc></url>`).join('\n') +
  `\n</urlset>\n`
writeFileSync(join(DIST, 'sitemap.xml'), sitemap)

rmSync(TMP, { recursive: true, force: true })
console.log(`prerendered ${written} routes with structured data; sitemap has ${routes.length} urls`)
