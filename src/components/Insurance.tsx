import { useEffect, useRef, useState } from 'react'
import { locations } from '../data/clinic'
import { Check } from './icons'

const STATS = [
  { value: 15, suffix: '+', dur: 1400, label: 'Years practicing internal medicine' },
  { value: 20000, suffix: '+', dur: 1800, label: 'Patient visits and counting' },
  { value: 97, suffix: '%', dur: 1600, label: "Patients who'd recommend us" },
  { value: 25, suffix: '+', dur: 1400, label: 'Insurance plans accepted' },
]

const COUNT_ON = [
  'Board-certified internal medicine physicians',
  'Evidence-based, guideline-driven care — no fads',
  'Specialist referrals that are coordinated, not just handed off',
  'Results and records explained in plain language',
]

const PLANS = [
  'Medicare',
  'Medicaid',
  'Aetna',
  'Empire BCBS',
  'Cigna',
  'UnitedHealthcare',
  'Healthfirst',
  'Fidelis Care',
  'EmblemHealth',
  'MetroPlus',
]

function CountUp({ value, suffix, dur }: { value: number; suffix: string; dur: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const run = () => {
      if (done.current) return
      done.current = true
      if (reduced) {
        setDisplay(value)
        return
      }
      const start = performance.now()
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / dur)
        const eased = 1 - Math.pow(1 - p, 4)
        setDisplay(Math.round(value * eased))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
    if (!('IntersectionObserver' in window)) {
      run()
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            run()
            io.disconnect()
          }
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value, dur])

  return (
    <span
      ref={ref}
      style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(42px,4.6vw,62px)', lineHeight: 1, display: 'flex', alignItems: 'baseline' }}
    >
      {display.toLocaleString('en-US')}
      <span style={{ color: 'var(--accent)' }}>{suffix}</span>
    </span>
  )
}

export default function Insurance() {
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const toggle = (i: number) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  return (
    <section
      id="insurance"
      style={{
        background: 'var(--dark)',
        color: 'var(--on-dark)',
        padding: 'clamp(64px,8vw,110px) 0 clamp(72px,9vw,124px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: -180,
          top: -120,
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, rgba(179,209,187,.14), transparent 68%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ maxWidth: 1220, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)', position: 'relative' }}>
        <div className="reveal" style={{ maxWidth: 640 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: "'DM Mono',monospace",
              fontSize: 12.5,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
            }}
          >
            <span style={{ width: 26, height: 1.5, background: 'var(--accent)' }} />
            Why patients stay
          </span>
          <h2
            style={{
              fontFamily: "'Fraunces',serif",
              fontWeight: 400,
              fontSize: 'clamp(34px,4.4vw,54px)',
              lineHeight: 1.04,
              letterSpacing: '-.01em',
              marginTop: 18,
            }}
          >
            A practice you can <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>count on.</em>
          </h2>
        </div>

        {/* Count-up stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))',
            gap: '20px 28px',
            marginTop: 'clamp(40px,5vw,64px)',
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="reveal"
              style={{ transitionDelay: `${i * 0.06}s`, borderTop: '1px solid rgba(232,239,230,.22)', paddingTop: 18 }}
            >
              <CountUp value={s.value} suffix={s.suffix} dur={s.dur} />
              <p
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 11.5,
                  letterSpacing: '.16em',
                  textTransform: 'uppercase',
                  color: 'var(--on-dark-soft)',
                  marginTop: 10,
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Two columns: trust checklist + insurance chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))',
            gap: 'clamp(40px,5vw,64px)',
            marginTop: 'clamp(52px,6vw,84px)',
          }}
        >
          <div className="reveal">
            <h3
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: 'var(--on-dark)',
              }}
            >
              What you can count on
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 22 }}>
              {COUNT_ON.map((item) => (
                <div key={item} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                  <span
                    style={{
                      flex: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      color: 'var(--accent-ink)',
                      marginTop: 1,
                    }}
                  >
                    <Check size={12} strokeWidth={2.6} />
                  </span>
                  <p style={{ fontSize: 15.5, lineHeight: 1.55, color: 'var(--on-dark-soft)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal" style={{ transitionDelay: '.1s' }}>
            <h3
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: 'var(--on-dark)',
              }}
            >
              Insurance we accept
            </h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--on-dark-soft)', marginTop: 12 }}>
              Tap your plan to mark it. Coverage varies by plan — we'll confirm when you call.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
              {PLANS.map((plan, i) => {
                const on = selected.has(i)
                return (
                  <button
                    key={plan}
                    onClick={() => toggle(i)}
                    aria-pressed={on}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: `1px solid ${on ? 'transparent' : 'rgba(232,239,230,.3)'}`,
                      borderRadius: 999,
                      padding: '10px 17px',
                      fontSize: 14,
                      fontWeight: 500,
                      color: on ? 'var(--accent-ink)' : 'var(--on-dark)',
                      background: on ? 'var(--accent)' : 'transparent',
                      transition: 'background .25s, color .25s, border-color .25s, transform .25s',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        width: on ? 13 : 0,
                        opacity: on ? 1 : 0,
                        overflow: 'hidden',
                        marginRight: on ? 7 : 0,
                        transition: 'width .25s, opacity .25s, margin .25s',
                      }}
                    >
                      <Check size={13} strokeWidth={2.6} />
                    </span>
                    {plan}
                  </button>
                )
              })}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px dashed rgba(232,239,230,.3)',
                  borderRadius: 999,
                  padding: '10px 17px',
                  fontSize: 14,
                  color: 'var(--on-dark-soft)',
                }}
              >
                …and more
              </span>
            </div>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'var(--on-dark-soft)', marginTop: 18 }}>
              Not listed? Call either office —{' '}
              {locations.map((loc, i) => (
                <span key={loc.id}>
                  {i > 0 && ' · '}
                  <a href={loc.phoneHref} style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                    {loc.phone}
                  </a>
                </span>
              ))}{' '}
              — and we'll check for you.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
