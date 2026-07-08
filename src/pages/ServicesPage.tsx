import { useNavigate } from 'react-router-dom'
import { ArrowRight } from '../components/icons'
import { services } from '../data/services'

export default function ServicesPage() {
  const navigate = useNavigate()

  return (
    <section style={{ background: 'var(--bg2)', padding: 'clamp(104px,15vh,152px) 0 clamp(64px,9vw,112px)' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        {/* Hero */}
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
            Our Services
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
            Care for the <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>whole you.</em>
          </h1>
          <p style={{ fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 22 }}>
            A coordinated team delivering preventive, chronic, and specialized care under one roof — thorough, unhurried,
            and centered on you.
          </p>
        </div>

        {/* Alternating image rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(20px,3vw,32px)', marginTop: 'clamp(48px,7vw,88px)' }}>
          {services.map((s, i) => (
            <article
              key={s.title}
              className="rim-svc-card reveal"
              style={{
                transitionDelay: `${(i % 2) * 0.06}s`,
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 30px 60px -40px rgba(43,43,36,.3)',
              }}
            >
              <div className={`rim-svc-row${i % 2 === 1 ? ' reverse' : ''}`}>
                <div className="rim-svc-media">
                  <img src={s.img} alt={s.title} loading="lazy" />
                </div>
                <div
                  className="rim-svc-body"
                  style={{
                    padding: 'clamp(28px,4vw,52px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 16,
                  }}
                >
                  <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(26px,3vw,38px)', lineHeight: 1.08, letterSpacing: '-.01em' }}>
                    {s.title}
                  </h2>
                  <p style={{ fontSize: 'clamp(14.5px,1.3vw,16px)', lineHeight: 1.68, color: 'var(--ink-soft)', maxWidth: '46ch' }}>
                    {s.body}
                  </p>
                  <button
                    onClick={() => navigate(`/services/${s.slug}`)}
                    className="rim-outline-btn"
                    style={{
                      alignSelf: 'flex-start',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 9,
                      marginTop: 6,
                      background: 'transparent',
                      border: '1.5px solid var(--olive)',
                      color: 'var(--olive-deep)',
                      padding: '12px 22px',
                      borderRadius: 999,
                      fontSize: 14.5,
                      fontWeight: 600,
                    }}
                  >
                    View Details <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
