import { useParams, useNavigate } from 'react-router-dom'
import { getLocation, locations } from '../data/clinic'
import LocationCard from '../components/LocationCard'
import { Calendar, ArrowRight, Phone } from '../components/icons'

// Detail page for a single office — the target of the header "Locations"
// dropdown (/locations/:id).
export default function LocationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = getLocation(id)

  if (!location) {
    return (
      <div style={{ paddingTop: 'clamp(120px,18vh,180px)', paddingBottom: 'clamp(64px,9vw,112px)', background: 'var(--bg)', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(34px,5vw,56px)' }}>Location not found</h1>
          <p style={{ color: 'var(--ink-soft)', marginTop: 16 }}>Pick one of our offices:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 20 }}>
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => navigate(`/locations/${loc.id}`)}
                className="rim-outline-btn"
                style={{ border: '1.5px solid var(--olive)', background: 'transparent', color: 'var(--olive-deep)', padding: '12px 22px', borderRadius: 999, fontSize: 14.5, fontWeight: 600 }}
              >
                {loc.city} — {loc.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const others = locations.filter((l) => l.id !== location.id)

  return (
    <div style={{ background: 'var(--bg)', paddingBottom: 'clamp(64px,9vw,112px)' }}>
      {/* Hero */}
      <section style={{ padding: 'clamp(104px,15vh,152px) 0 clamp(32px,5vw,52px)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
          <div className="reveal" style={{ maxWidth: 720 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'DM Mono',monospace", fontSize: 12.5, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--olive)' }}>
              <span style={{ width: 22, height: 1.5, background: 'var(--olive)' }} />
              Our {location.city} office
            </span>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(40px,6vw,72px)', lineHeight: 1.02, letterSpacing: '-.015em', marginTop: 18 }}>
              {location.name}
            </h1>
            <p style={{ fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 20, maxWidth: '54ch' }}>
              {location.fullAddress}. Board-certified primary care with unhurried visits and same-week appointments.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 30 }}>
              <button
                onClick={() => navigate('/contact')}
                className="rim-cta"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 11, background: 'var(--olive-deep)', color: 'var(--on-olive)', padding: '15px 26px', borderRadius: 999, fontSize: 15.5, fontWeight: 600 }}
              >
                <Calendar size={17} /> Request an appointment <ArrowRight size={16} />
              </button>
              <a
                href={location.phoneHref}
                className="rim-outline-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--ink)', padding: '15px 24px', borderRadius: 999, fontSize: 15.5, fontWeight: 600, textDecoration: 'none' }}
              >
                <Phone size={16} style={{ color: 'var(--olive)' }} /> Call {location.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Details card */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        <LocationCard location={location} />

        {others.length > 0 && (
          <div style={{ marginTop: 'clamp(40px,6vw,72px)' }}>
            <h2 style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
              Our other location
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
              {others.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => navigate(`/locations/${loc.id}`)}
                  className="rim-outline-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: '1.5px solid var(--olive)', background: 'transparent', color: 'var(--olive-deep)', padding: '13px 22px', borderRadius: 999, fontSize: 14.5, fontWeight: 600 }}
                >
                  {loc.city} — {loc.name} <ArrowRight size={15} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
