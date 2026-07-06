import { useRef, useState } from 'react'
import { clinic, hours } from '../data/clinic'
import { useClinicStatus } from '../hooks/useClinicStatus'
import SectionHeading from './SectionHeading'
import { MapPin, Phone, ArrowRight } from './icons'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const CONFETTI_COLORS = ['#6B7A3F', '#A3B18A', '#C8D5A0', '#B08D57', '#4A5327']
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.fullAddress)}`

const TYPES = [
  { value: 'New patient visit', title: 'New patient', sub: 'First visit with us' },
  { value: 'Follow-up visit', title: 'Follow-up', sub: 'Existing patient check-in' },
  { value: 'Annual physical', title: 'Annual physical', sub: 'Preventive head-to-toe' },
  { value: 'Sick visit', title: 'Sick visit', sub: 'Something new or urgent' },
]
const DAYS = ['Weekdays', 'Saturday']
const TIMES = ['Morning', 'Midday', 'Afternoon']
const CONTACT_METHODS = ["I'll call the office", 'Call me back']

function fmtHour(h: number): string {
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:00 ${period}`
}

function clinicDayIndex(): number {
  try {
    const wd = new Intl.DateTimeFormat('en-US', { timeZone: clinic.timezone, weekday: 'short' }).format(new Date())
    const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
    return map[wd] ?? new Date().getDay()
  } catch {
    return new Date().getDay()
  }
}

function todayHoursLine(dayIdx: number): string {
  const t = hours[dayIdx]
  if (!t) return `Closed today (${DAY_NAMES[dayIdx]})`
  return `Today: ${fmtHour(t.open)} – ${fmtHour(t.close)}`
}

const DAY_ROWS = [1, 2, 3, 4, 5, 6, 0].map((d) => ({
  d,
  name: DAY_NAMES[d],
  value: hours[d] ? `${fmtHour(hours[d]!.open)} – ${fmtHour(hours[d]!.close)}` : 'Closed',
}))

function Confetti() {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return null
  const pieces = Array.from({ length: 26 }, (_, i) => {
    const ang = (i / 26) * Math.PI * 2 + Math.random() * 0.5
    const dist = 90 + Math.random() * 150
    const dx = `${(Math.cos(ang) * dist).toFixed(0)}px`
    const dy = `${(Math.sin(ang) * dist * 0.8 - 60).toFixed(0)}px`
    const rot = `${(Math.random() * 540 - 270).toFixed(0)}deg`
    return (
      <span
        key={i}
        style={{
          position: 'absolute',
          left: '50%',
          top: '52px',
          width: i % 3 === 0 ? 6 : 8,
          height: i % 3 === 0 ? 10 : 8,
          background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          borderRadius: i % 2 ? '50%' : 2,
          pointerEvents: 'none',
          // @ts-expect-error custom props consumed by rimConfetti keyframes
          '--dx': dx,
          '--dy': dy,
          '--rot': rot,
          animation: `rimConfetti ${(0.9 + Math.random() * 0.5).toFixed(2)}s cubic-bezier(.16,.66,.35,1) ${(Math.random() * 0.12).toFixed(2)}s both`,
        }}
      />
    )
  })
  return <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 2 }}>{pieces}</div>
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 8,
  border: '1px solid var(--line)',
  borderRadius: 12,
  padding: '13px 16px',
  background: 'var(--bg2)',
  color: 'var(--ink)',
  fontSize: 15,
}
const microLabel: React.CSSProperties = {
  display: 'block',
  fontFamily: "'DM Mono',monospace",
  fontSize: 11,
  letterSpacing: '.18em',
  color: 'var(--ink-soft)',
  marginTop: 16,
}
const chip = (on: boolean): React.CSSProperties => ({
  border: `1px solid ${on ? 'var(--olive)' : 'var(--line)'}`,
  borderRadius: 999,
  padding: '11px 20px',
  fontSize: 14.5,
  fontWeight: 500,
  background: on ? 'rgba(107,122,63,.1)' : 'var(--bg2)',
  boxShadow: on ? 'inset 0 0 0 1px var(--olive)' : 'none',
  transition: 'border-color .25s, box-shadow .25s, background .25s',
})
const nextBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 9,
  background: 'var(--olive-deep)',
  color: 'var(--on-olive)',
  padding: '13px 24px',
  borderRadius: 999,
  fontSize: 14.5,
  fontWeight: 600,
}
const backBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 18px',
  borderRadius: 999,
  fontSize: 14.5,
  fontWeight: 600,
  color: 'var(--ink-soft)',
  border: '1px solid var(--line)',
}

