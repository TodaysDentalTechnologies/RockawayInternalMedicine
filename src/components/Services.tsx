import { useEffect, useRef, useState } from 'react'
import { services } from '../data/services'
import SectionHeading from './SectionHeading'
import { useNavigate } from 'react-router-dom'
import { Activity, ArrowRight, Check } from './icons'

// The three "hero" specialties shown as large image cards. The middle card is
// dropped down to create the staggered editorial row; each pulls its photo and
// title from the shared services data and links to its detail page.
const FEATURED: { slug: string; kicker: string }[] = [
  { slug: 'cardiology', kicker: '01 · Cardiovascular' },
  { slug: 'dermatology', kicker: '02 · Skin Health' },
  { slug: 'neurology', kicker: '03 · Neurological' },
]

const FINDER: { concern: string; kicker: string; title: string; desc: string }[] = [
  {
    concern: "I'm always tired",
    kicker: "LET'S FIND THE WHY",
    title: 'Fatigue & anemia workup',
    desc: 'Persistent tiredness usually deserves bloodwork — thyroid, iron, B12, blood sugar — plus a real conversation about sleep and stress. We do the draw in-office and explain every result.',
  },
  {
    concern: 'My blood pressure runs high',
    kicker: 'ONGOING, NOT ONE-OFF',
    title: 'Hypertension management',
    desc: 'We confirm with proper readings, tailor medication if needed, and follow up until your numbers are steady — without upending your routine.',
  },
  {
    concern: 'My sugar is creeping up',
    kicker: 'CATCH IT EARLY',
    title: 'Diabetes & pre-diabetes care',
    desc: 'From A1C testing to medication and food-first changes, we manage blood sugar closely — and celebrate the wins with you.',
  },
  {
    concern: 'I just need a checkup',
    kicker: 'THE SMART ANNUAL',
    title: 'Annual physical & preventive care',
    desc: 'A head-to-toe exam with age-appropriate screenings and vaccines — and enough time to actually talk.',
  },
  {
    concern: "I'm sick right now",
    kicker: "DON'T WAIT IT OUT",
    title: 'Same-week sick visit',
    desc: "New cough, fever, pain, or just 'off'? Call us first — we usually see sick patients within the week, often sooner.",
  },
  {
    concern: 'I get short of breath',
    kicker: 'BREATHE EASIER',
    title: 'Asthma & COPD care',
    desc: 'We check your lungs, build a stepwise inhaler plan, and keep an eye on triggers before they become ER visits.',
  },
  {
    concern: 'I need vaccines or forms',
    kicker: 'QUICK & OFFICIAL',
    title: 'Immunizations & paperwork',
    desc: 'Flu, pneumonia, shingles — plus school, work, and travel forms, done properly and on time.',
  },
  {
    concern: 'My weight and energy are stuck',
    kicker: 'NO JUDGMENT HERE',
    title: 'Weight & lifestyle medicine',
    desc: "Food-first counseling, lab checks for hidden causes, and honest medical support when it's warranted.",
  },
]

