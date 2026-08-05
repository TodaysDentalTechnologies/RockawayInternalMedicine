// Verifies every route's meta against the SEO spec:
//   title: 50–55 chars (hard cap 60) · description: 145–155 chars (hard cap 160)
// Also flags duplicate titles/descriptions across routes and duplicate FAQ
// questions inside any FAQPage schema.
// Run: node scripts/check-meta.mjs   (exit 1 on any violation)

import { build } from 'esbuild'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const TMP = join(ROOT, 'node_modules', '.meta-check')
mkdirSync(TMP, { recursive: true })
writeFileSync(join(TMP, 'entry.ts'), `export { allRoutes } from ${JSON.stringify(join(ROOT, 'src/data/seo.ts'))};\n`)
await build({ entryPoints: [join(TMP, 'entry.ts')], bundle: true, format: 'esm', platform: 'node', outfile: join(TMP, 'out.mjs'), logLevel: 'error' })
const { allRoutes } = await import(pathToFileURL(join(TMP, 'out.mjs')).href)

const routes = allRoutes()
let bad = 0
const seenTitle = new Map()
const seenDesc = new Map()

for (const r of routes) {
  const t = r.title.length
  const d = r.description.length
  const issues = []
  if (t < 50 || t > 55) issues.push(`title ${t} chars (want 50–55): "${r.title}"`)
  if (d < 145 || d > 155) issues.push(`desc ${d} chars (want 145–155): "${r.description}"`)
  if (seenTitle.has(r.title)) issues.push(`title duplicates ${seenTitle.get(r.title)}`)
  if (seenDesc.has(r.description)) issues.push(`desc duplicates ${seenDesc.get(r.description)}`)
  seenTitle.set(r.title, r.path)
  seenDesc.set(r.description, r.path)

  for (const s of r.schema) {
    if (s && s['@type'] === 'FAQPage') {
      const names = (s.mainEntity || []).map((q) => q.name.trim().toLowerCase())
      const dupes = names.filter((n, i) => names.indexOf(n) !== i)
      if (dupes.length) issues.push(`FAQPage has duplicate questions: ${dupes.join(' | ')}`)
    }
  }

  if (issues.length) {
    bad++
    console.log(`✗ ${r.path}`)
    for (const i of issues) console.log(`    ${i}`)
  }
}

rmSync(TMP, { recursive: true, force: true })
console.log(bad === 0 ? `✅ all ${routes.length} routes pass (titles 50–55, descriptions 145–155, no duplicates)` : `\n${bad}/${routes.length} routes FAIL`)
process.exit(bad === 0 ? 0 : 1)
