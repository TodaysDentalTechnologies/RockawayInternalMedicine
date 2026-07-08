import { useNavigate } from 'react-router-dom'
import { locations, site, mapsSearchUrl } from '../data/clinic'
import { useClinicStatus } from '../hooks/useClinicStatus'
import { Phone, MapPin } from './icons'

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/conditions', label: 'Conditions' },
  { to: '/services', label: 'Services' },
  { to: '/insurance', label: 'Insurance' },
  { to: '/locations', label: 'Locations' },
  { to: '/contact', label: 'Contact' },
]

const h4Style: React.CSSProperties = {
  fontFamily: "'DM Mono',monospace",
  fontSize: 11.5,
  letterSpacing: '.2em',
  textTransform: 'uppercase',
  color: 'var(--accent)',
  marginBottom: 16,
}

export default function Footer() {
  const status = useClinicStatus()
  const navigate = useNavigate()

  return (
    <footer style={{ background: '#0e2416', color: 'var(--on-olive)' }}>
      <div
        style={{
          maxWidth: 1500,
          margin: '0 auto',
          padding: 'clamp(56px,7vw,88px) clamp(18px,4vw,48px) 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))',
          gap: 'clamp(32px,4vw,64px)',
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r="17.5" style={{ fill: 'none', stroke: 'var(--accent)', strokeWidth: 1.6 }} />
              <circle cx="33.5" cy="9.5" r="2.6" style={{ fill: 'var(--accent)' }} />
              <text x="20" y="26.5" textAnchor="middle" style={{ fontFamily: "'Fraunces',serif", fontSize: 21, fill: 'var(--on-olive)' }}>{site.logoLetter}</text>
            </svg>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, lineHeight: 1 }}>{site.shortName}</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '.32em', color: 'var(--accent)', textTransform: 'uppercase' }}>
                {site.tagline}
              </span>
            </span>
          </div>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'rgba(232,239,230,.66)', marginTop: 18, maxWidth: '34ch' }}>
            Adult internal medicine & primary care across two Queens locations. Unhurried visits, same-week appointments,
            one team that knows you.
          </p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, fontFamily: "'DM Mono',monospace", fontSize: 12.5, color: 'rgba(232,239,230,.8)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: status.color, animation: 'rimBlink 2.4s infinite' }} />
            {status.label} · {status.sub}
          </span>
        </div>

        {/* Explore */}
        <div>
          <h4 style={h4Style}>Explore</h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {LINKS.map((l) => (
              <button
                key={l.to}
                onClick={() => navigate(l.to)}
                className="rim-foot-link"
                style={{ textAlign: 'left', fontSize: 15, color: 'rgba(232,239,230,.82)' }}
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Our locations */}
        <div>
          <h4 style={h4Style}>Our locations</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {locations.map((loc) => (
              <div key={loc.id} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <button
                  onClick={() => navigate(`/locations/${loc.id}`)}
                  className="rim-foot-link"
                  style={{ textAlign: 'left', fontSize: 15.5, fontWeight: 600, color: 'var(--on-olive)' }}
                >
                  {loc.name}
                </button>
                <a
                  href={mapsSearchUrl(loc)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, fontSize: 14, lineHeight: 1.5, color: 'rgba(232,239,230,.82)', textDecoration: 'none', maxWidth: '30ch' }}
                >
                  <MapPin size={16} style={{ color: 'var(--accent)', flex: 'none', marginTop: 2 }} />
                  {loc.address}, {loc.city}, {loc.stateAbbr} {loc.zip}
                </a>
                <a
                  href={loc.phoneHref}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14.5, color: 'rgba(232,239,230,.9)', textDecoration: 'none' }}
                >
                  <Phone size={16} style={{ color: 'var(--accent)' }} />
                  {loc.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(232,239,230,.14)' }}>
        <div
          style={{
            maxWidth: 1500,
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
          <span>© {site.brand}. All rights reserved.</span>
          <span style={{ fontFamily: "'DM Mono',monospace", letterSpacing: '.04em' }}>Jamaica · Cambria Heights · Queens, NY</span>
        </div>
      </div>
    </footer>
  )
}
