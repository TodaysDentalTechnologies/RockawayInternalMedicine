import { useClinicStatus } from '../hooks/useClinicStatus'
import { mapsSearchUrl, mapsEmbedUrl, type Location } from '../data/clinic'
import { ArrowRight } from './icons'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function fmtHour(h: number): string {
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:00 ${period}`
}

// Weekday index (0 = Sun) in the location's own timezone.
function todayIndex(tz: string): number {
  try {
    const wd = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }).format(new Date())
    const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
    return map[wd] ?? new Date().getDay()
  } catch {
    return new Date().getDay()
  }
}

// One office: dark info panel (address, phone, hours, live status) beside an
// embedded map. Used on the Contact page (once per location) and the Location
// pages.
export default function LocationCard({ location }: { location: Location }) {
  const status = useClinicStatus(location)
  const todayIdx = todayIndex(location.timezone)

  const dayRows = [1, 2, 3, 4, 5, 6, 0].map((d) => ({
    d,
    name: DAY_NAMES[d],
    value: location.hours[d]
      ? `${fmtHour(location.hours[d]!.open)} – ${fmtHour(location.hours[d]!.close)}`
      : 'Closed',
  }))

  return (
    <div
      className="reveal"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 28,
        overflow: 'hidden',
        boxShadow: '0 34px 70px -36px rgba(43,43,36,.35)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,430px),1fr))',
      }}
    >
      {/* Dark info panel */}
      <div style={{ background: 'var(--dark)', color: 'var(--on-dark)', padding: 'clamp(26px,3.6vw,42px)', position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden="true"
          style={{ position: 'absolute', right: -130, top: -110, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, rgba(179,209,187,.15), transparent 68%)', pointerEvents: 'none' }}
        />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'DM Mono',monospace", fontSize: 11.5, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              <span style={{ width: 22, height: 1.5, background: 'var(--accent)' }} />
              {location.city}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: "'DM Mono',monospace", fontSize: 11.5, border: '1px solid rgba(232,239,230,.25)', borderRadius: 999, padding: '6px 12px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: status.color, animation: 'rimBlink 2.4s infinite' }} />
              {status.label}
            </span>
          </div>

          <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(24px,2.4vw,32px)', lineHeight: 1.1, marginTop: 20 }}>
            {location.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px 18px', flexWrap: 'wrap', marginTop: 14 }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 600 }}>{location.address}</p>
              <p style={{ fontSize: 14.5, color: 'var(--on-dark-soft)', marginTop: 3 }}>
                {location.city}, {location.stateAbbr} {location.zip}
              </p>
            </div>
            <a
              href={mapsSearchUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: "'DM Mono',monospace", fontSize: 12, letterSpacing: '.14em', color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 3, paddingTop: 4 }}
            >
              GET DIRECTIONS <ArrowRight size={12} strokeWidth={2} />
            </a>
          </div>

          <div style={{ height: 1, background: 'rgba(232,239,230,.14)', margin: '22px 0' }} />

          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '.2em', color: 'var(--on-dark-soft)' }}>CALL THE FRONT DESK</p>
          <a
            href={location.phoneHref}
            style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(26px,2.6vw,34px)', lineHeight: 1.1, color: 'var(--on-dark)', textDecoration: 'none', marginTop: 8, alignSelf: 'flex-start' }}
          >
            {location.phone}
          </a>

          <div style={{ height: 1, background: 'rgba(232,239,230,.14)', margin: '22px 0' }} />

          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '.2em', color: 'var(--on-dark-soft)' }}>OFFICE HOURS</p>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}>
            {dayRows.map((row) => {
              const isToday = row.d === todayIdx
              return (
                <span
                  key={row.d}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 14,
                    fontSize: 14,
                    padding: '6px 10px',
                    borderRadius: 8,
                    color: isToday ? 'var(--on-dark)' : 'var(--on-dark-soft)',
                    background: isToday ? 'rgba(179,209,187,.14)' : 'transparent',
                    fontWeight: isToday ? 600 : 400,
                  }}
                >
                  <span>{row.name}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12.5 }}>{row.value}</span>
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ background: 'var(--bg2)', minHeight: 320 }}>
        <iframe
          title={`Map showing ${location.name} at ${location.fullAddress}`}
          src={mapsEmbedUrl(location)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ width: '100%', height: '100%', minHeight: 320, border: 0, display: 'block', filter: 'saturate(.85) grayscale(.15)' }}
        />
      </div>
    </div>
  )
}
