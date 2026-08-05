import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_URL, routeMeta } from '../data/seo'

interface SeoProps {
  /** Fallback <title> if the route is not in the central manifest. */
  title: string
  description?: string
  /** Canonical path, e.g. "/services/cardiology". */
  path?: string
  /** og:image — absolute URL or site-relative path. Defaults to the logo. */
  image?: string
  /** og:type — "website" (default) or "article". */
  type?: 'website' | 'article'
  /** JSON-LD schema objects to embed (one <script> each). */
  schema?: object[]
}

// Attribute that marks the JSON-LD this app owns; the prerender writes the same
// marked tags into each route's static HTML.
const MARK = 'data-rim-jsonld'

// Matches the prerender's serialization exactly (escaped "<"), so the
// byte-equality check below always passes on first load of a prerendered page.
const serialize = (s: object) => JSON.stringify(s).replace(/</g, '\\u003c')

// ── head upsert helpers ─────────────────────────────────────────
// The head tags are UPDATED in place (never re-added), which is what guarantees
// exactly ONE <meta name="description">, one canonical, one og:* set per page —
// whether the tag came from the prerendered HTML or is created on first mount.
function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo(props: SeoProps) {
  const { pathname } = useLocation()

  // Central manifest wins (same strings the prerender bakes into the HTML, and
  // the same strings scripts/check-meta.mjs validates); page props are only a
  // fallback for routes missing from the manifest.
  const central = routeMeta(pathname)
  const title = central?.title ?? props.title
  const description = central?.description ?? props.description
  const path = central?.path ?? props.path
  const image = central?.image ?? props.image
  const type = central?.type ?? props.type ?? 'website'
  const schema = central?.schema ?? props.schema ?? []

  const canonical = path ? `${SITE_URL}${path}` : undefined
  const ogImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : `${SITE_URL}/images/logo.png`

  const json = JSON.stringify(schema)
  useEffect(() => {
    document.title = title
    if (description) {
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:description', description)
      upsertMeta('name', 'twitter:description', description)
    }
    if (canonical) {
      upsertCanonical(canonical)
      upsertMeta('property', 'og:url', canonical)
    }
    upsertMeta('property', 'og:site_name', 'Rockaway Internal Medicine')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:image', ogImage)

    // JSON-LD: leave the prerendered scripts untouched when they already match
    // (byte-equal serialization), so validators never double-count; replace only
    // on real client-side route changes.
    const desired = schema.map(serialize)
    const existing = Array.from(document.querySelectorAll(`script[${MARK}]`))
    const unchanged =
      existing.length === desired.length && desired.every((d, i) => existing[i].textContent === d)
    if (!unchanged) {
      existing.forEach((el) => el.remove())
      for (const d of desired) {
        const el = document.createElement('script')
        el.type = 'application/ld+json'
        el.setAttribute(MARK, '')
        el.textContent = d
        document.head.appendChild(el)
      }
    }
    // json/title/description/canonical capture everything this effect writes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json, title, description, canonical, ogImage, type])

  return null
}
