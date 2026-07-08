import { locations } from '../data/clinic'
import LocationCard from '../components/LocationCard'

// Index of all offices — one full LocationCard each.
export default function LocationsPage() {
  return (
    <section style={{ background: 'var(--bg)', padding: 'clamp(104px,15vh,152px) 0 clamp(64px,9vw,112px)' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        <div className="reveal" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: "'DM Mono',monospace", fontSize: 12.5, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--olive)' }}>
            <span style={{ width: 22, height: 1.5, background: 'var(--olive)' }} />
            Locations
            <span style={{ width: 22, height: 1.5, background: 'var(--olive)' }} />
          </span>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(40px,6vw,72px)', lineHeight: 1.02, letterSpacing: '-.015em', marginTop: 18 }}>
            Two Queens <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>offices.</em>
          </h1>
          <p style={{ fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 22 }}>
            Same team, same unhurried care — choose whichever office is closest to you.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 'clamp(48px,7vw,88px)' }}>
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      </div>
    </section>
  )
}
