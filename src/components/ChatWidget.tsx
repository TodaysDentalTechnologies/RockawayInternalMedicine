import { useState } from 'react'
import { clinic } from '../data/clinic'
import { scrollToId } from './Header'
import { Chat, Close, Phone, Calendar } from './icons'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Quick contact"
          style={{
            position: 'fixed',
            right: 20,
            bottom: 84,
            zIndex: 41,
            width: 'min(320px, calc(100vw - 40px))',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 22,
            boxShadow: '0 30px 60px -30px rgba(43,43,36,.5)',
            overflow: 'hidden',
            animation: 'rimRise .3s ease both',
          }}
        >
          <div style={{ background: 'linear-gradient(150deg, var(--olive-deep), #22280f)', color: 'var(--on-olive)', padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)', animation: 'rimBlink 2.4s infinite' }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                We're here to help
              </span>
            </div>
            <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 21, lineHeight: 1.2, marginTop: 10 }}>
              How can we help you today?
            </p>
          </div>
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => {
                setOpen(false)
                scrollToId('contact')
              }}
              className="rim-card"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', border: '1px solid var(--line)', borderRadius: 14, textAlign: 'left' }}
            >
              <span style={{ display: 'inline-flex', color: 'var(--olive-deep)' }}><Calendar size={19} /></span>
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 14.5, fontWeight: 600 }}>Request an appointment</span>
                <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>We'll call you back to confirm</span>
              </span>
            </button>
            <a
              href={clinic.phoneHref}
              className="rim-card"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', border: '1px solid var(--line)', borderRadius: 14, textDecoration: 'none', color: 'var(--ink)' }}
            >
              <span style={{ display: 'inline-flex', color: 'var(--olive-deep)' }}><Phone size={19} /></span>
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 14.5, fontWeight: 600 }}>Call {clinic.phone}</span>
                <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>Speak with our front desk</span>
              </span>
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: 42,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--olive-deep)',
          color: 'var(--on-olive)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 18px 36px -14px rgba(74,83,39,.6)',
          animation: open ? 'none' : 'rimPulse 2.6s ease-out infinite',
        }}
      >
        {open ? <Close size={22} /> : <Chat size={24} />}
      </button>
    </>
  )
}
