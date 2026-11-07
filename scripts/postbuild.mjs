// Post-build step: writes dist/sitemap.xml from the route manifest in
// src/data/seo.ts (allRoutes), so it can't drift from the pages that exist.
// Astro builds the pages themselves; this replaces the sitemap half of the old
// scripts/prerender.mjs. URL rules live in infra/cloudfront/url-rules.js.

import { build } from 'esbuild'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const DIST = join(ROOT, 'dist')
const TMP = join(ROOT, 'node_modules', '.rim-postbuild')

// Bundle seo.ts (and its pure-data deps) so this plain-Node script can read the
// same route manifest the pages use.
async function loadSeo() {
  mkdirSync(TMP, { recursive: true })
  const entry = join(TMP, 'entry.ts')
  writeFileSync(entry, `export { allRoutes, SITE_URL } from ${JSON.stringify(join(ROOT, 'src/data/seo.ts'))};\n`)
  const out = join(TMP, 'seo.mjs')
  await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
  return import(pathToFileURL(out).href)
}

const { allRoutes, SITE_URL } = await loadSeo()
const routes = allRoutes()

// Generate sitemap.xml from the same route manifest so URLs can never drift
// (non-www, no trailing slash — root "/" is the one exception).
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map((r) => `  <url><loc>${SITE_URL}${r.path}</loc></url>`).join('\n') +
  `\n</urlset>\n`
writeFileSync(join(DIST, 'sitemap.xml'), sitemap)

rmSync(TMP, { recursive: true, force: true })
console.log(`sitemap has ${routes.length} urls`)
