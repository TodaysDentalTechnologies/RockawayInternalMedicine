import { useState } from 'react'
import { clinic } from '../data/clinic'
import SectionHeading from './SectionHeading'
import { scrollToId } from './Header'
import { Clipboard, Activity, Stethoscope, Flask, Syringe, Video, ArrowRight } from './icons'
import type { ReactNode } from 'react'

const SERVICES: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <Clipboard size={21} />,
    title: 'Annual Physicals & Preventive Care',
    body: 'A proper head-to-toe: screenings, vaccines, and labs timed to your age and risk — with time left to talk.',
  },
  {
    icon: <Activity size={21} />,
    title: 'Chronic Disease Management',
    body: 'Diabetes, hypertension, cholesterol, thyroid — steady, coordinated care that keeps small issues small.',
  },
  {
    icon: <Stethoscope size={21} />,
    title: 'Sick Visits & Same-Week Care',
    body: "Fevers, infections, aches, and flare-ups seen quickly — often the same week you call.",
  },
  {
    icon: <Flask size={21} />,
    title: 'Lab Work & Diagnostics',
    body: 'On-site blood draws, EKGs, and results reviewed with you — not just texted a number.',
  },
  {
    icon: <Syringe size={21} />,
    title: 'Vaccines & Immunizations',
    body: 'Flu, pneumonia, shingles, tetanus, and travel shots kept current and on schedule.',
  },
  {
    icon: <Video size={21} />,
    title: 'Telehealth Visits',
    body: 'Follow-ups, refills, and quick questions handled from home when a visit isn’t needed.',
  },
]

const FINDER: { concern: string; match: string; note: string }[] = [
  { concern: 'I feel run down / low energy', match: 'Lab Work & Diagnostics', note: 'We’ll check iron, B12, thyroid, and blood sugar to find the cause.' },
  { concern: 'I need a check-up or physical', match: 'Annual Physicals & Preventive Care', note: 'Book a full preventive visit — new patients welcome.' },
  { concern: 'I have a long-term condition', match: 'Chronic Disease Management', note: 'One team keeps your diabetes, BP, or thyroid on track.' },
  { concern: 'I’m sick right now', match: 'Sick Visits & Same-Week Care', note: 'Call us — we keep same-week slots open for this.' },
  { concern: 'I need a vaccine or shot', match: 'Vaccines & Immunizations', note: 'Flu, shingles, tetanus and more — walk you through what’s due.' },
]

export default function Services() {
  const [pick, setPick] = useState<number | null>(null)

  return (
    <section id="services" style={{ background: 'var(--bg2)', padding: 'clamp(72px,9vw,124px) 0 0' }}>
      <div style={{ maxWidth: 1220, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        <SectionHeading eyebrow="What we do" maxWidth={640}>
          Primary care, <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>end to end.</em>
        </SectionHeading>
        <p className="reveal" style={{ fontSize: 16.5, lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 20, maxWidth: 640 }}>
          From the annual physical to the years-long management of a chronic condition — one practice, one record, one team.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
            gap: 16,
            marginTop: 48,
          }}
        >
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="rim-card reveal"
              style={{
                transitionDelay: `${(i % 3) * 0.04}s`,
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 20,
                padding: 26,
              }}
            >
              <span
                className="rim-svc-icon"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: 'rgba(107,122,63,.11)',
                  color: 'var(--olive-deep)',
                }}
              >
                {s.icon}
              </span>
              <h3 style={{ fontSize: 17.5, fontWeight: 600, letterSpacing: '-.01em', marginTop: 18 }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 8 }}>{s.body}</p>
            </div>
          ))}
        </div>

        {/* Interactive service finder */}
        <div
          className="reveal"
          style={{
            marginTop: 'clamp(56px,7vw,88px)',
            background: 'linear-gradient(150deg, var(--olive-deep), #22280f)',
            borderRadius: 28,
            padding: 'clamp(28px,4vw,52px)',
            color: 'var(--on-olive)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
            gap: 'clamp(28px,4vw,56px)',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              Not sure where to start?
            </span>
            <h3 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontSize: 'clamp(26px,3vw,38px)', lineHeight: 1.1, marginTop: 14 }}>
              Tell us what's going on — we'll point you to the right visit.
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 26 }}>
              {FINDER.map((f, i) => {
                const active = pick === i
                return (
                  <button
                    key={f.concern}
                    onClick={() => setPick(i)}
                    style={{
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '14px 18px',
                      borderRadius: 14,
                      border: `1px solid ${active ? 'var(--accent)' : 'rgba(239,237,221,.22)'}`,
                      background: active ? 'rgba(200,213,160,.14)' : 'transparent',
                      color: 'var(--on-olive)',
                      fontSize: 15,
                      fontWeight: 500,
                      transition: 'background .3s, border-color .3s',
                    }}
                  >
                    {f.concern}
                    <ArrowRight size={16} style={{ color: 'var(--accent)', opacity: active ? 1 : 0.5 }} />
                  </button>
                )
              })}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(247,245,239,.06)',
              border: '1px solid rgba(239,237,221,.18)',
              borderRadius: 22,
              padding: 'clamp(24px,3vw,36px)',
              minHeight: 240,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {pick === null ? (
              <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--on-dark-soft, rgba(239,237,221,.72))' }}>
                Pick a concern on the left and we'll show you the matching service and the fastest way to get seen.
              </p>
            ) : (
              <div key={pick} style={{ animation: 'rimPop .5s cubic-bezier(.22,.61,.36,1) both' }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11.5, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                  Recommended
                </span>
                <h4 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontSize: 28, lineHeight: 1.15, marginTop: 12 }}>
                  {FINDER[pick].match}
                </h4>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(239,237,221,.8)', marginTop: 12 }}>{FINDER[pick].note}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 22 }}>
                  <button
                    onClick={() => scrollToId('contact')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 9,
                      background: 'var(--accent)',
                      color: 'var(--accent-ink)',
                      padding: '13px 22px',
                      borderRadius: 999,
                      fontSize: 14.5,
                      fontWeight: 600,
                    }}
                  >
                    Request this visit
                    <ArrowRight size={15} />
                  </button>
                  <a
                    href={clinic.phoneHref}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 9,
                      border: '1px solid rgba(239,237,221,.3)',
                      color: 'var(--on-olive)',
                      padding: '13px 20px',
                      borderRadius: 999,
                      fontSize: 14.5,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Call {clinic.phone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
