import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPost, posts } from '../data/blog'
import { getService } from '../data/services'
import { site } from '../data/clinic'
import { ArrowRight, Clock, Plus, Minus, Calendar, Activity } from '../components/icons'
import ReadyCta from '../components/ReadyCta'
import CallMenu from '../components/CallMenu'
import Seo from '../components/Seo'
import { articleSchema, faqSchema, breadcrumbSchema, SITE_URL } from '../data/seo'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

const PROSE = 760

const RICH_LINK = { color: 'var(--olive-deep)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }

// Renders inline [text](/path) markers in the body copy as real links.
function renderRichText(text: string) {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  const out: Array<string | JSX.Element> = []
  let last = 0
  let k = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const [, label, url] = m
    out.push(
      url.startsWith('/') ? (
        <Link key={k++} to={url} style={RICH_LINK}>
          {label}
        </Link>
      ) : (
        <a key={k++} href={url} style={RICH_LINK} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ),
    )
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const post = getPost(slug)
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => setOpenFaq(0), [slug])

  if (!post) {
    return (
      <section style={{ background: 'var(--bg)', padding: 'clamp(120px,22vh,200px) 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(32px,5vw,52px)' }}>Article not found</h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 14 }}>
            That article doesn’t exist. Browse the rest of our health library instead.
          </p>
          <Link to="/blog" style={{ display: 'inline-block', marginTop: 22, color: 'var(--olive-deep)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            ← Back to the blog
          </Link>
        </div>
      </section>
    )
  }

  const related = post.relatedServiceSlug ? getService(post.relatedServiceSlug) : undefined
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <section style={{ background: 'var(--bg)', padding: 'clamp(96px,14vh,140px) 0 clamp(64px,9vw,110px)' }}>
      <Seo
        title={`${post.title} | ${site.brand}`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.img}
        type="article"
        schema={[
          articleSchema(post),
          faqSchema(post.faqs, `${SITE_URL}/blog/${post.slug}`),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/blog')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'DM Mono',monospace",
            fontSize: 12,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: 'var(--olive)',
          }}
        >
          <span style={{ transform: 'translateY(-1px)' }}>←</span> Health library
        </button>

        {/* Hero — two-column interactive spotlight, matching the blog's featured section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,360px),1fr))',
            gap: 'clamp(32px,5vw,60px)',
            alignItems: 'center',
            marginTop: 'clamp(24px,4vw,40px)',
          }}
        >
          <div className="reveal">
            <span
              style={{
                display: 'inline-block',
                fontFamily: "'DM Mono',monospace",
                fontSize: 11.5,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'var(--olive-deep)',
                background: 'rgba(46,107,67,.12)',
                border: '1px solid var(--line)',
                borderRadius: 999,
                padding: '7px 15px',
              }}
            >
              {post.category}
            </span>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(34px,5vw,58px)', lineHeight: 1.03, letterSpacing: '-.015em', marginTop: 18 }}>
              {post.title}
            </h1>
            <span style={{ display: 'block', width: 66, height: 3, background: 'var(--olive)', borderRadius: 2, marginTop: 16 }} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginTop: 18, fontFamily: "'DM Mono',monospace", fontSize: 12.5, color: 'var(--ink-soft)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} /> {formatDate(post.date)}
              </span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--sage)' }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} /> {post.readMinutes} min read
              </span>
            </div>
            <p style={{ fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.68, color: 'var(--ink-soft)', marginTop: 20, maxWidth: '46ch' }}>
              {post.excerpt}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 30 }}>
              <button
                onClick={() => navigate('/contact')}
                className="rim-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'var(--olive-deep)',
                  color: 'var(--on-olive)',
                  padding: '15px 26px',
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                <Calendar size={17} /> Book an appointment
              </button>
              <CallMenu
                label="Call an office"
                triggerClassName="rim-outline-btn"
                triggerStyle={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  border: '1px solid var(--line)',
                  background: 'var(--card)',
                  color: 'var(--ink)',
                  padding: '15px 22px',
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>

          <div className="reveal" style={{ transitionDelay: '.1s' }}>
            <div className="rim-blog-feat-media">
              <img src={post.img} alt={post.title} onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          </div>
        </div>

        {/* Article body */}
        <article style={{ maxWidth: PROSE, margin: 'clamp(40px,6vw,64px) auto 0' }}>
          {post.intro.map((p, i) => (
            <p
              key={`intro-${i}`}
              className="reveal"
              style={{
                fontSize: 'clamp(16px,1.6vw,18.5px)',
                lineHeight: 1.7,
                color: 'var(--ink)',
                marginTop: i === 0 ? 0 : 18,
              }}
            >
              {renderRichText(p)}
            </p>
          ))}

          {post.sections.map((sec) => (
            <div key={sec.heading} className="reveal" style={{ marginTop: 'clamp(36px,4.5vw,52px)' }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(24px,3vw,34px)', lineHeight: 1.12, letterSpacing: '-.01em' }}>
                {sec.heading}
              </h2>
              <span style={{ display: 'block', width: 54, height: 3, background: 'var(--olive)', borderRadius: 2, margin: '14px 0 0' }} />
              {sec.paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.72, color: 'var(--ink-soft)', marginTop: i === 0 ? 20 : 16 }}>
                  {renderRichText(p)}
                </p>
              ))}
            </div>
          ))}

          {post.disclaimer && (
            <p
              className="reveal"
              style={{
                fontSize: 13.5,
                lineHeight: 1.6,
                color: 'var(--ink-soft)',
                fontStyle: 'italic',
                marginTop: 'clamp(32px,4vw,44px)',
                paddingLeft: 16,
                borderLeft: '3px solid var(--sage)',
              }}
            >
              {post.disclaimer}
            </p>
          )}

          {/* Next-step CTA — turn the read into an action */}
          {related && (
            <div
              className="reveal"
              style={{
                position: 'relative',
                overflow: 'hidden',
                marginTop: 'clamp(36px,5vw,52px)',
                borderRadius: 22,
                border: '1px solid rgba(255,255,255,.55)',
                background: 'linear-gradient(135deg, rgba(179,209,187,.5), rgba(134,168,148,.24))',
                boxShadow: '0 34px 70px -48px rgba(28,74,44,.55)',
                padding: 'clamp(26px,3.6vw,42px)',
              }}
            >
              <span
                aria-hidden="true"
                style={{ position: 'absolute', right: -60, top: -60, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,.35), transparent 68%)', pointerEvents: 'none' }}
              />
              <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 11, fontFamily: "'DM Mono',monospace", fontSize: 11.5, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--olive-deep)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 11, background: 'rgba(46,107,67,.16)', color: 'var(--olive-deep)' }}>
                  <Activity size={18} />
                </span>
                Ready when you are
              </span>
              <h3 style={{ position: 'relative', fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(25px,3vw,36px)', lineHeight: 1.08, letterSpacing: '-.01em', marginTop: 16 }}>
                Let’s manage it together.
              </h3>
              <p style={{ position: 'relative', fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.62, color: 'var(--ink-soft)', marginTop: 12, maxWidth: '52ch' }}>
                {related.body}
              </p>
              <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 26 }}>
                <Link
                  to={`/services/${related.slug}`}
                  className="rim-cta"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--olive-deep)', color: 'var(--on-olive)', padding: '14px 24px', borderRadius: 999, fontSize: 14.5, fontWeight: 600, textDecoration: 'none' }}
                >
                  Explore {related.title} <ArrowRight size={15} />
                </Link>
                <Link
                  to="/contact"
                  className="rim-outline-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 9, border: '1.5px solid var(--olive)', background: 'transparent', color: 'var(--olive-deep)', padding: '14px 22px', borderRadius: 999, fontSize: 14.5, fontWeight: 600, textDecoration: 'none' }}
                >
                  Book an appointment
                </Link>
              </div>
            </div>
          )}
        </article>

        {/* FAQ */}
        {post.faqs.length > 0 && (
          <div style={{ marginTop: 'clamp(56px,8vw,96px)' }}>
            <div className="reveal" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
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
                FAQs
                <span style={{ width: 22, height: 1.5, background: 'var(--olive)' }} />
              </span>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(30px,4.5vw,52px)', lineHeight: 1.04, letterSpacing: '-.01em', marginTop: 14 }}>
                Frequently asked questions
              </h2>
            </div>

            <div style={{ maxWidth: 840, margin: 'clamp(32px,4vw,48px) auto 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {post.faqs.map((f, i) => {
                const open = openFaq === i
                return (
                  <div
                    key={i}
                    className="reveal"
                    style={{
                      background: 'var(--card)',
                      border: `1px solid ${open ? 'var(--olive)' : 'var(--line)'}`,
                      borderRadius: 18,
                      boxShadow: open ? '0 26px 52px -34px rgba(43,43,36,.4)' : 'none',
                      transition: 'box-shadow .35s, border-color .35s',
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      aria-expanded={open}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        textAlign: 'left',
                        padding: 'clamp(18px,2.4vw,24px) clamp(20px,2.6vw,28px)',
                      }}
                    >
                      <span style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(18px,2vw,22px)', lineHeight: 1.25 }}>{f.q}</span>
                      <span style={{ flex: 'none', color: 'var(--olive)' }}>{open ? <Minus size={20} /> : <Plus size={20} />}</span>
                    </button>
                    <div
                      style={{
                        overflow: 'hidden',
                        maxHeight: open ? 340 : 0,
                        opacity: open ? 1 : 0,
                        transition: 'max-height .4s cubic-bezier(.22,.61,.36,1), opacity .4s',
                      }}
                    >
                      <p style={{ fontSize: 'clamp(14.5px,1.4vw,16px)', lineHeight: 1.65, color: 'var(--ink-soft)', padding: '0 clamp(20px,2.6vw,28px) clamp(20px,2.6vw,26px)' }}>
                        {f.a}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* More from the blog */}
        {more.length > 0 && (
          <div style={{ marginTop: 'clamp(48px,7vw,84px)' }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11.5, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
              More from the blog
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
              {more.map((m) => (
                <Link
                  key={m.slug}
                  to={`/blog/${m.slug}`}
                  className="rim-outline-btn"
                  style={{
                    border: '1px solid var(--line)',
                    background: 'var(--card)',
                    color: 'var(--ink)',
                    borderRadius: 999,
                    padding: '10px 18px',
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  {m.title}
                </Link>
              ))}
              <Link
                to="/blog"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 6px', fontSize: 14, fontWeight: 600, color: 'var(--olive-deep)', textDecoration: 'none' }}
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        <ReadyCta />
      </div>
    </section>
  )
}
