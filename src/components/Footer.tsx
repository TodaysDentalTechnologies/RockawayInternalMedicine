import { clinic } from '../data/clinic'
import { useClinicStatus } from '../hooks/useClinicStatus'
import { scrollToId } from './Header'
import { Phone, MapPin } from './icons'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'conditions', label: 'Conditions' },
  { id: 'services', label: 'Services' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'contact', label: 'Contact' },
]

export default function Footer() {
  const status = useClinicStatus()

  return (
    <footer style={{ background: '#0e2416', color: 'var(--on-olive)' }}>
      <div
        style={{
          maxWidth: 1220,
          margin: '0 auto',
          padding: 'clamp(56px,7vw,88px) clamp(18px,4vw,48px) 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))',
          gap: 'clamp(32px,4vw,64px)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r="17.5" style={{ fill: 'none', stroke: 'var(--accent)', strokeWidth: 1.6 }} />
              <circle cx="33.5" cy="9.5" r="2.6" style={{ fill: 'var(--accent)' }} />
              <text x="20" y="26.5" textAnchor="middle" style={{ fontFamily: "'Instrument Serif',serif", fontSize: 21, fill: 'var(--on-olive)' }}>R</text>
            </svg>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, lineHeight: 1 }}>{clinic.shortName}</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '.32em', color: 'var(--accent)', textTransform: 'uppercase' }}>
                {clinic.tagline}
              </span>
            </span>
          </div>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'rgba(232,239,230,.66)', marginTop: 18, maxWidth: '34ch' }}>
            Adult internal medicine & primary care in Jamaica, Queens. Unhurried visits, same-week appointments, one team
            that knows you.
          </p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, fontFamily: "'DM Mono',monospace", fontSize: 12.5, color: 'rgba(232,239,230,.8)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: status.color, animation: 'rimBlink 2.4s infinite' }} />
            {status.label} · {status.sub}
          </span>
        </div>

        <div>
          <h4 style={{ fontFamily: "'DM Mono',monospace", fontSize: 11.5, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16 }}>
            Explore
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToId(l.id)}
                className="rim-foot-link"
                style={{ textAlign: 'left', fontSize: 15, color: 'rgba(232,239,230,.82)' }}
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <h4 style={{ fontFamily: "'DM Mono',monospace", fontSize: 11.5, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16 }}>
            Get in touch
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <a href={clinic.phoneHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 15, color: 'rgba(232,239,230,.9)', textDecoration: 'none' }}>
              <Phone size={17} style={{ color: 'var(--accent)' }} />
              {clinic.phone}
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(clinic.fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, fontSize: 15, lineHeight: 1.5, color: 'rgba(232,239,230,.9)', textDecoration: 'none', maxWidth: '28ch' }}
            >
              <MapPin size={17} style={{ color: 'var(--accent)', flex: 'none', marginTop: 2 }} />
              {clinic.address}, {clinic.city}, {clinic.stateAbbr} {clinic.zip}
            </a>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(232,239,230,.14)' }}>
        <div
          style={{
            maxWidth: 1220,
            margin: '0 auto',
            padding: '20px clamp(18px,4vw,48px)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px 20px',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12.5,
            color: 'rgba(232,239,230,.55)',
          }}
        >
          <span>© {clinic.name}. All rights reserved.</span>
          <span style={{ fontFamily: "'DM Mono',monospace", letterSpacing: '.04em' }}>Jamaica · Queens · New York</span>
        </div>
      </div>
    </footer>
  )
}
