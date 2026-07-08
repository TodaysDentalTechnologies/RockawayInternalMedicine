import { locations } from '../data/clinic'
import SectionHeading from './SectionHeading'
import LocationCard from './LocationCard'
import AppointmentForm from './AppointmentForm'
import { Check, PhoneCall, Heart } from './icons'

const GOOD_TO_KNOW = ['Same-week appointments', 'New patients welcome', 'Most major insurance accepted']

const WHAT_TO_BRING = ['Photo ID', 'Insurance card', 'Current medications list', 'Referrals or recent test results']

const HOURS = [
  { label: 'Mon – Fri', value: '9:00 AM – 5:00 PM' },
  { label: 'Saturday', value: '9:00 AM – 1:00 PM' },
  { label: 'Sunday', value: 'Closed' },
]

const eyebrowStyle: React.CSSProperties = {
  fontFamily: "'DM Mono',monospace",
  fontSize: 11.5,
  letterSpacing: '.22em',
  textTransform: 'uppercase',
  color: 'var(--olive)',
}

const divider: React.CSSProperties = { height: 1, background: 'var(--line)' }

export default function Contact() {
  return (
    <section id="contact" style={{ background: 'var(--bg)', padding: 'clamp(64px,8vw,110px) 0 clamp(72px,9vw,124px)' }}>
      <div style={{ maxWidth: 1500, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 48px', alignItems: 'end', justifyContent: 'space-between' }}>
          <SectionHeading eyebrow="Visits & contact" headingMaxWidth="15ch">
            Two Queens locations, <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>one team.</em>
          </SectionHeading>
          <p className="reveal" style={{ transitionDelay: '.1s', fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: '40ch', paddingBottom: 6 }}>
            Request an appointment online or call an office directly — whatever's easiest for you.
          </p>
        </div>

        {/* Main split: appointment wizard + one cohesive contact panel */}
        <div className="rim-contact-split" style={{ marginTop: 'clamp(36px,4.5vw,52px)' }}>
          <div className="reveal" style={{ marginTop: 22 }}>
            <AppointmentForm />
          </div>

          <aside style={{ marginTop: 22, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div
              className="reveal"
              style={{
                borderRadius: 24,
                overflow: 'hidden',
                border: '1px solid var(--line)',
                boxShadow: '0 30px 60px -42px rgba(28,74,44,.55)',
              }}
            >
              {/* Dark "call" header */}
              <div
                style={{
                  background: 'linear-gradient(155deg, var(--dark), var(--dark2))',
                  color: 'var(--on-dark)',
                  padding: 'clamp(24px,2.8vw,30px)',
                }}
              >
                <span style={{ ...eyebrowStyle, color: 'var(--accent)' }}>Prefer to call?</span>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(22px,2.2vw,28px)', lineHeight: 1.12, marginTop: 8 }}>
                  Reach an office directly.
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
                  {locations.map((loc) => (
                    <a
                      key={loc.id}
                      href={loc.phoneHref}
                      className="rim-foot-link"
                      style={{ display: 'flex', alignItems: 'center', gap: 13, textDecoration: 'none', color: 'var(--on-dark)' }}
                    >
                      <span
                        style={{
                          flex: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 42,
                          height: 42,
                          borderRadius: 13,
                          background: 'rgba(241,246,241,.1)',
                          color: 'var(--on-dark)',
                        }}
                      >
                        <PhoneCall size={17} />
                      </span>
                      <span style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--on-dark-soft)' }}>
                          {loc.city}
                        </span>
                        <span style={{ fontSize: 17, fontWeight: 600 }}>{loc.phone}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Light body — grouped info sections */}
              <div style={{ background: 'var(--card)', padding: 'clamp(24px,2.8vw,30px)', display: 'flex', flexDirection: 'column', gap: 22 }}>
                {/* Good to know */}
                <div>
                  <span style={eyebrowStyle}>Good to know</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                    {GOOD_TO_KNOW.map((t) => (
                      <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 11, fontSize: 14.5, color: 'var(--ink)' }}>
                        <span style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'rgba(46,107,67,.12)', color: 'var(--olive-deep)' }}>
                          <Check size={13} />
                        </span>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={divider} />

                {/* What to bring */}
                <div>
                  <span style={eyebrowStyle}>What to bring</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 16 }}>
                    {WHAT_TO_BRING.map((t) => (
                      <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 11, fontSize: 14.5, color: 'var(--ink)' }}>
                        <span style={{ flex: 'none', width: 7, height: 7, transform: 'rotate(45deg)', background: 'var(--sage)' }} />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={divider} />

                {/* Office hours */}
                <div>
                  <span style={eyebrowStyle}>Office hours</span>
                  <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {HOURS.map((h) => (
                      <span key={h.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14, color: 'var(--ink-soft)' }}>
                        <span>{h.label}</span>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12.5, color: 'var(--ink)' }}>{h.value}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Fills the remaining height beside the form — neutral brand note. */}
            <div
              className="reveal"
              style={{
                flex: 1,
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 12,
                background: 'linear-gradient(160deg, rgba(179,209,187,.35), rgba(255,255,255,.5))',
                border: '1px solid var(--line)',
                borderRadius: 22,
                boxShadow: '0 26px 50px -40px rgba(28,74,44,.5)',
                padding: 'clamp(24px,2.8vw,30px)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 13, background: 'rgba(46,107,67,.14)', color: 'var(--olive-deep)' }}>
                <Heart size={19} />
              </span>
              <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(18px,1.9vw,22px)', lineHeight: 1.25, color: 'var(--ink)' }}>
                Two offices, one team — thorough, unhurried care for adults across Queens.
              </p>
              <span style={eyebrowStyle}>Now accepting new patients</span>
            </div>
          </aside>
        </div>

        {/* Our locations — full details + map for each office, side by side */}
        <div style={{ marginTop: 'clamp(48px,7vw,88px)' }}>
          <SectionHeading eyebrow="Our locations" headingMaxWidth="15ch">
            Full details for <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>each office.</em>
          </SectionHeading>
          <div className="rim-contact-locs" style={{ marginTop: 32 }}>
            {locations.map((loc) => (
              <LocationCard key={loc.id} location={loc} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
