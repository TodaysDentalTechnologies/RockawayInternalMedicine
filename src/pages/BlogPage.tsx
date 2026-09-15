import { Link } from 'react-router-dom'
import { posts } from '../data/blog'
import { ArrowRight } from '../components/icons'
import { site } from '../data/clinic'
import Seo from '../components/Seo'
import { breadcrumbSchema } from '../data/seo'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

/** "Sep 2026" — the short month + year shown on each card, like the dentistinconcord blog grid. */
const shortDate = (iso: string) => {
  const [y, m] = iso.split('-').map(Number)
  return `${MONTHS[m - 1].slice(0, 3)} ${y}`
}

export default function BlogPage() {
  return (
    <section style={{ background: 'var(--bg2)', padding: 'clamp(104px,15vh,152px) 0 clamp(64px,9vw,112px)' }}>
      <Seo
        title={`Health Library — Blog | ${site.brand}`}
        description="Plain-language guides on the conditions we treat and the choices that keep you healthy — written by our care team."
        path="/blog"
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])]}
      />
      {/* Wider than the site's usual 1140px so the three-column grid fills large screens, like the dentistinconcord blog. */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        {/* Hero intro */}
        <div className="reveal" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: "'DM Mono',monospace",
              fontSize: 12.5,
              letterSpacing: '.28em',
              textTransform: 'uppercase',
              color: 'var(--olive)',
            }}
          >
            <span style={{ width: 22, height: 1.5, background: 'var(--olive)' }} />
            Health blog
            <span style={{ width: 22, height: 1.5, background: 'var(--olive)' }} />
          </span>
          <h1
            style={{
              fontFamily: "'Fraunces',serif",
              fontWeight: 400,
              fontSize: 'clamp(40px,6vw,72px)',
              lineHeight: 1.02,
              letterSpacing: '-.015em',
              marginTop: 18,
            }}
          >
            Health tips and advice from <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>our doctors.</em>
          </h1>
          <p style={{ fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 22 }}>
            Plain-language guides on the conditions we treat and the choices that keep you healthy — written by our care team.
          </p>
        </div>

        {/* Card grid — three across on desktop, two on tablet, one on phones. Each card opens the article. */}
        <div className="rim-blog-grid">
          {posts.map((p, i) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="rim-blog-card reveal" aria-label={p.title}>
              <div className="rim-blog-card-media">
                <img
                  src={p.img}
                  alt={p.title}
                  /* The first row is above the fold; the rest can defer. */
                  loading={i < 3 ? 'eager' : 'lazy'}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <span className="rim-blog-card-tag">{p.category}</span>
              </div>

              <div className="rim-blog-card-body">
                <span className="rim-blog-card-meta">
                  {shortDate(p.date)} · {p.readMinutes} min read
                </span>
                <h2 className="rim-blog-card-title">{p.title}</h2>
                <p className="rim-blog-card-excerpt">{p.excerpt}</p>
                <span className="rim-blog-card-read">
                  Read article <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
