import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../data/seo'

interface SeoProps {
  /** Full <title> for the page. */
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

// Attribute that marks the JSON-LD this app owns. The build-time prerender
// (scripts/prerender.mjs) writes the same tag into each route's static HTML;
// on mount we remove any existing ones and re-add the current route's schema,
// so a prerendered page and its hydrated client never emit duplicate JSON-LD.
const MARK = 'data-rim-jsonld'

export default function Seo({ title, description, path, image, type = 'website', schema = [] }: SeoProps) {
  const canonical = path ? `${SITE_URL}${path}` : undefined
  const ogImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : `${SITE_URL}/images/logo.png`

  const json = JSON.stringify(schema)
  useEffect(() => {
    document.querySelectorAll(`script[${MARK}]`).forEach((el) => el.remove())
    for (const s of schema) {
      const el = document.createElement('script')
      el.type = 'application/ld+json'
      el.setAttribute(MARK, '')
      el.textContent = JSON.stringify(s)
      document.head.appendChild(el)
    }
    // `json` is the serialized form of `schema`; it changes exactly when the
    // route's structured data changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json])

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      <meta property="og:site_name" content="Rockaway Internal Medicine" />
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:type" content={type} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
