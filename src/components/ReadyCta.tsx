import { useNavigate } from 'react-router-dom'
import { site } from '../data/clinic'
import { Calendar, MapPin, ArrowRight } from './icons'
import CallMenu from './CallMenu'

// "Ready to get started?" closing CTA card — themed to the site's green.
export default function ReadyCta() {
  const navigate = useNavigate()

  const lift = (e: React.MouseEvent<HTMLElement>, on: boolean) => {
    e.currentTarget.style.transform = on ? 'translateY(-2px)' : 'none'
  }

  return (
    <div
      className="reveal"
      style={{
        marginTop: 'clamp(56px,8vw,96px)',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(140deg, var(--olive-deep), var(--dark))',
        color: 'var(--on-dark)',
        borderRadius: 28,
        padding: 'clamp(40px,6vw,72px) clamp(24px,4vw,48px)',
        textAlign: 'center',
        boxShadow: '0 44px 84px -46px rgba(28,74,44,.6)',
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% -25%, rgba(255,255,255,.16), transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(30px,4.4vw,52px)', lineHeight: 1.03, letterSpacing: '-.01em' }}>
          Ready to get started?
        </h2>
        <p style={{ fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.6, color: 'var(--on-dark-soft)', marginTop: 14 }}>
          Schedule your visit with {site.brand} today — new patients are always welcome at both of our Queens offices.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginTop: 30 }}>
          <button
            onClick={() => navigate('/contact')}
            onMouseEnter={(e) => lift(e, true)}
            onMouseLeave={(e) => lift(e, false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--on-olive)',
              color: 'var(--olive-deep)',
              padding: '14px 26px',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              boxShadow: '0 14px 28px -16px rgba(0,0,0,.4)',
              transition: 'transform .25s ease',
            }}
          >
            <Calendar size={17} /> Book Appointment Online
          </button>
          <CallMenu
            label="Call an office"
            iconColor="var(--on-dark)"
            triggerStyle={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              border: '1px solid rgba(255,255,255,.32)',
              background: 'transparent',
              color: 'var(--on-dark)',
              padding: '14px 24px',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          />
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,.18)', margin: 'clamp(28px,4vw,40px) auto 0', maxWidth: 520 }} />

        <button
          onClick={() => navigate('/locations')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginTop: 'clamp(20px,3vw,28px)', color: 'var(--on-dark-soft)', fontSize: 14.5, background: 'none', border: 0, cursor: 'pointer' }}
        >
          <MapPin size={17} /> View our two Queens locations <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}
