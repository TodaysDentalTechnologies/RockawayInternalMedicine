import { useState } from 'react'
import { clinic } from '../data/clinic'
import { useScrolled } from '../hooks/useReveal'
import { useClinicStatus } from '../hooks/useClinicStatus'
import { Phone, Menu, Close } from './icons'

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'conditions', label: 'Conditions' },
  { id: 'services', label: 'Services' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'contact', label: 'Contact' },
]

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Header() {
  const scrolled = useScrolled(24)
  const status = useClinicStatus()
  const [menuOpen, setMenuOpen] = useState(false)

  const go = (id: string) => {
    setMenuOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <a
        href="#contact"
        onClick={(e) => {
          e.preventDefault()
          go('contact')
        }}
        style={{
          position: 'absolute',
          left: 16,
          top: -64,
          zIndex: 99,
          background: 'var(--olive-deep)',
          color: 'var(--on-olive)',
          padding: '10px 18px',
          borderRadius: 10,
          fontSize: 14,
          textDecoration: 'none',
        }}
        onFocus={(e) => (e.currentTarget.style.top = '16px')}
        onBlur={(e) => (e.currentTarget.style.top = '-64px')}
      >
        Skip to appointment request
      </a>

      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: scrolled ? 'var(--header-bg)' : 'transparent',
          borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
          boxShadow: scrolled ? '0 10px 30px -22px rgba(43,43,36,.5)' : 'none',
          backdropFilter: scrolled ? 'saturate(1.4) blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'saturate(1.4) blur(12px)' : 'none',
          transition:
            'background .4s ease, border-color .4s ease, box-shadow .4s ease, backdrop-filter .4s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1220,
            margin: '0 auto',
            padding: '0 clamp(18px,4vw,48px)',
            height: scrolled ? 66 : 76,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            transition: 'height .35s ease',
          }}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={`${clinic.name} — back to top`}
            style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" style={{ flex: 'none' }}>
              <circle
                cx="20"
                cy="20"
                r="17.5"
                style={{
                  fill: 'none',
                  stroke: 'var(--olive)',
                  strokeWidth: 1.6,
                  strokeDasharray: 110,
                  strokeDashoffset: 110,
                  animation: 'rimDraw 1.1s cubic-bezier(.4,0,.2,1) .25s forwards',
                }}
              />
              <circle cx="33.5" cy="9.5" r="2.6" style={{ fill: 'var(--accent)' }} />
              <text
                x="20"
                y="26.5"
                textAnchor="middle"
                style={{ fontFamily: "'Instrument Serif',serif", fontSize: 21, fill: 'var(--olive-deep)' }}
              >
                R
              </text>
            </svg>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 19, lineHeight: 1, letterSpacing: '.01em' }}>
                {clinic.shortName}
              </span>
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 9,
                  letterSpacing: '.32em',
                  color: 'var(--olive)',
                  textTransform: 'uppercase',
                }}
              >
                {clinic.tagline}
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="rim-desktop-nav" style={{ alignItems: 'center', gap: 2 }}>
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className="rim-navlink"
                style={{
                  position: 'relative',
                  padding: '9px 14px',
                  fontSize: 14.5,
                  fontWeight: 500,
                  color: 'var(--ink)',
                  borderRadius: 8,
                }}
              >
                {item.label}
                <span className="rim-navbar" />
              </button>
            ))}
          </nav>

          <div className="rim-desktop-actions" style={{ alignItems: 'center', gap: 12 }}>
            <a
              href={clinic.phoneHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                padding: '10px 16px',
                border: '1px solid var(--line)',
                borderRadius: 999,
                fontFamily: "'DM Mono',monospace",
                fontSize: 13.5,
                textDecoration: 'none',
              }}
            >
              <Phone size={15} style={{ color: 'var(--olive)' }} />
              {clinic.phone}
            </a>
            <button
              onClick={() => go('contact')}
              className="rim-cta"
              style={{
                background: 'var(--olive-deep)',
                color: 'var(--on-olive)',
                padding: '12px 22px',
                borderRadius: 999,
                fontSize: 14.5,
                fontWeight: 600,
              }}
            >
              Request appointment
            </button>
          </div>

          {/* Mobile actions */}
          <div className="rim-mobile-actions" style={{ alignItems: 'center', gap: 10 }}>
            <a
              href={clinic.phoneHref}
              aria-label={`Call ${clinic.phone}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
                height: 42,
                border: '1px solid var(--line)',
                borderRadius: 999,
                color: 'var(--olive-deep)',
                background: 'var(--card)',
              }}
            >
              <Phone size={17} />
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
                height: 42,
                border: '1px solid var(--line)',
                borderRadius: 999,
                background: 'var(--card)',
                color: 'var(--ink)',
              }}
            >
              {menuOpen ? <Close size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 45,
            background: 'var(--bg)',
            padding: '110px clamp(24px,7vw,48px) 40px',
            display: 'flex',
            flexDirection: 'column',
            animation: 'rimRise .3s ease both',
            overflow: 'auto',
          }}
        >
          <nav aria-label="Mobile" style={{ display: 'flex', flexDirection: 'column' }}>
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                style={{
                  textAlign: 'left',
                  fontFamily: "'Instrument Serif',serif",
                  fontSize: 36,
                  padding: '14px 0',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div style={{ marginTop: 'auto', paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: "'DM Mono',monospace",
                fontSize: 12.5,
                color: 'var(--ink-soft)',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: status.color,
                  animation: 'rimBlink 2.4s infinite',
                }}
              />
              {status.label} · {status.sub}
            </span>
            <a
              href={clinic.phoneHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: 'var(--olive-deep)',
                color: 'var(--on-olive)',
                padding: '16px 24px',
                borderRadius: 999,
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: 16,
              }}
            >
              Call {clinic.phone}
            </a>
          </div>
        </div>
      )}
    </>
  )
}