export default function Contact() {
  const status = useClinicStatus()
  const todayIdx = clinicDayIndex()

  const [step, setStep] = useState(0)
  const [type, setType] = useState('')
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [contact, setContact] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [hint, setHint] = useState(false)
  const phoneRef = useRef<HTMLInputElement>(null)

  const next = () => {
    if (step === 0 && !type) return setHint(true)
    if (step === 1 && (!day || !time)) return setHint(true)
    setHint(false)
    setStep((s) => Math.min(3, s + 1))
  }
  const back = () => {
    setHint(false)
    setStep((s) => Math.max(0, s - 1))
  }
  const finish = () => {
    if (contact === 'Call me back' && !phone.trim()) {
      setHint(true)
      phoneRef.current?.focus()
      return
    }
    setHint(false)
    setStep(3)
  }
  const restart = () => {
    setType('')
    setDay('')
    setTime('')
    setContact('')
    setName('')
    setPhone('')
    setHint(false)
    setStep(0)
  }

  const firstName = name.trim() ? name.trim().split(/\s+/)[0].replace(/^./, (c) => c.toUpperCase()) : ''
  const callback = contact === 'Call me back'
  const doneTitle = callback
    ? firstName
      ? `You're set, ${firstName} — expect our call.`
      : "You're set — expect our call."
    : firstName
      ? `Request ready, ${firstName}.`
      : 'Request ready.'
  const doneBody = callback
    ? `Our front desk returns callback requests during office hours — keep your phone handy. Need us sooner? ${todayHoursLine(todayIdx)}`
    : `Call now and read this to our front desk — they'll find you a slot. ${todayHoursLine(todayIdx)}`

  const progressWidth = ['10%', '42%', '74%', '100%'][step]
  const stepLabel = step < 3 ? `STEP ${step + 1} OF 3` : 'ALL SET'

  return (
    <section id="contact" style={{ background: 'var(--bg)', padding: 'clamp(64px,8vw,110px) 0 clamp(72px,9vw,124px)' }}>
      <div style={{ maxWidth: 1220, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        <SectionHeading eyebrow="Visits & contact" maxWidth={640}>
          Come see us on <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>the Boulevard.</em>
        </SectionHeading>

        {/* Card A: appointment flow + dark info panel */}
        <div
          className="reveal"
          style={{
            transitionDelay: '.05s',
            marginTop: 44,
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 28,
            overflow: 'hidden',
            boxShadow: '0 34px 70px -36px rgba(43,43,36,.35)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,430px),1fr))',
          }}
        >
          {/* LEFT: appointment mini-flow */}
          <div style={{ padding: 'clamp(26px,3.6vw,42px)', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontSize: 'clamp(24px,2.3vw,30px)', letterSpacing: '-.01em' }}>
                Request an appointment
              </h3>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11.5, color: 'var(--ink-soft)', paddingBottom: 5 }}>{stepLabel}</span>
            </div>
            <div style={{ height: 4, borderRadius: 99, background: 'rgba(107,122,63,.14)', margin: '16px 0 26px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: progressWidth, background: 'var(--olive)', borderRadius: 99, transition: 'width .5s cubic-bezier(.22,.61,.36,1)' }} />
            </div>

            {step === 0 && (
              <div>
                <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-.01em' }}>What kind of visit?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: 10, marginTop: 16 }}>
                  {TYPES.map((t) => {
                    const on = type === t.value
                    return (
                      <button
                        key={t.value}
                        onClick={() => {
                          setType(t.value)
                          setHint(false)
                        }}
                        aria-pressed={on}
                        style={{
                          textAlign: 'left',
                          border: `1px solid ${on ? 'var(--olive)' : 'var(--line)'}`,
                          borderRadius: 14,
                          padding: '14px 16px',
                          background: on ? 'rgba(107,122,63,.1)' : 'var(--bg2)',
                          boxShadow: on ? 'inset 0 0 0 1px var(--olive)' : 'none',
                          transition: 'border-color .25s, box-shadow .25s, background .25s',
                        }}
                      >
                        <span style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{t.title}</span>
                        <span style={{ display: 'block', fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 2 }}>{t.sub}</span>
                      </button>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 }}>
                  <span style={{ fontSize: 12.5, color: '#A0522D', opacity: hint ? 1 : 0, transition: 'opacity .3s' }}>Pick one to continue</span>
                  <button onClick={next} className="rim-cta" style={nextBtn}>
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-.01em' }}>When works best?</h3>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '.18em', color: 'var(--ink-soft)', marginTop: 16 }}>DAYS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                  {DAYS.map((d) => (
                    <button key={d} onClick={() => { setDay(d); setHint(false) }} aria-pressed={day === d} style={chip(day === d)}>
                      {d}
                    </button>
                  ))}
                </div>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '.18em', color: 'var(--ink-soft)', marginTop: 18 }}>TIME OF DAY</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                  {TIMES.map((tm) => (
                    <button key={tm} onClick={() => { setTime(tm); setHint(false) }} aria-pressed={time === tm} style={chip(time === tm)}>
                      {tm}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 24 }}>
                  <button onClick={back} className="rim-outline-btn" style={backBtn}>Back</button>
                  <span style={{ fontSize: 12.5, color: '#A0522D', opacity: hint ? 1 : 0, transition: 'opacity .3s' }}>Pick a day and time</span>
                  <button onClick={next} className="rim-cta" style={nextBtn}>
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-.01em' }}>Almost done.</h3>
                <label htmlFor="rim-appt-name" style={microLabel}>YOUR NAME</label>
                <input id="rim-appt-name" value={name} onChange={(e) => setName(e.target.value)} type="text" autoComplete="name" placeholder="Your full name" style={fieldStyle} />
                <label htmlFor="rim-appt-phone" style={microLabel}>
                  PHONE NUMBER <span style={{ letterSpacing: '.08em' }}>(FOR CALLBACKS)</span>
                </label>
                <input
                  id="rim-appt-phone"
                  ref={phoneRef}
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setHint(false) }}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(718) 000-0000"
                  style={{ ...fieldStyle, borderColor: hint && callback && !phone.trim() ? '#A0522D' : 'var(--line)' }}
                />
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '.18em', color: 'var(--ink-soft)', marginTop: 16 }}>HOW SHOULD WE CONNECT?</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                  {CONTACT_METHODS.map((m) => (
                    <button key={m} onClick={() => { setContact(m); setHint(false) }} aria-pressed={contact === m} style={chip(contact === m)}>
                      {m}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--ink-soft)', marginTop: 14 }}>
                  No portals, no passwords — every request is confirmed by a human on the phone.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 22 }}>
                  <button onClick={back} className="rim-outline-btn" style={backBtn}>Back</button>
                  <span style={{ fontSize: 12.5, color: '#A0522D', opacity: hint ? 1 : 0, transition: 'opacity .3s', textAlign: 'center' }}>Add a number so we can call you</span>
                  <button onClick={finish} className="rim-cta" style={nextBtn}>
                    Review my request <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ position: 'relative', textAlign: 'center', padding: '6px 0 2px' }}>
                <Confetti />
                <div style={{ display: 'inline-flex', animation: 'rimPop .6s cubic-bezier(.34,1.56,.64,1) both' }}>
                  <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      style={{ fill: 'none', stroke: 'var(--olive)', strokeWidth: 2.5, strokeDasharray: 176, strokeDashoffset: 176, animation: 'rimDraw .7s cubic-bezier(.4,0,.2,1) .1s forwards' }}
                    />
                    <path
                      d="M21 33.5 29 41 44 25"
                      style={{ fill: 'none', stroke: 'var(--olive-deep)', strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'round', strokeDasharray: 42, strokeDashoffset: 42, animation: 'rimDraw .45s cubic-bezier(.4,0,.2,1) .55s forwards' }}
                    />
                  </svg>
                </div>
                <h3 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontSize: 28, marginTop: 14 }}>{doneTitle}</h3>
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 16, padding: '16px 20px', marginTop: 16, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <SummaryRow label="VISIT" value={type || 'Visit'} />
                  <SummaryRow label="TIMING" value={day && time ? `${day} · ${time}` : day || time || 'Flexible'} />
                  <SummaryRow label="CONTACT" value={contact || "I'll call the office"} />
                  {name.trim() && <SummaryRow label="NAME" value={name.trim()} />}
                  {phone.trim() && <SummaryRow label="PHONE" value={phone.trim()} />}
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 16 }}>{doneBody}</p>
                <a
                  href={clinic.phoneHref}
                  className="rim-cta"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    background: 'var(--olive-deep)',
                    color: 'var(--on-olive)',
                    padding: '16px 28px',
                    borderRadius: 999,
                    fontSize: 16,
                    fontWeight: 600,
                    textDecoration: 'none',
                    marginTop: 18,
                    width: '100%',
                  }}
                >
                  <Phone size={17} />
                  Call {clinic.phone}
                </a>
                <button onClick={restart} style={{ marginTop: 12, fontSize: 13.5, color: 'var(--ink-soft)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  Start over
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: dark info panel */}
          <div style={{ background: 'var(--dark)', color: 'var(--on-dark)', padding: 'clamp(26px,3.6vw,42px)', position: 'relative', overflow: 'hidden' }}>
            <div
              aria-hidden="true"
              style={{ position: 'absolute', right: -130, top: -110, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, rgba(200,213,160,.15), transparent 68%)', pointerEvents: 'none' }}
            />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'DM Mono',monospace", fontSize: 11.5, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                <span style={{ width: 22, height: 1.5, background: 'var(--accent)' }} />
                The office
              </span>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px 18px', flexWrap: 'wrap', marginTop: 22 }}>
                <div>
                  <p style={{ fontSize: 17, fontWeight: 600 }}>{clinic.address}</p>
                  <p style={{ fontSize: 14.5, color: 'var(--on-dark-soft)', marginTop: 3 }}>{clinic.city}, {clinic.stateAbbr} {clinic.zip}</p>
                </div>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: "'DM Mono',monospace", fontSize: 12, letterSpacing: '.14em', color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 3, paddingTop: 4 }}
                >
                  GET DIRECTIONS <ArrowRight size={12} strokeWidth={2} />
                </a>
              </div>
              <div style={{ height: 1, background: 'rgba(239,237,221,.14)', margin: '24px 0' }} />
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '.2em', color: 'var(--on-dark-soft)' }}>CALL THE FRONT DESK</p>
              <a
                href={clinic.phoneHref}
                style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(30px,3vw,40px)', lineHeight: 1.1, color: 'var(--on-dark)', textDecoration: 'none', marginTop: 8, alignSelf: 'flex-start' }}
              >
                {clinic.phone}
              </a>
              <p style={{ fontSize: 13.5, color: 'var(--on-dark-soft)', marginTop: 6 }}>Tap to call — a human picks up during office hours.</p>
              <div style={{ height: 1, background: 'rgba(239,237,221,.14)', margin: '24px 0' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '.2em', color: 'var(--on-dark-soft)' }}>OFFICE HOURS</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: "'DM Mono',monospace", fontSize: 11.5, border: '1px solid rgba(239,237,221,.25)', borderRadius: 999, padding: '6px 12px' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: status.color, animation: 'rimBlink 2.4s infinite' }} />
                  {status.label}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}>
                {DAY_ROWS.map((row) => {
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
                        background: isToday ? 'rgba(200,213,160,.14)' : 'transparent',
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
        </div>

        {/* Card B: map */}
        <div
          className="reveal"
          style={{
            transitionDelay: '.1s',
            marginTop: 22,
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 30px 60px -34px rgba(43,43,36,.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px 20px', flexWrap: 'wrap', padding: '16px clamp(16px,2.4vw,24px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <span style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 12, background: 'rgba(107,122,63,.11)', color: 'var(--olive-deep)' }}>
                <MapPin size={18} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 15.5, fontWeight: 600 }}>{clinic.name}</span>
                <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{clinic.fullAddress} — on the Boulevard near 147th St</span>
              </span>
            </div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rim-cta"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--olive-deep)', color: 'var(--on-olive)', padding: '11px 20px', borderRadius: 999, fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}
            >
              Directions <ArrowRight size={14} />
            </a>
          </div>
          <div style={{ borderTop: '1px solid var(--line)', height: 'clamp(280px,34vw,400px)', background: 'var(--bg2)' }}>
            <iframe
              title={`Map showing ${clinic.name} at ${clinic.fullAddress}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(clinic.fullAddress)}&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: '100%', height: '100%', border: 0, display: 'block', filter: 'saturate(.85) grayscale(.15)' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <span style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 14 }}>
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '.16em', color: 'var(--ink-soft)', paddingTop: 2 }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </span>
  )
}
