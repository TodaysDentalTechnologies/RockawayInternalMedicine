import { useState } from 'react'
import { clinic } from '../data/clinic'
import SectionHeading from './SectionHeading'
import { Chevron } from './icons'

const CONDITIONS = [
  { title: 'Hypertension', body: 'Steady blood-pressure control that fits your routine — meds tuned, home readings reviewed.' },
  { title: 'Type 2 Diabetes', body: 'A1C targets, medication management, and food-first guidance that respects your plate.' },
  { title: 'High Cholesterol', body: "Risk-based treatment — statins when they're warranted, lifestyle when they're not." },
  { title: 'Thyroid Disorders', body: 'Testing, dosing, and follow-through for hypo- and hyperthyroidism.' },
  { title: 'Asthma & COPD', body: 'Lung checks, inhaler technique, and a stepwise plan for easier breathing.' },
  { title: 'Acid Reflux & GERD', body: "Relief for the burn — plus a proper look at what's causing it." },
  { title: 'Arthritis & Joint Pain', body: 'Practical pain plans that keep you moving — not just medicated.' },
  { title: 'Anxiety & Depression', body: 'Screening, first-line treatment, and referrals that actually stick.' },
  { title: 'Sleep Problems', body: 'From stubborn insomnia to sleep-apnea screening and referral.' },
  { title: 'Anemia & Fatigue', body: 'Bloodwork that finds the cause behind low energy — iron, B12, thyroid, and beyond.' },
  { title: 'Allergies & Sinus', body: 'Seasonal misery managed — before it becomes a yearly ritual.' },
  { title: 'Migraine & Headache', body: 'Fewer bad days — triggers, prevention, and rescue plans that work.' },
]

export default function Conditions() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="conditions" style={{ background: 'var(--bg)', padding: 'clamp(72px,9vw,124px) 0' }}>
      <div style={{ maxWidth: 1220, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 48px', alignItems: 'end', justifyContent: 'space-between' }}>
          <SectionHeading eyebrow="Conditions we treat" maxWidth="14ch">
            The everyday conditions <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>we manage well.</em>
          </SectionHeading>
          <p className="reveal" style={{ transitionDelay: '.1s', fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: '36ch' }}>
            Hover or tap a card to see how we approach it. Don't see yours?{' '}
            <a href={clinic.phoneHref} style={{ color: 'var(--olive-deep)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Call us
            </a>{' '}
            — internal medicine covers a lot.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,248px),1fr))',
            gap: 14,
            marginTop: 48,
          }}
        >
          {CONDITIONS.map((c, i) => {
            const isOpen = open === i
            return (
              <button
                key={c.title}
                className="rim-card reveal"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  transitionDelay: `${(i % 6) * 0.03}s`,
                  textAlign: 'left',
                  background: 'var(--card)',
                  border: `1px solid ${isOpen ? 'var(--olive)' : 'var(--line)'}`,
                  borderRadius: 18,
                  padding: '20px 20px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--olive)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Chevron
                    size={15}
                    style={{ color: 'var(--ink-soft)', transition: 'transform .35s', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                  />
                </span>
                <span style={{ fontSize: 16.5, fontWeight: 600, letterSpacing: '-.01em' }}>{c.title}</span>
                <span
                  style={{
                    overflow: 'hidden',
                    maxHeight: isOpen ? 140 : 0,
                    opacity: isOpen ? 1 : 0,
                    transition: 'max-height .45s cubic-bezier(.22,.61,.36,1), opacity .45s',
                  }}
                >
                  <span style={{ display: 'block', fontSize: 14, lineHeight: 1.55, color: 'var(--ink-soft)', paddingTop: 2 }}>
                    {c.body}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
