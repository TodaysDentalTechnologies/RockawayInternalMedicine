import { clinic } from '../data/clinic'
import { useClinicStatus } from '../hooks/useClinicStatus'
import { scrollToId } from './Header'
import ImageSlot from './ImageSlot'
import { Calendar, ArrowRight, Phone, Check, Heart } from './icons'

const TRUST = ['Board-certified', 'Most major plans', 'Same-week visits']

export default function Hero() {
  const status = useClinicStatus()

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        background: 'var(--bg)',
        padding: 'clamp(140px,16vh,190px) 0 clamp(56px,8vh,96px)',
        minHeight: '92svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'visible',
      }}
    >
      {/* Floating blobs */}
      <div aria-hidden="true" style={{ position: 'absolute', right: -160, top: -140, width: 580, height: 580, pointerEvents: 'none' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle at 38% 38%, var(--blob-a), transparent 68%)', animation: 'rimFloat 16s ease-in-out infinite' }} />
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', left: -200, bottom: -180, width: 540, height: 540, pointerEvents: 'none' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle at 60% 40%, var(--blob-b), transparent 66%)', animation: 'rimFloat2 19s ease-in-out infinite' }} />
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', right: '34%', top: '16%', width: 240, height: 240, pointerEvents: 'none' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, var(--blob-c), transparent 70%)', animation: 'rimFloat 12s ease-in-out infinite reverse' }} />
      </div>

      <div
        style={{
          maxWidth: 1220,
          margin: '0 auto',
          padding: '0 clamp(18px,4vw,48px)',
          position: 'relative',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,470px),1fr))',
          gap: 'clamp(40px,5vw,64px)',
          alignItems: 'center',
        }}
      >
        <div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 999,
              padding: '8px 15px',
              fontFamily: "'DM Mono',monospace",
              fontSize: 12,
              animation: 'rimRise .8s cubic-bezier(.22,.61,.36,1) .05s both',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: status.color, animation: 'rimBlink 2.4s infinite' }} />
            <span style={{ fontWeight: 500 }}>{status.label}</span>
            <span style={{ color: 'var(--ink-soft)' }}>· {status.sub}</span>
          </span>

          <h1
            style={{
              fontFamily: "'Instrument Serif',serif",
              fontWeight: 400,
              fontSize: 'clamp(46px,6.3vw,84px)',
              lineHeight: 0.98,
              letterSpacing: '-.015em',
              marginTop: 24,
              animation: 'rimRise .9s cubic-bezier(.22,.61,.36,1) .12s both',
            }}
          >
            Good medicine starts with <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>knowing you.</em>
          </h1>

          <p
            style={{
              fontSize: 'clamp(16px,1.5vw,18px)',
              lineHeight: 1.65,
              color: 'var(--ink-soft)',
              maxWidth: '54ch',
              marginTop: 24,
              animation: 'rimRise .9s cubic-bezier(.22,.61,.36,1) .2s both',
            }}
          >
            {clinic.name} is adult primary care on Rockaway Boulevard — unhurried visits, same-week appointments, and a
            team that follows your whole story, not just today's symptoms.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 36, animation: 'rimRise .9s cubic-bezier(.22,.61,.36,1) .28s both' }}>
            <button
              onClick={() => scrollToId('contact')}
              className="rim-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 11,
                background: 'var(--olive-deep)',
                color: 'var(--on-olive)',
                padding: '16px 28px',
                borderRadius: 999,
                fontSize: 15.5,
                fontWeight: 600,
              }}
            >
              <Calendar size={17} />
              Request an appointment
              <ArrowRight size={16} />
            </button>
            <a
              href={clinic.phoneHref}
              className="rim-outline-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                border: '1px solid var(--line)',
                background: 'var(--card)',
                color: 'var(--ink)',
                padding: '16px 26px',
                borderRadius: 999,
                fontSize: 15.5,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <Phone size={16} style={{ color: 'var(--olive)' }} />
              Call now
            </a>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 22px', marginTop: 30, animation: 'rimRise .9s cubic-bezier(.22,.61,.36,1) .36s both' }}>
            {TRUST.map((t) => (
              <span
                key={t}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 12,
                  color: 'var(--ink-soft)',
                  letterSpacing: '.04em',
                }}
              >
                <Check size={13} style={{ color: 'var(--olive)' }} />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', padding: '0 10px', animation: 'rimRise 1s cubic-bezier(.22,.61,.36,1) .22s both' }}>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '-16px 6px 14px -4px',
              borderRadius: '44% 56% 52% 48% / 42% 46% 54% 58%',
              border: '1.5px dashed rgba(107,122,63,.4)',
              transform: 'rotate(5deg)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              borderRadius: '44% 56% 52% 48% / 42% 46% 54% 58%',
              overflow: 'hidden',
              width: 'min(520px,100%)',
              aspectRatio: '.94',
              margin: '0 auto',
              border: '1px solid var(--line)',
              background: 'linear-gradient(160deg, rgba(163,177,138,.35), rgba(200,213,160,.28))',
              position: 'relative',
            }}
          >
            <ImageSlot
              src="/images/dr-shamtoub.png"
              alt="Board-certified internal medicine physician at Rockaway Internal Medicine"
              label="Drop a photo — your storefront, exam room, or team"
            />
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 22,
              left: -6,
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 18,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 22px 44px -22px rgba(43,43,36,.35)',
              animation: 'rimFloat2 11s ease-in-out infinite',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'rgba(107,122,63,.12)',
                color: 'var(--olive-deep)',
              }}
            >
              <Heart size={18} />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Same-week appointments</span>
              <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>New patients welcome</span>
            </span>
          </div>
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 2,
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 999,
              padding: '9px 16px',
              fontFamily: "'DM Mono',monospace",
              fontSize: 11,
              letterSpacing: '.18em',
              color: 'var(--olive-deep)',
              boxShadow: '0 16px 32px -18px rgba(43,43,36,.3)',
              animation: 'rimFloat 13s ease-in-out infinite',
            }}
          >
            ADULT PRIMARY CARE
          </div>
        </div>
      </div>
    </section>
  )
}
