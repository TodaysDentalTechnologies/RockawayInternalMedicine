import { useState } from 'react'
import { clinic } from '../data/clinic'
import SectionHeading from './SectionHeading'
import { Shield, Check } from './icons'

const PLANS = [
  'Medicare',
  'Medicaid',
  'Aetna',
  'Cigna',
  'UnitedHealthcare',
  'Empire BlueCross BlueShield',
  'Fidelis Care',
  'Healthfirst',
  'MetroPlus',
  'Oscar',
  'EmblemHealth',
  'Humana',
]

export default function Insurance() {
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const toggle = (i: number) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  return (
    <section id="insurance" style={{ background: 'var(--bg)', padding: 'clamp(72px,9vw,124px) 0' }}>
      <div
        style={{
          maxWidth: 1220,
          margin: '0 auto',
          padding: '0 clamp(18px,4vw,48px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
          gap: 'clamp(40px,5vw,72px)',
          alignItems: 'start',
        }}
      >
        <div className="reveal">
          <SectionHeading eyebrow="Insurance & payment">
            Chances are, <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>we take yours.</em>
          </SectionHeading>
          <p style={{ fontSize: 16.5, lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 22 }}>
            We accept Medicare, Medicaid, and most major commercial plans. Tap the plans you have to mark them — then
            call us to confirm your specific coverage before your first visit.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 26,
              padding: '14px 20px',
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 16,
            }}
          >
            <span style={{ display: 'inline-flex', color: 'var(--olive-deep)' }}>
              <Shield size={22} />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>
                {selected.size > 0 ? `${selected.size} plan${selected.size > 1 ? 's' : ''} marked` : 'Not sure about your plan?'}
              </span>
              <a href={clinic.phoneHref} style={{ fontSize: 14, color: 'var(--olive-deep)', fontWeight: 600, textUnderlineOffset: 3, textDecoration: 'underline' }}>
                Call {clinic.phone} to verify
              </a>
            </span>
          </div>
        </div>

        <div className="reveal" style={{ transitionDelay: '.12s', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
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
                  gap: 8,
                  padding: '11px 17px',
                  borderRadius: 999,
                  border: `1px solid ${on ? 'var(--olive)' : 'var(--line)'}`,
                  background: on ? 'var(--olive)' : 'var(--card)',
                  color: on ? 'var(--on-olive)' : 'var(--ink)',
                  fontSize: 14.5,
                  fontWeight: 500,
                  transition: 'background .25s, border-color .25s, color .25s, transform .25s',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: on ? 'none' : '1.5px solid var(--line)',
                    background: on ? 'rgba(247,245,239,.2)' : 'transparent',
                  }}
                >
                  {on && <Check size={11} />}
                </span>
                {plan}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
