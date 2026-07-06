import { useRef, useState } from 'react'
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
    body: 'Fevers, infections, aches, and flare-ups seen quickly — often the same week you call.',
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

const FINDER: { concern: string; kicker: string; title: string; desc: string }[] = [
  {
    concern: "I'm always tired",
    kicker: "LET'S FIND THE WHY",
    title: 'Fatigue & anemia workup',
    desc: 'Persistent tiredness usually deserves bloodwork — thyroid, iron, B12, blood sugar — plus a real conversation about sleep and stress. We do the draw in-office and explain every result.',
  },
  {
    concern: 'My blood pressure runs high',
    kicker: 'ONGOING, NOT ONE-OFF',
    title: 'Hypertension management',
    desc: 'We confirm with proper readings, tailor medication if needed, and follow up until your numbers are steady — without upending your routine.',
  },
  {
    concern: 'My sugar is creeping up',
    kicker: 'CATCH IT EARLY',
    title: 'Diabetes & pre-diabetes care',
    desc: 'From A1C testing to medication and food-first changes, we manage blood sugar closely — and celebrate the wins with you.',
  },
  {
    concern: 'I just need a checkup',
    kicker: 'THE SMART ANNUAL',
    title: 'Annual physical & preventive care',
    desc: 'A head-to-toe exam with age-appropriate screenings and vaccines — and enough time to actually talk.',
  },
  {
    concern: "I'm sick right now",
    kicker: "DON'T WAIT IT OUT",
    title: 'Same-week sick visit',
    desc: "New cough, fever, pain, or just 'off'? Call us first — we usually see sick patients within the week, often sooner.",
  },
  {
    concern: 'I get short of breath',
    kicker: 'BREATHE EASIER',
    title: 'Asthma & COPD care',
    desc: 'We check your lungs, build a stepwise inhaler plan, and keep an eye on triggers before they become ER visits.',
  },
  {
    concern: 'I need vaccines or forms',
    kicker: 'QUICK & OFFICIAL',
    title: 'Immunizations & paperwork',
    desc: 'Flu, pneumonia, shingles — plus school, work, and travel forms, done properly and on time.',
  },
  {
    concern: 'My weight and energy are stuck',
    kicker: 'NO JUDGMENT HERE',
    title: 'Weight & lifestyle medicine',
    desc: "Food-first counseling, lab checks for hidden causes, and honest medical support when it's warranted.",
  },
]

export default function Services() {
  const [sel, setSel] = useState<number>(-1)
  const [flip, setFlip] = useState(false)
  const timer = useRef<number | null>(null)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const pick = (i: number) => {
    if (timer.current) window.clearTimeout(timer.current)
    if (reduced || sel < 0) {
      setSel(i)
      setFlip(false)
      return
    }
    setFlip(true)
    timer.current = window.setTimeout(() => {
      setSel(i)
      setFlip(false)
    }, 220)
  }

  const active = sel >= 0 ? FINDER[sel] : null

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

        {/* Symptom → service finder */}
        <div
          className="reveal"
          style={{
            marginTop: 'clamp(56px,7vw,88px)',
            marginBottom: 'clamp(56px,7vw,96px)',
            border: '1px solid var(--line)',
            borderRadius: 28,
            background: 'linear-gradient(135deg, rgba(200,213,160,.26), rgba(163,177,138,.16))',
            padding: 'clamp(26px,4vw,48px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,400px),1fr))',
            gap: 'clamp(28px,4vw,48px)',
            alignItems: 'center',
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: "'DM Mono',monospace",
                fontSize: 12,
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: 'var(--olive-deep)',
              }}
            >
              Symptom → service finder
            </span>
            <h3 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontSize: 'clamp(26px,3vw,36px)', lineHeight: 1.1, marginTop: 14 }}>
              Not sure where to start? <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>Tap what's bothering you.</em>
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 12 }}>
              We'll show you how we'd approach it — and which visit to book.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
              {FINDER.map((f, i) => {
                const on = sel === i
                return (
                  <button
                    key={f.concern}
                    onClick={() => pick(i)}
                    aria-pressed={on}
                    style={{
                      border: `1px solid ${on ? 'transparent' : 'rgba(74,83,39,.32)'}`,
                      borderRadius: 999,
                      padding: '11px 18px',
                      fontSize: 14.5,
                      fontWeight: 500,
                      background: on ? 'var(--olive-deep)' : 'var(--card)',
                      color: on ? 'var(--on-olive)' : 'var(--ink)',
                      transition: 'transform .25s, background .25s, color .25s, border-color .25s',
                    }}
                  >
                    {f.concern}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ perspective: 1400 }}>
            <div
              aria-live="polite"
              style={{
                transform: flip ? 'rotateY(88deg)' : 'rotateY(0deg)',
                transition: 'transform .22s ease',
                transformStyle: 'preserve-3d',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 22,
                padding: 'clamp(24px,3vw,34px)',
                minHeight: 280,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: '0 30px 60px -30px rgba(43,43,36,.3)',
              }}
            >
              {!active ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      background: 'rgba(107,122,63,.11)',
                      color: 'var(--olive-deep)',
                    }}
                  >
                    <Activity size={21} />
                  </span>
                  <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, lineHeight: 1.3 }}>
                    Pick a concern on the left to see the visit we'd recommend.
                  </p>
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 10.5,
                      letterSpacing: '.2em',
                      color: 'var(--olive)',
                      border: '1px solid var(--line)',
                      borderRadius: 999,
                      padding: '7px 12px',
                    }}
                  >
                    NO SYMPTOM-GOOGLING REQUIRED
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '.22em', color: 'var(--olive)' }}>
                    {active.kicker}
                  </span>
                  <h4 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontSize: 27, lineHeight: 1.1 }}>{active.title}</h4>
                  <p style={{ fontSize: 14.5, lineHeight: 1.62, color: 'var(--ink-soft)' }}>{active.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                    <button
                      onClick={() => scrollToId('contact')}
                      className="rim-cta"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 9,
                        background: 'var(--olive-deep)',
                        color: 'var(--on-olive)',
                        padding: '12px 20px',
                        borderRadius: 999,
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      Book this visit
                      <ArrowRight size={14} />
                    </button>
                    <a
                      href={clinic.phoneHref}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '12px 18px',
                        borderRadius: 999,
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--olive-deep)',
                        textDecoration: 'underline',
                        textUnderlineOffset: 3,
                      }}
                    >
                      or call us
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
