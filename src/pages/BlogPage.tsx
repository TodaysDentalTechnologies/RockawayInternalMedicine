import { Link } from 'react-router-dom'
import { posts } from '../data/blog'
import { ArrowRight, Clock, Calendar } from '../components/icons'
import { site } from '../data/clinic'
import Seo from '../components/Seo'
import { breadcrumbSchema } from '../data/seo'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

export default function BlogPage() {
  const [featured, ...rest] = posts

  return (
    <section style={{ background: 'var(--bg2)', padding: 'clamp(104px,15vh,152px) 0 clamp(64px,9vw,112px)' }}>
      <Seo
        title={`Health Library — Blog | ${site.brand}`}
        description="Plain-language guides on the conditions we treat and the choices that keep you healthy — written by our care team."
        path="/blog"
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])]}
      />
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
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
            Health library
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
            Notes on <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>staying well.</em>
          </h1>
          <p style={{ fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 22 }}>
            Plain-language guides on the conditions we treat and the choices that keep you healthy — written by our care team.
          </p>
        </div>

        {/* Featured article */}
        <Link to={`/blog/${featured.slug}`} className="rim-blog-feature reveal" aria-label={featured.title}>
          <div className="rim-blog-feat-media">
            <img
              src={featured.img}
              alt={featured.title}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>

          <div className="rim-blog-feat-body">
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: "'DM Mono',monospace",
                fontSize: 11.5,
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: 'var(--olive)',
              }}
            >
              <span style={{ width: 20, height: 1.5, background: 'var(--olive)' }} /> Featured article
            </span>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(27px,3.4vw,42px)', lineHeight: 1.08, letterSpacing: '-.015em', marginTop: 16 }}>
              {featured.title}
            </h2>
            <p style={{ fontSize: 'clamp(15px,1.4vw,16.5px)', lineHeight: 1.66, color: 'var(--ink-soft)', marginTop: 16 }}>
              {featured.excerpt}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginTop: 22, fontFamily: "'DM Mono',monospace", fontSize: 12.5, color: 'var(--ink-soft)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <Calendar size={14} /> {formatDate(featured.date)}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <Clock size={14} /> {featured.readMinutes} min read
              </span>
            </div>
            <span className="rim-blog-read">
              Read the full article <ArrowRight size={16} />
            </span>
          </div>
        </Link>

        {/* Any further posts, as a grid */}
        {rest.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))',
              gap: 'clamp(20px,2.6vw,28px)',
              marginTop: 'clamp(40px,6vw,64px)',
            }}
          >
            {rest.map((p, i) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="rim-card reveal"
                style={{
                  transitionDelay: `${(i % 3) * 0.05}s`,
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 22,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: '0 26px 52px -40px rgba(43,43,36,.35)',
                }}
              >
                <div style={{ aspectRatio: '16 / 10', overflow: 'hidden', background: 'linear-gradient(135deg, #2e6b43, #a6c9b2)' }}>
                  <img src={p.img} alt={p.title} loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 'clamp(20px,2.4vw,26px)', flex: 1 }}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11.5, color: 'var(--ink-soft)' }}>
                    {formatDate(p.date)} · {p.readMinutes} min read
                  </div>
                  <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(21px,2.2vw,25px)', lineHeight: 1.14, letterSpacing: '-.01em' }}>{p.title}</h2>
                  <p style={{ fontSize: 14.5, lineHeight: 1.62, color: 'var(--ink-soft)' }}>{p.excerpt}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 6, fontSize: 14, fontWeight: 600, color: 'var(--olive-deep)' }}>
                    Read article <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
