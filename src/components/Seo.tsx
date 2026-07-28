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

export default function Seo({ title, description, path, image, type = 'website', schema = [] }: SeoProps) {
  const canonical = path ? `${SITE_URL}${path}` : undefined
  const ogImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : `${SITE_URL}/images/logo.png`

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

      {schema.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  )
}
