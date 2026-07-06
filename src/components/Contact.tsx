import { useState } from 'react'
import { clinic, hoursDisplay } from '../data/clinic'
import SectionHeading from './SectionHeading'
import { MapPin, Phone, Clock, Check, ArrowRight } from './icons'

const CONFETTI_COLORS = ['#6B7A3F', '#A3B18A', '#C8D5A0', '#B08D57', '#4A5327']

function Confetti() {
  const pieces = Array.from({ length: 26 }, (_, i) => {
    const angle = (i / 26) * Math.PI * 2
    const dist = 60 + Math.random() * 90
    const dx = `${Math.cos(angle) * dist}px`
    const dy = `${Math.sin(angle) * dist - 40}px`
    const rot = `${Math.random() * 540 - 270}deg`
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
    return (
      <span
        key={i}
        style={{
          position: 'absolute',
          left: '50%',
          top: '42%',
          width: 8,
          height: 8,
          borderRadius: i % 2 ? '50%' : 2,
          background: color,
          // @ts-expect-error custom props
          '--dx': dx,
          '--dy': dy,
          '--rot': rot,
          animation: `rimConfetti ${0.9 + Math.random() * 0.5}s cubic-bezier(.22,.61,.36,1) both`,
        }}
      />
    )
  })
  return <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>{pieces}</div>
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: 12,
  border: '1px solid var(--line)',
  background: 'var(--bg2)',
  color: 'var(--ink)',
  fontSize: 15,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 7,
  color: 'var(--ink)',
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" style={{ background: 'var(--bg2)', padding: 'clamp(72px,9vw,124px) 0' }}>
      <div
        style={{
          maxWidth: 1220,
          margin: '0 auto',
          padding: '0 clamp(18px,4vw,48px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))',
          gap: 'clamp(32px,4vw,56px)',
          alignItems: 'start',
        }}
      >
        {/* Left: info + map */}
        <div className="reveal">
          <SectionHeading eyebrow="Visit us">
            Request an <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>appointment.</em>
          </SectionHeading>
          <p style={{ fontSize: 16.5, lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 20 }}>
            Send a request and we'll call you back to confirm a time — usually the same business day. Prefer to talk now?
            Just call.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 30 }}>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(clinic.fullAddress)}`} target="_blank" rel="noopener noreferrer" className="rim-info-row" style={infoRow}>
              <span style={infoIcon}><MapPin size={19} /></span>
              <span>
                <span style={infoLabel}>Address</span>
                <span style={infoValue}>{clinic.address}, {clinic.city}, {clinic.stateAbbr} {clinic.zip}</span>
              </span>
            </a>
            <a href={clinic.phoneHref} className="rim-info-row" style={infoRow}>
              <span style={infoIcon}><Phone size={19} /></span>
              <span>
                <span style={infoLabel}>Phone</span>
                <span style={infoValue}>{clinic.phone}</span>
              </span>
            </a>
            <div style={infoRow}>
              <span style={infoIcon}><Clock size={19} /></span>
              <span>
                <span style={infoLabel}>Hours</span>
                {hoursDisplay.map((h) => (
                  <span key={h.label} style={{ ...infoValue, display: 'flex', justifyContent: 'space-between', gap: 18, maxWidth: 300 }}>
                    <span style={{ color: 'var(--ink-soft)' }}>{h.label}</span>
                    <span style={{ fontWeight: 600 }}>{h.value}</span>
                  </span>
                ))}
              </span>
            </div>
          </div>

          <div style={{ marginTop: 26, borderRadius: 20, overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '16/10' }}>
            <iframe
              title={`Map to ${clinic.name}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(clinic.fullAddress)}&z=15&output=embed`}
              loading="lazy"
              style={{ width: '100%', height: '100%', border: 0, filter: 'grayscale(.2) contrast(1.02)' }}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Right: form */}
        <div
          className="reveal"
          style={{
            transitionDelay: '.12s',
            position: 'relative',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 26,
            padding: 'clamp(24px,3vw,38px)',
            boxShadow: '0 30px 60px -40px rgba(43,43,36,.4)',
          }}
        >
          {submitted ? (
            <div style={{ position: 'relative', textAlign: 'center', padding: '30px 8px 20px' }}>
              <Confetti />
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(107,122,63,.14)',
                  color: 'var(--olive-deep)',
                  animation: 'rimPop .6s cubic-bezier(.22,.61,.36,1) both',
                }}
              >
                <Check size={30} />
              </span>
              <h3 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontSize: 30, marginTop: 20 }}>Request received</h3>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 12, maxWidth: '38ch', marginInline: 'auto' }}>
                Thanks — we'll call you back shortly to confirm your appointment. Need to be seen sooner? Call{' '}
                <a href={clinic.phoneHref} style={{ color: 'var(--olive-deep)', fontWeight: 600 }}>{clinic.phone}</a>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                style={{ marginTop: 22, fontSize: 14, fontWeight: 600, color: 'var(--olive-deep)', textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: 20, fontWeight: 600 }}>Tell us how to reach you</h3>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 6, marginBottom: 22 }}>
                This form doesn't send medical records — please don't include sensitive health details.
              </p>

              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 16 }}>
                  <div>
                    <label style={labelStyle} htmlFor="rim-first">First name</label>
                    <input id="rim-first" name="first" required autoComplete="given-name" style={fieldStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="rim-last">Last name</label>
                    <input id="rim-last" name="last" required autoComplete="family-name" style={fieldStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="rim-phone">Phone</label>
                  <input id="rim-phone" name="phone" type="tel" required autoComplete="tel" placeholder="(718) 000-0000" style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="rim-email">Email <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>(optional)</span></label>
                  <input id="rim-email" name="email" type="email" autoComplete="email" style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="rim-reason">Reason for visit</label>
                  <select id="rim-reason" name="reason" style={{ ...fieldStyle, appearance: 'none' }} defaultValue="">
                    <option value="" disabled>Choose one…</option>
                    <option>New patient — physical / check-up</option>
                    <option>Chronic condition follow-up</option>
                    <option>Sick / same-week visit</option>
                    <option>Lab work or results</option>
                    <option>Vaccine / immunization</option>
                    <option>Something else</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="rim-note">Preferred day/time <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>(optional)</span></label>
                  <textarea id="rim-note" name="note" rows={3} placeholder="e.g. Weekday mornings" style={{ ...fieldStyle, resize: 'vertical' }} />
                </div>
              </div>

              <button
                type="submit"
                className="rim-cta"
                style={{
                  marginTop: 22,
                  width: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  background: 'var(--olive-deep)',
                  color: 'var(--on-olive)',
                  padding: '16px 24px',
                  borderRadius: 999,
                  fontSize: 15.5,
                  fontWeight: 600,
                }}
              >
                Request appointment
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

const infoRow: React.CSSProperties = {
  display: 'flex',
  gap: 14,
  padding: '14px 0',
  borderTop: '1px solid var(--line)',
  textDecoration: 'none',
  color: 'var(--ink)',
  alignItems: 'flex-start',
}
const infoIcon: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  flex: 'none',
  borderRadius: 12,
  background: 'rgba(107,122,63,.1)',
  color: 'var(--olive-deep)',
}
const infoLabel: React.CSSProperties = {
  display: 'block',
  fontFamily: "'DM Mono',monospace",
  fontSize: 11,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  color: 'var(--olive)',
  marginBottom: 4,
}
const infoValue: React.CSSProperties = { display: 'block', fontSize: 15.5, lineHeight: 1.5 }
