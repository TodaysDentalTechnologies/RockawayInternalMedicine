// Generates a spec-compliant <title> and <meta name="description"> for every
// route that currently FAILS scripts/check-meta.mjs, and writes the results to
// src/data/generated-meta.ts — the fallback layer src/data/seo.ts reads when a
// route has no hand-written entry in SERVICE_META / LOCATION_META / POST_META.
//
// This is what keeps new content (a blog post added to src/data/blog.ts, a new
// service) from shipping the "<page title> | <brand>" fallback, which is what
// produced the 97-character title Ahrefs flagged.
//
// Run:  ANTHROPIC_API_KEY=sk-ant-... node scripts/gen-meta.mjs
//       node scripts/gen-meta.mjs --self-test   (offline; checks parse + validate)
//
// Review the generated copy before committing — it is a first draft.

import Anthropic from '@anthropic-ai/sdk'
import { build } from 'esbuild'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const OUT = join(ROOT, 'src/data/generated-meta.ts')

// Same spec scripts/check-meta.mjs enforces.
const TITLE_MIN = 50
const TITLE_MAX = 55
const DESC_MIN = 145
const DESC_MAX = 155

const SYSTEM = `You are an SEO copywriter. Given a page URL (and optionally its existing meta tags), generate an optimized <title> tag and <meta name="description"> tag in valid HTML.

Steps:
1. Parse the URL path/slug to identify the primary keyword and key entities (service type, location/city, brand name if present in domain or slug).
2. If existing title/description are provided and non-empty, use them as supporting context to preserve important differentiators (e.g. "same-day treatment", "walk-ins welcome", insurance accepted) — but the URL-derived keyword is the primary source of truth for topic and intent.
3. If existing tags are empty or not provided, generate entirely from the URL-derived keyword and entities alone.
4. Write a title and description optimized around that primary keyword.

Requirements:
- Title: strictly ${TITLE_MIN}–${TITLE_MAX} characters (never exceed 60), primary keyword near the start, specific and compelling (not generic).
- Description: strictly ${DESC_MIN}–${DESC_MAX} characters (never exceed 160), primary keyword included naturally, retain key differentiators if known, soft call-to-action if space allows.
- Escape special characters properly for HTML (e.g. &amp; for "&").
- No duplicate phrasing between title and description. No mid-word truncation. No quotation marks around the whole tag content.
- If existing tags are already well-optimized and within limits, refine lightly rather than rewriting from scratch.
- If the URL slug is vague/non-descriptive (e.g. numeric ID, no clear keyword) and no existing tags are provided, make a best-effort generic title/description based on the domain name only, and do not fabricate specific services or claims not evidenced by the URL or domain.

Output ONLY the following two lines, nothing else — no explanation, no markdown, no code fences:

<title>{generated title}</title>
<meta name="description" content="{generated description}">`

const userPrompt = (url, title, description) =>
  `Page URL: ${url}\nExisting <title> (may be empty): ${title ?? ''}\nExisting <meta name="description" content="..."> (may be empty): ${description ?? ''}`

// ── parse + validate ────────────────────────────────────────────
// The model is asked for HTML-escaped output, but these strings are stored as
// plain TS and escaped again at render time by scripts/prerender.mjs. Undo the
// escaping here or "&" ships as "&amp;amp;".
const unescapeHtml = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')

export function parse(text) {
  const title = text.match(/<title>([\s\S]*?)<\/title>/i)?.[1]
  const description = text.match(/<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/?>/i)?.[1]
  if (title == null || description == null) return null
  return { title: unescapeHtml(title.trim()), description: unescapeHtml(description.trim()) }
}

/** Returns [] when the pair is acceptable, else human-readable problems to feed back to the model. */
export function validate({ title, description }, { titles = new Set(), descriptions = new Set() } = {}) {
  const problems = []
  if (title.length < TITLE_MIN || title.length > TITLE_MAX)
    problems.push(`The title is ${title.length} characters; it must be ${TITLE_MIN}–${TITLE_MAX}.`)
  if (description.length < DESC_MIN || description.length > DESC_MAX)
    problems.push(`The description is ${description.length} characters; it must be ${DESC_MIN}–${DESC_MAX}.`)
  if (titles.has(title)) problems.push('That title is already used by another page on this site. Write a different one.')
  if (descriptions.has(description))
    problems.push('That description is already used by another page on this site. Write a different one.')
  return problems
}

