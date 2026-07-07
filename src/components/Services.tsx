import { useEffect, useRef, useState } from 'react'
import { clinic } from '../data/clinic'
import SectionHeading from './SectionHeading'
import { scrollToId } from './Header'
import { Clipboard, Activity, Stethoscope, Flask, Syringe, Heart, Shield, Sun, Sparkles, Wind, Bone, Baby, Droplet, Pill, Search, Zap, Scale, ArrowRight } from './icons'
import type { ReactNode, CSSProperties } from 'react'

// `motion` picks the icon's living animation — each is chosen to echo its meaning.
const SERVICES: { icon: ReactNode; title: string; body: string; motion: string }[] = [
  { icon: <Clipboard size={21} />, title: 'Annual Physicals', body: 'A thorough head-to-toe exam with vitals, labs, and screenings to catch problems early.', motion: 'stamp' },
  { icon: <Activity size={21} />, title: 'Hypertension Treatment', body: 'Personalized blood-pressure control with lifestyle guidance, medication, and monitoring.', motion: 'ekg' },
  { icon: <Sparkles size={21} />, title: 'Dermatology', body: 'Evaluation and care for rashes, acne, moles, and common skin conditions.', motion: 'twinkle' },
  { icon: <Wind size={21} />, title: 'COPD & Emphysema', body: 'Breathing support with inhaler plans and steady lung-health monitoring.', motion: 'blow' },
  { icon: <Stethoscope size={21} />, title: 'Liver & Gastric Disorders', body: 'Diagnosis and management of digestive, stomach, and liver concerns.', motion: 'swing' },
  { icon: <Bone size={21} />, title: 'Osteoporosis Management', body: 'Bone-density screening and treatment to keep your bones strong.', motion: 'wiggle' },
  { icon: <Syringe size={21} />, title: 'Physicals & Vaccinations', body: 'School, work, and travel physicals plus flu, pneumonia, shingles, and tetanus shots.', motion: 'inject' },
  { icon: <Baby size={21} />, title: 'Family Planning & Birth Control', body: 'Confidential contraception counseling and family-planning support.', motion: 'rock' },
  { icon: <Heart size={21} />, title: 'Cardiology', body: 'Heart-health monitoring, EKGs, and cardiovascular risk management.', motion: 'beat' },
  { icon: <Flask size={21} />, title: 'Cholesterol Testing', body: 'Lipid panels and treatment to protect your heart and prevent complications.', motion: 'swirl' },
  { icon: <Droplet size={21} />, title: 'Diabetes Treatment & Testing', body: 'A1C testing, blood-sugar monitoring, and food-first diabetes management.', motion: 'drip' },
  { icon: <Shield size={21} />, title: 'Immunotherapy', body: 'Allergy and immune-system treatment coordinated under expert supervision.', motion: 'guard' },
  { icon: <Sun size={21} />, title: 'Menopause Treatment', body: 'Symptom relief and hormone guidance to navigate menopause with confidence.', motion: 'shine' },
  { icon: <Pill size={21} />, title: 'Thyroid Treatment', body: 'Testing and management for both under- and overactive thyroid conditions.', motion: 'spin' },
  { icon: <Search size={21} />, title: 'Cancer Screening', body: 'Guideline-based screenings for early detection, when it matters most.', motion: 'scan' },
  { icon: <Zap size={21} />, title: 'Neurology', body: 'Evaluation and management of headaches, nerve pain, and neurological conditions.', motion: 'flash' },
  { icon: <Scale size={21} />, title: 'Obesity Treatment', body: 'Personalized weight management with medical support and honest guidance.', motion: 'balance' },
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
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Run the ambient icon/mesh animations only while the section is on-screen.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in-view')
      return
    }
    const io = new IntersectionObserver(([e]) => el.classList.toggle('in-view', e.isIntersecting), {
      rootMargin: '200px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

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
    <section ref={sectionRef} id="services" className="rim-svc-section" style={{ background: 'var(--bg2)', padding: 'clamp(72px,9vw,124px) 0 0' }}>
      {/* Gradient-mesh backdrop */}
      <div className="rim-mesh" aria-hidden="true">
        <span className="m1" />
        <span className="m2" />
        <span className="m3" />
      </div>

      <div style={{ maxWidth: 1220, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        <SectionHeading eyebrow="What we do" maxWidth={640}>
          Primary care, <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>end to end.</em>
        </SectionHeading>
        <p className="reveal" style={{ fontSize: 16.5, lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 20, maxWidth: 640 }}>
          From the annual physical to the years-long management of a chronic condition — one practice, one record, one team.
        </p>

        {/* Uniform service grid */}
        <div className="rim-svc-grid" style={{ marginTop: 44 }}>
          {SERVICES.map((s, i) => (
            <div key={s.title} className="reveal rim-rise" style={{ transitionDelay: `${(i % 4) * 0.05}s` }}>
              <article className="rim-svc">
                <span className="rim-svc-ic2">
                  <span className={`rim-liv rim-liv-${s.motion}`} style={{ '--d': `-${(i * 0.31).toFixed(2)}s` } as CSSProperties}>{s.icon}</span>
                </span>
                <h3 style={{ fontSize: 17.5, fontWeight: 600, letterSpacing: '-.01em', marginTop: 18 }}>{s.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 8 }}>{s.body}</p>
              </article>
            </div>
          ))}
        </div>

        {/* Symptom → service finder */}
        <div
          className="reveal rim-finder"
          style={{
            position: 'relative',
            overflow: 'hidden',
            marginTop: 'clamp(56px,7vw,88px)',
            marginBottom: 'clamp(56px,7vw,96px)',
            border: '1px solid rgba(255,255,255,.55)',
            borderRadius: 28,
            background: 'linear-gradient(135deg, rgba(179,209,187,.4), rgba(134,168,148,.2))',
            backdropFilter: 'blur(14px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
            boxShadow: '0 40px 80px -50px rgba(28,74,44,.6)',
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
                    className="rim-fchip"
                    style={{
                      border: `1px solid ${on ? 'transparent' : 'rgba(28,74,44,.32)'}`,
                      borderRadius: 999,
                      padding: '11px 18px',
                      fontSize: 14.5,
                      fontWeight: 500,
                      background: on ? 'var(--olive-deep)' : 'rgba(255,255,255,.7)',
                      color: on ? 'var(--on-olive)' : 'var(--ink)',
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
                background: 'linear-gradient(160deg, rgba(255,255,255,.82), rgba(255,255,255,.6))',
                border: '1px solid rgba(255,255,255,.7)',
                borderRadius: 22,
                padding: 'clamp(24px,3vw,34px)',
                minHeight: 280,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backdropFilter: 'blur(16px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
                boxShadow: '0 34px 66px -32px rgba(28,74,44,.5)',
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
                      background: 'rgba(46,107,67,.11)',
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
