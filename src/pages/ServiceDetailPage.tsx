import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { clinic } from '../data/clinic'
import { getService, services } from '../data/services'
import { ArrowRight, Stethoscope, Chat, Clipboard, Plus, Minus } from '../components/icons'
import ReadyCta from '../components/ReadyCta'
import CallMenu from '../components/CallMenu'
import type { ReactNode } from 'react'

const EXPECT: { icon: ReactNode; title: string; body: string }[] = [
  { icon: <Stethoscope size={20} />, title: 'A thorough evaluation', body: 'We take time to understand your history, symptoms, and concerns before recommending anything.' },
  { icon: <Chat size={20} />, title: 'Answers in plain language', body: "You'll leave understanding your results and your options — no jargon, no rushing." },
  { icon: <Clipboard size={20} />, title: 'A plan built around you', body: 'Care and follow-up tailored to your needs — coordinated with the rest of your care under one roof.' },
]

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const service = getService(slug)
  const [openFaq, setOpenFaq] = useState(0)

  // Reset the open FAQ when switching between services.
  useEffect(() => setOpenFaq(0), [slug])

  if (!service) {
    return (
      <section style={{ background: 'var(--bg)', padding: 'clamp(120px,22vh,200px) 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(32px,5vw,52px)' }}>Service not found</h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 14 }}>
            That service doesn't exist. Browse everything we offer instead.
          </p>
          <Link to="/services" style={{ display: 'inline-block', marginTop: 22, color: 'var(--olive-deep)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            ← Back to all services
          </Link>
        </div>
      </section>
    )
  }

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 5)

  return (
    <section style={{ background: 'var(--bg)', padding: 'clamp(96px,14vh,140px) 0 clamp(64px,9vw,110px)' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/services')}
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
          <span style={{ transform: 'translateY(-1px)' }}>←</span> All Services
        </button>

        {/* Hero */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))',
            gap: 'clamp(32px,5vw,64px)',
            alignItems: 'center',
            marginTop: 'clamp(24px,4vw,40px)',
          }}
        >
          <div className="reveal">
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontFamily: "'DM Mono',monospace",
                fontSize: 11.5,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'var(--olive-deep)',
                background: 'rgba(107,122,63,.12)',
                border: '1px solid var(--line)',
                borderRadius: 999,
                padding: '7px 15px',
              }}
            >
              {service.category}
            </span>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(40px,6vw,68px)', lineHeight: 1.02, letterSpacing: '-.015em', marginTop: 18 }}>
              {service.title}
            </h1>
            <span style={{ display: 'block', width: 66, height: 3, background: 'var(--olive)', borderRadius: 2, marginTop: 16 }} />
            <p style={{ fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.68, color: 'var(--ink-soft)', marginTop: 22, maxWidth: '46ch' }}>
              {service.body}
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
                Book this service <ArrowRight size={16} />
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
            <img
              src={service.img}
              alt={service.title}
              style={{
                width: '100%',
                aspectRatio: '5 / 4',
                objectFit: 'cover',
                borderRadius: 24,
                display: 'block',
                border: '1px solid var(--line)',
                boxShadow: '0 40px 80px -40px rgba(43,43,36,.45)',
              }}
            />
          </div>
        </div>

        {/* What to expect */}
        <div style={{ marginTop: 'clamp(64px,9vw,110px)' }}>
          <div className="reveal">
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12.5, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--olive)' }}>
              What to expect
            </span>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(30px,4vw,50px)', lineHeight: 1.05, letterSpacing: '-.01em', marginTop: 14 }}>
              Thorough, unhurried, and centered on you.
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
              gap: 16,
              marginTop: 40,
            }}
          >
            {EXPECT.map((e, i) => (
              <div
                key={e.title}
                className="rim-card reveal"
                style={{
                  transitionDelay: `${i * 0.05}s`,
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 20,
                  padding: 26,
                }}
              >
                <span
                  className="rim-svc-icon"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, background: 'rgba(107,122,63,.12)', color: 'var(--olive-deep)' }}
                >
                  {e.icon}
                </span>
                <h3 style={{ fontSize: 17.5, fontWeight: 600, letterSpacing: '-.01em', marginTop: 18 }}>{e.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 8 }}>{e.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        {service.faqs.length > 0 && (
          <div style={{ marginTop: 'clamp(64px,9vw,110px)' }}>
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
              <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(32px,4.5vw,56px)', lineHeight: 1.04, letterSpacing: '-.01em', marginTop: 14 }}>
                Frequently asked questions
              </h2>
              <p style={{ fontSize: 'clamp(14.5px,1.5vw,17px)', lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 16 }}>
                Answers to common questions about {service.title.toLowerCase()} at {clinic.name}.
              </p>
            </div>

            <div style={{ maxWidth: 840, margin: 'clamp(32px,4vw,48px) auto 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {service.faqs.map((f, i) => {
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

        {/* Explore more */}
        <div style={{ marginTop: 'clamp(48px,7vw,84px)' }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11.5, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
            Explore more services
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
            {others.map((o) => (
              <Link
                key={o.slug}
                to={`/services/${o.slug}`}
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
                {o.title}
              </Link>
            ))}
            <Link
              to="/services"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 6px', fontSize: 14, fontWeight: 600, color: 'var(--olive-deep)', textDecoration: 'none' }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <ReadyCta />
      </div>
    </section>
  )
}