// ── offline self-test ───────────────────────────────────────────
if (process.argv.includes('--self-test')) {
  const assert = (cond, msg) => {
    if (!cond) throw new Error(`self-test failed: ${msg}`)
  }
  const ok = parse(
    '<title>Cardiology in Queens NY | Rockaway Internal Medicine</title>\n<meta name="description" content="Heart care in Jamaica &amp; Cambria Heights.">',
  )
  assert(ok, 'well-formed output should parse')
  assert(ok.title === 'Cardiology in Queens NY | Rockaway Internal Medicine', 'title text')
  assert(ok.description === 'Heart care in Jamaica & Cambria Heights.', '&amp; should be unescaped')
  assert(parse('here you go!') === null, 'prose with no tags should not parse')
  assert(parse('<title>Only a title</title>') === null, 'a missing description should not parse')

  const good = { title: 'x'.repeat(52), description: 'y'.repeat(150) }
  assert(validate(good).length === 0, 'in-spec pair should pass')
  assert(validate({ ...good, title: 'x'.repeat(97) }).length === 1, 'a 97-char title should fail')
  assert(validate({ ...good, description: 'y'.repeat(192) }).length === 1, 'a 192-char description should fail')
  assert(validate(good, { titles: new Set([good.title]) }).length === 1, 'a duplicate title should fail')
  console.log('✅ gen-meta self-test passed')
  process.exit(0)
}

// ── load the route manifest ─────────────────────────────────────
// Bundle seo.ts so this plain-Node script sees exactly the routes the build
// ships, including whatever generated-meta.ts already holds.
const TMP = join(ROOT, 'node_modules', '.gen-meta')
mkdirSync(TMP, { recursive: true })
writeFileSync(
  join(TMP, 'entry.ts'),
  `export { allRoutes, SITE_URL } from ${JSON.stringify(join(ROOT, 'src/data/seo.ts'))};\n` +
    `export { GENERATED_META } from ${JSON.stringify(join(ROOT, 'src/data/generated-meta.ts'))};\n`,
)
await build({
  entryPoints: [join(TMP, 'entry.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: join(TMP, 'out.mjs'),
  logLevel: 'error',
})
const { allRoutes, SITE_URL, GENERATED_META } = await import(pathToFileURL(join(TMP, 'out.mjs')).href)
rmSync(TMP, { recursive: true, force: true })

const routes = allRoutes()
const failing = routes.filter((r) => validate(r).length > 0)

if (failing.length === 0) {
  console.log(`✅ all ${routes.length} routes already meet the spec — nothing to generate`)
  process.exit(0)
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    `${failing.length} route(s) need meta, but ANTHROPIC_API_KEY is not set:\n` +
      failing.map((r) => `  ${r.path}`).join('\n') +
      `\n\nRun: ANTHROPIC_API_KEY=sk-ant-... node scripts/gen-meta.mjs`,
  )
  process.exit(1)
}

// Every title/description already in use, so the model never produces a duplicate.
const takenTitles = new Set(routes.filter((r) => !failing.includes(r)).map((r) => r.title))
const takenDescriptions = new Set(routes.filter((r) => !failing.includes(r)).map((r) => r.description))

const client = new Anthropic()

/** Up to `attempts` tries, feeding the exact character counts back on each miss. */
async function generate(route) {
  const messages = [{ role: 'user', content: userPrompt(`${SITE_URL}${route.path}`, route.title, route.description) }]

  for (let attempt = 1; attempt <= 4; attempt++) {
    const response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 4000,
      system: SYSTEM,
      output_config: { effort: 'medium' },
      messages,
    })

    if (response.stop_reason === 'refusal') throw new Error(`refused for ${route.path}`)

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')

    const parsed = parse(text)
    const problems = parsed
      ? validate(parsed, { titles: takenTitles, descriptions: takenDescriptions })
      : ['Your reply was not in the required format. Output ONLY the two tag lines.']

    if (parsed && problems.length === 0) return parsed

    console.log(`  attempt ${attempt}: ${problems.join(' ')}`)
    messages.push(
      { role: 'assistant', content: text },
      { role: 'user', content: `${problems.join('\n')}\n\nCount the characters and try again. Output ONLY the two tag lines.` },
    )
  }
  throw new Error(`could not produce in-spec meta for ${route.path} after 4 attempts`)
}

const generated = { ...GENERATED_META }
for (const route of failing) {
  console.log(`generating ${route.path}`)
  const meta = await generate(route)
  generated[route.path] = meta
  takenTitles.add(meta.title)
  takenDescriptions.add(meta.description)
  console.log(`  title (${meta.title.length}) ${meta.title}`)
  console.log(`  desc  (${meta.description.length}) ${meta.description}`)
}

const q = (s) => JSON.stringify(s)
const body = Object.keys(generated)
  .sort()
  .map((path) => `  ${q(path)}: {\n    title: ${q(generated[path].title)},\n    description: ${q(generated[path].description)},\n  },`)
  .join('\n')

writeFileSync(
  OUT,
  `// GENERATED by scripts/gen-meta.mjs — safe to edit by hand, but a re-run\n` +
    `// preserves entries and only regenerates routes that fail the spec.\n` +
    `//\n` +
    `// Fallback meta for routes with no hand-written entry in the SERVICE_META /\n` +
    `// LOCATION_META / POST_META maps in ./seo.ts. Review before committing.\n` +
    `export const GENERATED_META: Record<string, { title: string; description: string }> = {\n${body}\n}\n`,
)

console.log(`\nwrote ${OUT} (${Object.keys(generated).length} routes) — run node scripts/check-meta.mjs to confirm`)
