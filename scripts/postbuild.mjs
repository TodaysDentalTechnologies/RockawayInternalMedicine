// Post-build step: writes dist/sitemap.xml and dist/amplify-custom-rules.json
// from the route manifest in src/data/seo.ts (allRoutes), so neither can drift
// from the pages that exist. Astro builds the pages themselves; this replaces
// the sitemap and rules half of the old scripts/prerender.mjs.

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

// Amplify custom rules, generated from the same route manifest so they can
// never drift from the pages that exist. Apply with:
//   aws amplify update-app --app-id djn8uddcmh0dt \
//     --custom-rules file://dist/amplify-custom-rules.json \
//     --profile shivashamtoub --region us-east-1
//
// Order matters — Amplify takes the first match. There is deliberately no
// `/<*>/` catch-all: Amplify rejects a wildcard followed by "/" ("The wildcard
// pattern in custom rules expression is invalid when followed by a `/`"), so
// each route needs its own slash-stripping 301.
//
// Apply these ONLY against a build that has already shipped the flat <path>.html
// artifacts. Against folder artifacts, Amplify's implicit /x -> /x/ plus these
// /x/ -> /x rules is an infinite redirect loop.
const WWW = `https://www.${new URL(SITE_URL).host}`
const customRules = [
  // www -> apex. The source is a bare host with NO path wildcard: Amplify
  // preserves the request path automatically, and the obvious
  // `https://www.host/<*>` -> `https://host/<*>` form silently never fires
  // (verified against this app — every www URL kept serving 200).
  // The root needs its own rule; the bare-host rule alone does not cover "/".
  { source: `${WWW}/`, target: `${SITE_URL}/`, status: '301' },
  { source: WWW, target: SITE_URL, status: '301' },
  // Trailing slash -> canonical no-slash form, one rule per route.
  ...routes
    .filter((r) => r.path !== '/')
    .map((r) => ({ source: `${r.path}/`, target: r.path, status: '301' })),
  // SPA fallback for anything that is not a real artifact. Must stay last.
  { source: '/<*>', target: '/index.html', status: '404-200' },
]
writeFileSync(join(DIST, 'amplify-custom-rules.json'), `${JSON.stringify(customRules, null, 2)}\n`)

// Generate sitemap.xml from the same route manifest so URLs can never drift
// (non-www, no trailing slash — root "/" is the one exception).
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map((r) => `  <url><loc>${SITE_URL}${r.path}</loc></url>`).join('\n') +
  `\n</urlset>\n`
writeFileSync(join(DIST, 'sitemap.xml'), sitemap)

rmSync(TMP, { recursive: true, force: true })
console.log(`sitemap has ${routes.length} urls; wrote amplify-custom-rules.json`)
