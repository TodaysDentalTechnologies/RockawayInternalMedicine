import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Gauge,
  Flask,
  Heart,
  Droplet,
  Thermometer,
  Sparkles,
  Zap,
  Activity,
  Bone,
  Stethoscope,
  Syringe,
  Search,
  Sun,
  Baby,
  Chevron,
} from './icons'

interface Condition {
  name: string
  category: string
  body: string
  icon: ReactNode
}

const CONDITIONS: Condition[] = [
  { name: 'Blood Pressure / Hypertension', category: 'Cardiovascular', icon: <Gauge size={20} />, body: 'Steady blood-pressure control — meds tuned and home readings reviewed.' },
  { name: 'Cholesterol', category: 'Cardiovascular', icon: <Flask size={20} />, body: "Risk-based lipid care — statins when they're warranted, lifestyle when they're not." },
  { name: 'Cardiology', category: 'Cardiovascular', icon: <Heart size={20} />, body: 'Heart-health checks, EKGs, and cardiovascular risk kept in view.' },
  { name: 'Diabetes Management', category: 'Chronic Care', icon: <Droplet size={20} />, body: 'A1C targets, medication, and food-first guidance that respects your plate.' },
  { name: 'Thyroid Conditions', category: 'Endocrine', icon: <Thermometer size={20} />, body: 'Testing and dosing for hypo- and hyperthyroid, followed through.' },
  { name: 'Dermatology / Skin Conditions', category: 'Specialty Care', icon: <Sparkles size={20} />, body: 'Rashes, acne, and moles evaluated — with referrals when needed.' },
  { name: 'Neurology', category: 'Specialty Care', icon: <Zap size={20} />, body: 'Headaches, nerve pain, and neurological symptoms assessed and managed.' },
  { name: 'Pain Management / Migraine', category: 'Pain Relief', icon: <Activity size={20} />, body: 'Practical plans that keep you moving — and fewer bad days.' },
  { name: 'Arthritis', category: 'Musculoskeletal', icon: <Bone size={20} />, body: 'Joint-pain care that keeps you active, not just medicated.' },
  { name: 'Liver and Gastric Disorders', category: 'Digestive Health', icon: <Stethoscope size={20} />, body: 'Reflux, stomach, and liver concerns diagnosed and settled.' },
  { name: 'Physicals + Vaccinations', category: 'Preventive Care', icon: <Syringe size={20} />, body: 'Head-to-toe exams plus flu, pneumonia, shingles, and tetanus shots.' },
  { name: 'Cancer Screening', category: 'Preventive Care', icon: <Search size={20} />, body: 'Guideline-based screenings for early detection, when it matters most.' },
  { name: 'Menopause', category: "Women's Health", icon: <Sun size={20} />, body: 'Symptom relief and hormone guidance, navigated with confidence.' },
  { name: 'Pregnancy Tests', category: "Women's Health", icon: <Baby size={20} />, body: 'Confidential testing and next steps in a supportive setting.' },
]

const CATEGORIES = [
  'All Conditions',
  'Cardiovascular',
  'Chronic Care',
  'Endocrine',
  'Specialty Care',
  'Pain Relief',
  'Musculoskeletal',
  'Digestive Health',
  'Preventive Care',
  "Women's Health",
]

export default function Conditions() {
  const navigate = useNavigate()
  const [active, setActive] = useState('All Conditions')

  const visible =
    active === 'All Conditions' ? CONDITIONS : CONDITIONS.filter((c) => c.category === active)

  return (
    <section id="conditions" style={{ background: 'var(--bg)', padding: 'clamp(72px,9vw,124px) 0' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        {/* Centered header */}
        <div className="reveal" style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: "'DM Mono',monospace",
              fontSize: 12.5,
              letterSpacing: '.28em',
              textTransform: 'uppercase',
              color: 'var(--olive)',
            }}
          >
            <span style={{ width: 22, height: 1.5, background: 'var(--olive)' }} />
            Conditions We Treat
            <span style={{ width: 22, height: 1.5, background: 'var(--olive)' }} />
          </span>
          <h2
            style={{
              fontFamily: "'Fraunces',serif",
              fontWeight: 400,
              fontSize: 'clamp(34px,5vw,56px)',
              lineHeight: 1.04,
              letterSpacing: '-.01em',
              marginTop: 18,
            }}
          >
            Expert diagnosis for a wide range of{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>conditions.</em>
          </h2>
          <p style={{ fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 20 }}>
            From acute illnesses to chronic disease management, our team is here to help —
            thorough, unhurried, and centered on you.
          </p>
        </div>

        {/* Category filter */}
        <div
          className="reveal"
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 'clamp(30px,4vw,44px)' }}
        >
          {CATEGORIES.map((cat) => {
            const on = active === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                aria-pressed={on}
                className="rim-fchip"
                style={{
                  border: `1px solid ${on ? 'transparent' : 'var(--line)'}`,
                  borderRadius: 999,
                  padding: '10px 18px',
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 11.5,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  background: on ? 'linear-gradient(135deg, var(--olive), var(--olive-deep))' : 'var(--card)',
                  color: on ? 'var(--on-olive)' : 'var(--ink-soft)',
                  boxShadow: on ? '0 12px 24px -12px rgba(28,74,44,.6)' : 'none',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Condition cards */}
        <div className="rim-cond-grid" style={{ marginTop: 'clamp(36px,5vw,52px)' }}>
          {visible.map((c) => (
            <div
              key={c.name}
              tabIndex={0}
              className="rim-card rim-cond-card"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 18,
                padding: '22px 22px 20px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  className="rim-svc-icon"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background: 'linear-gradient(140deg, var(--olive), var(--olive-deep))',
                    color: '#fff',
                    boxShadow: '0 10px 20px -10px rgba(28,74,44,.6)',
                  }}
                >
                  {c.icon}
                </span>
                <Chevron className="rim-cond-chev" size={16} style={{ color: 'var(--ink-soft)', opacity: 0.55 }} />
              </span>
              <h3
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontWeight: 400,
                  fontSize: 20,
                  lineHeight: 1.12,
                  letterSpacing: '-.01em',
                  marginTop: 18,
                }}
              >
                {c.name}
              </h3>
              {/* Extends on hover — a short line about how we approach it. */}
              <span className="rim-cond-body">
                <span style={{ display: 'block', fontSize: 14, lineHeight: 1.55, color: 'var(--ink-soft)', marginTop: 10 }}>
                  {c.body}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <p
          className="reveal"
          style={{ textAlign: 'center', marginTop: 'clamp(36px,5vw,52px)', fontSize: 15.5, color: 'var(--ink-soft)' }}
        >
          Don't see your condition listed?{' '}
          <button
            onClick={() => navigate('/contact')}
            style={{ color: 'var(--olive-deep)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3, background: 'none', border: 0, padding: 0, font: 'inherit', cursor: 'pointer' }}
          >
            Call us
          </button>{' '}
          — internal medicine covers a lot.
        </p>
      </div>
    </section>
  )
}
