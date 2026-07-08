import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { locations, site } from '../data/clinic'
import { useScrolled } from '../hooks/useReveal'
import { useClinicStatus } from '../hooks/useClinicStatus'
import { Menu, Close, Chevron } from './icons'
import CallMenu from './CallMenu'

const NAV = [
  { to: '/about', label: 'About' },
  { to: '/conditions', label: 'Conditions' },
  { to: '/services', label: 'Services' },
  { to: '/insurance', label: 'Insurance' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const scrolled = useScrolled(24)
  const status = useClinicStatus()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [locOpen, setLocOpen] = useState(false)
  const locRef = useRef<HTMLDivElement>(null)

  // Solid chrome once scrolled, and always on interior pages.
  const solid = scrolled || pathname !== '/'

  const go = (to: string) => {
    setMenuOpen(false)
    setLocOpen(false)
    navigate(to)
  }

  // Close the locations dropdown on outside click.
  useEffect(() => {
    if (!locOpen) return
    const onDoc = (e: MouseEvent) => {
      if (locRef.current && !locRef.current.contains(e.target as Node)) setLocOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [locOpen])

  // Close both menus whenever the route changes.
  useEffect(() => {
    setLocOpen(false)
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <a
        href="/contact"
        onClick={(e) => {
          e.preventDefault()
          go('/contact')
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
          background: solid ? 'var(--header-bg)' : 'transparent',
          borderBottom: `1px solid ${solid ? 'var(--line)' : 'transparent'}`,
          boxShadow: solid ? '0 10px 30px -22px rgba(43,43,36,.5)' : 'none',
          backdropFilter: solid ? 'saturate(1.4) blur(12px)' : 'none',
          WebkitBackdropFilter: solid ? 'saturate(1.4) blur(12px)' : 'none',
          transition:
            'background .4s ease, border-color .4s ease, box-shadow .4s ease, backdrop-filter .4s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1220,
            margin: '0 auto',
            padding: '0 clamp(18px,4vw,48px)',
            height: solid ? 66 : 76,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            transition: 'height .35s ease',
          }}
        >
          <button
            onClick={() => go('/')}
            aria-label={`${site.brand} — home`}
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
                style={{ fontFamily: "'Fraunces',serif", fontSize: 21, fill: 'var(--olive-deep)' }}
              >
                {site.logoLetter}
              </text>
            </svg>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 19, lineHeight: 1, letterSpacing: '.01em', whiteSpace: 'nowrap' }}>
                {site.shortName}
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
                {site.tagline}
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="rim-desktop-nav" style={{ alignItems: 'center', gap: 2 }}>
            {/* Locations dropdown */}
            <div ref={locRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setLocOpen((v) => !v)}
                className="rim-navlink"
                aria-haspopup="true"
                aria-expanded={locOpen}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 14px',
                  fontSize: 14.5,
                  fontWeight: pathname.startsWith('/locations') ? 600 : 500,
                  color: pathname.startsWith('/locations') ? 'var(--olive-deep)' : 'var(--ink)',
                  borderRadius: 8,
                }}
              >
                Locations
                <Chevron size={14} style={{ transform: locOpen ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} />
              </button>
              {locOpen && (
                <div
                  role="menu"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    left: 0,
                    minWidth: 300,
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: 16,
                    boxShadow: '0 24px 50px -24px rgba(43,43,36,.45)',
                    padding: 8,
                    zIndex: 60,
                    animation: 'rimRise .22s cubic-bezier(.22,.61,.36,1) both',
                  }}
                >
                  {locations.map((loc) => (
                    <button
                      key={loc.id}
                      role="menuitem"
                      onClick={() => go(`/locations/${loc.id}`)}
                      style={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 10 }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg2)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{loc.city}</span>
                      <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{loc.name} · {loc.phone}</span>
                    </button>
                  ))}
                  <button
                    role="menuitem"
                    onClick={() => go('/contact')}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 14px', marginTop: 4, borderTop: '1px solid var(--line)', borderRadius: 10, fontFamily: "'DM Mono',monospace", fontSize: 12, letterSpacing: '.1em', color: 'var(--olive-deep)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    SEE BOTH ON CONTACT →
                  </button>
                </div>
              )}
            </div>
            {NAV.map((item) => {
              const active = pathname === item.to
              return (
                <button
                  key={item.to}
                  onClick={() => go(item.to)}
                  className="rim-navlink"
                  aria-current={active ? 'page' : undefined}
                  style={{
                    position: 'relative',
                    padding: '9px 14px',
                    fontSize: 14.5,
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--olive-deep)' : 'var(--ink)',
                    borderRadius: 8,
                  }}
                >
                  {item.label}
                  <span className="rim-navbar" style={active ? { transform: 'scaleX(1)' } : undefined} />
                </button>
              )
            })}
          </nav>

          <div className="rim-desktop-actions" style={{ alignItems: 'center', gap: 12 }}>
            <CallMenu
              label="Call"
              align="right"
              triggerStyle={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                padding: '10px 16px',
                border: '1px solid var(--line)',
                borderRadius: 999,
                fontFamily: "'DM Mono',monospace",
                fontSize: 13.5,
                background: 'transparent',
                color: 'var(--ink)',
                cursor: 'pointer',
              }}
            />
            <button
              onClick={() => go('/contact')}
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
            <CallMenu
              iconOnly
              align="right"
              iconColor="var(--olive-deep)"
              iconSize={17}
              triggerStyle={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
                height: 42,
                border: '1px solid var(--line)',
                borderRadius: 999,
                color: 'var(--olive-deep)',
                background: 'var(--card)',
                cursor: 'pointer',
              }}
            />
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
            {NAV.map((item) => {
              const active = pathname === item.to
              return (
                <button
                  key={item.to}
                  onClick={() => go(item.to)}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    textAlign: 'left',
                    fontFamily: "'Fraunces',serif",
                    fontSize: 36,
                    color: active ? 'var(--olive)' : 'var(--ink)',
                    padding: '14px 0',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Locations */}
          <div style={{ paddingTop: 22 }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--olive)' }}>
              Locations
            </span>
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => go(`/locations/${loc.id}`)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 0',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 26, color: 'var(--ink)' }}>{loc.city}</span>
                <span style={{ display: 'block', fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'var(--ink-soft)', marginTop: 3 }}>{loc.name}</span>
              </button>
            ))}
          </div>

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
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
              Call an office
            </span>
            {locations.map((loc) => (
              <a
                key={loc.id}
                href={loc.phoneHref}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  background: 'var(--olive-deep)',
                  color: 'var(--on-olive)',
                  padding: '14px 20px',
                  borderRadius: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: 15.5,
                }}
              >
                <span>{loc.phone}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11.5, fontWeight: 400, color: 'rgba(241,246,241,.72)' }}>{loc.city}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