export default function Services() {
  const navigate = useNavigate()
  const [sel, setSel] = useState<number>(-1)
  const [flip, setFlip] = useState(false)
  const timer = useRef<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Run the ambient icon/mesh animations only while the section is on-screen.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in-view')
      return
    }
    const io = new IntersectionObserver(([e]) => el.classList.toggle('in-view', e.isIntersecting), {
      rootMargin: '200px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const pick = (i: number) => {
    if (timer.current) window.clearTimeout(timer.current)
    if (reduced || sel < 0) {
      setSel(i)
      setFlip(false)
      return
    }
    setFlip(true)
    timer.current = window.setTimeout(() => {
      setSel(i)
      setFlip(false)
    }, 220)
  }

  const active = sel >= 0 ? FINDER[sel] : null

  return (
    <section ref={sectionRef} id="services" className="rim-svc-section" style={{ background: 'var(--bg2)', padding: 'clamp(72px,9vw,124px) 0 0' }}>
      {/* Gradient-mesh backdrop */}
      <div className="rim-mesh" aria-hidden="true">
        <span className="m1" />
        <span className="m2" />
        <span className="m3" />
      </div>

      <div style={{ maxWidth: 1500, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        {/* Split header — serif heading left, supporting line right */}
        <div className="rim-feat-head">
          <SectionHeading eyebrow="What we do" headingMaxWidth="13ch">
            Primary care, <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>end to end.</em>
          </SectionHeading>
          <p className="reveal">
            From the annual physical to the years-long management of a chronic condition — one practice, one record, one team.
          </p>
        </div>

        {/* Featured specialty cards (staggered) */}
        <div className="rim-feat-grid">
          {FEATURED.map((f, i) => {
            const s = services.find((x) => x.slug === f.slug)
            if (!s) return null
            return (
              <button
                key={f.slug}
                onClick={() => navigate(`/services/${s.slug}`)}
                className={`rim-feat reveal rim-rise${i === 1 ? ' rim-feat-offset' : ''}`}
                style={{ transitionDelay: `${i * 0.06}s` }}
                aria-label={`${s.title} — view details`}
              >
                <span className="rim-feat-media">
                  <img src={s.img} alt={s.title} loading="lazy" />
                  <span className="rim-feat-veil" aria-hidden="true" />
                  <span className="rim-feat-cap">
                    <span className="rim-feat-kicker">{f.kicker}</span>
                    <span className="rim-feat-title">{s.title}</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* All twelve specialties */}
        <div
          className="reveal"
          style={{ marginTop: 'clamp(48px,6vw,76px)', borderTop: '1px solid var(--line)', paddingTop: 'clamp(28px,3.5vw,40px)' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: "'DM Mono',monospace",
              fontSize: 12,
              letterSpacing: '.24em',
              textTransform: 'uppercase',
              color: 'var(--olive)',
            }}
          >
            <span style={{ width: 22, height: 1.5, background: 'var(--olive)' }} />
            All twelve specialties
          </span>
          <div className="rim-spec-grid" style={{ marginTop: 24 }}>
            {services.map((s) => (
              <button key={s.slug} className="rim-spec" onClick={() => navigate(`/services/${s.slug}`)}>
                <span className="rim-spec-dot" aria-hidden="true">
                  <Check size={14} />
                </span>
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Explore all services */}
        <div className="reveal" style={{ textAlign: 'center', marginTop: 'clamp(40px,5vw,60px)' }}>
          <button
            onClick={() => navigate('/services')}
            className="rim-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--olive-deep)',
              color: 'var(--on-olive)',
              padding: '15px 30px',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              boxShadow: '0 20px 40px -18px rgba(28,74,44,.6)',
            }}
          >
            Explore all services <ArrowRight size={15} />
          </button>
        </div>

        {/* Symptom → service finder */}
        <div
          className="reveal rim-finder"
          style={{
            position: 'relative',
            overflow: 'hidden',
            marginTop: 'clamp(56px,7vw,88px)',
            marginBottom: 'clamp(56px,7vw,96px)',
            border: '1px solid rgba(255,255,255,.55)',
            borderRadius: 28,
            background: 'linear-gradient(135deg, rgba(179,209,187,.4), rgba(134,168,148,.2))',
            backdropFilter: 'blur(14px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
            boxShadow: '0 40px 80px -50px rgba(28,74,44,.6)',
            padding: 'clamp(26px,4vw,48px)',
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: "'DM Mono',monospace",
                fontSize: 12,
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: 'var(--olive-deep)',
              }}
            >
              Symptom → service finder
            </span>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(26px,3vw,36px)', lineHeight: 1.1, marginTop: 14 }}>
              Not sure where to start? <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>Tap what's bothering you.</em>
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 12 }}>
              We'll show you how we'd approach it — and which visit to book.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
              {FINDER.map((f, i) => {
                const on = sel === i
                return (
                  <button
                    key={f.concern}
                    onClick={() => pick(i)}
                    aria-pressed={on}
                    className="rim-fchip"
                    style={{
                      border: `1px solid ${on ? 'transparent' : 'rgba(28,74,44,.32)'}`,
                      borderRadius: 999,
                      padding: '11px 18px',
                      fontSize: 14.5,
                      fontWeight: 500,
                      background: on ? 'var(--olive-deep)' : 'rgba(255,255,255,.7)',
                      color: on ? 'var(--on-olive)' : 'var(--ink)',
                    }}
                  >
                    {f.concern}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ perspective: 1400 }}>
            <div
              aria-live="polite"
              style={{
                transform: flip ? 'rotateY(88deg)' : 'rotateY(0deg)',
                transition: 'transform .22s ease',
                transformStyle: 'preserve-3d',
                background: 'linear-gradient(160deg, rgba(255,255,255,.82), rgba(255,255,255,.6))',
                border: '1px solid rgba(255,255,255,.7)',
                borderRadius: 22,
                padding: 'clamp(24px,3vw,34px)',
                minHeight: 280,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backdropFilter: 'blur(16px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
                boxShadow: '0 34px 66px -32px rgba(28,74,44,.5)',
              }}
            >
              {!active ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      background: 'rgba(46,107,67,.11)',
                      color: 'var(--olive-deep)',
                    }}
                  >
                    <Activity size={21} />
                  </span>
                  <p style={{ fontFamily: "'Fraunces',serif", fontSize: 22, lineHeight: 1.3 }}>
                    Pick a concern on the left to see the visit we'd recommend.
                  </p>
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 10.5,
                      letterSpacing: '.2em',
                      color: 'var(--olive)',
                      border: '1px solid var(--line)',
                      borderRadius: 999,
                      padding: '7px 12px',
                    }}
                  >
                    NO SYMPTOM-GOOGLING REQUIRED
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '.22em', color: 'var(--olive)' }}>
                    {active.kicker}
                  </span>
                  <h4 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 27, lineHeight: 1.1 }}>{active.title}</h4>
                  <p style={{ fontSize: 14.5, lineHeight: 1.62, color: 'var(--ink-soft)' }}>{active.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                    <button
                      onClick={() => navigate('/contact')}
                      className="rim-cta"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 9,
                        background: 'var(--olive-deep)',
                        color: 'var(--on-olive)',
                        padding: '12px 20px',
                        borderRadius: 999,
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      Book this visit
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => navigate('/contact')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '12px 18px',
                        borderRadius: 999,
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--olive-deep)',
                        textDecoration: 'underline',
                        textUnderlineOffset: 3,
                        background: 'none',
                        border: 0,
                        cursor: 'pointer',
                      }}
                    >
                      or call us
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
