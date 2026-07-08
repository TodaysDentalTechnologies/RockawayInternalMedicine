import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { locations } from '../data/clinic'
import { callbackUrl } from '../config/api'
import { Calendar, Check, ArrowRight } from './icons'

// Reason-for-visit options (mirrors the Center for Primary Care form).
const SERVICE_OPTIONS = [
  'Annual Physicals',
  'Blood Pressure/Hypertension Treatment',
  'Dermatology',
  'Emphysema/COPD Treatment',
  'Liver and Gastric Disorders',
  'Osteoporosis Management',
  'Physicals + Vaccinations',
  'Family Planning/Birth Control',
  'Cardiology',
  'Cholesterol Testing',
  'Diabetes Treatment and Testing',
  'Immunotherapy',
  'Menopause Treatment',
  'Thyroid Treatment (Overactive/Underactive)',
  'Cancer Screening',
  'Neurology',
  'Obesity Treatment',
  'General Consultation',
  'Other',
]

const TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening']

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'DM Mono',monospace",
  fontSize: 11,
  letterSpacing: '.18em',
  textTransform: 'uppercase',
  color: 'var(--ink-soft)',
  marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--line)',
  borderRadius: 12,
  padding: '13px 16px',
  background: 'var(--bg2)',
  color: 'var(--ink)',
  fontSize: 15,
  outline: 'none',
}

const twoCol: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))',
  gap: 16,
}

const req = <span style={{ color: '#A0522D' }}>*</span>

const EMPTY = {
  clinicId: locations[0].id,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  preferredDate: '',
  preferredTime: 'Morning',
  medicalProcedure: '',
  message: '',
}

// Single-page "Request an Appointment" form — same fields and submission as
// the Center for Primary Care site, styled for Rockaway. Posts to the shared
// callback API; on failure it degrades gracefully to a "call us" message.
export default function AppointmentForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const selectedLocation = locations.find((l) => l.id === form.clinicId) ?? locations[0]

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // The callback API only stores name/phone/email/message, so fold the
      // appointment details into the message (same shape as the CFPCM site).
      const details = [
        'Appointment request',
        `Location: ${selectedLocation.name} — ${selectedLocation.city}`,
        form.medicalProcedure && `Procedure: ${form.medicalProcedure}`,
        form.preferredDate && `Preferred date: ${form.preferredDate}`,
        form.preferredTime && `Preferred time: ${form.preferredTime}`,
        form.message,
      ].filter(Boolean).join(' | ')

      const response = await fetch(callbackUrl(selectedLocation.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          phone: form.phone,
          email: form.email,
          message: details,
          module: 'Operations',
          source: 'WEBSITE',
        }),
      })

      if (!response.ok) throw new Error('Failed to submit appointment request')

      setSubmitted(true)
      setForm(EMPTY)
    } catch (err) {
      console.error('Appointment submission error:', err)
      setError(`Something went wrong. Please try again or call us at ${selectedLocation.phone}.`)
    } finally {
      setSubmitting(false)
    }
  }

  const cardStyle: React.CSSProperties = {
    background: 'var(--card)',
    border: '1px solid var(--line)',
    borderRadius: 28,
    boxShadow: '0 34px 70px -36px rgba(43,43,36,.35)',
    padding: 'clamp(26px,3.6vw,48px)',
  }

  if (submitted) {
    return (
      <div className="reveal" style={{ ...cardStyle, textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'rgba(46,107,67,.14)', color: 'var(--olive-deep)', animation: 'rimPop .6s cubic-bezier(.34,1.56,.64,1) both' }}>
            <Check size={30} />
          </span>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(26px,3vw,34px)' }}>Appointment request submitted!</h3>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
            Thanks — we've received your request and our front desk will contact you shortly to confirm your preferred date and time.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 8 }}>
            <button
              onClick={() => setSubmitted(false)}
              className="rim-cta"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--olive-deep)', color: 'var(--on-olive)', padding: '13px 24px', borderRadius: 999, fontSize: 14.5, fontWeight: 600 }}
            >
              <Calendar size={16} /> Schedule another
            </button>
            <button
              onClick={() => navigate('/')}
              className="rim-outline-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, border: '1.5px solid var(--olive)', background: 'transparent', color: 'var(--olive-deep)', padding: '13px 22px', borderRadius: 999, fontSize: 14.5, fontWeight: 600 }}
            >
              Return home <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reveal" style={cardStyle}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 16, background: 'rgba(46,107,67,.12)', color: 'var(--olive-deep)' }}>
          <Calendar size={26} />
        </span>
        <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(28px,3.4vw,40px)', lineHeight: 1.05, marginTop: 16 }}>
          Request an Appointment
        </h3>
        <p style={{ fontSize: 'clamp(14.5px,1.4vw,16px)', lineHeight: 1.6, color: 'var(--ink-soft)', marginTop: 12 }}>
          Fill out the form below and we'll contact you shortly to confirm your preferred date and time.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={submit} style={{ maxWidth: 760, margin: '0 auto', marginTop: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Location (added for the two-office site) */}
        <div>
          <label htmlFor="ap-clinic" style={labelStyle}>Preferred location {req}</label>
          <select id="ap-clinic" name="clinicId" value={form.clinicId} onChange={change} required style={{ ...inputStyle, background: 'var(--bg2)' }}>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name} — {loc.city}</option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div style={twoCol}>
          <div>
            <label htmlFor="ap-first" style={labelStyle}>First name {req}</label>
            <input id="ap-first" name="firstName" type="text" required autoComplete="given-name" value={form.firstName} onChange={change} placeholder="Enter your first name" style={inputStyle} />
          </div>
          <div>
            <label htmlFor="ap-last" style={labelStyle}>Last name {req}</label>
            <input id="ap-last" name="lastName" type="text" required autoComplete="family-name" value={form.lastName} onChange={change} placeholder="Enter your last name" style={inputStyle} />
          </div>
        </div>

        {/* Contact */}
        <div style={twoCol}>
          <div>
            <label htmlFor="ap-email" style={labelStyle}>Email {req}</label>
            <input id="ap-email" name="email" type="email" required autoComplete="email" value={form.email} onChange={change} placeholder="your.email@example.com" style={inputStyle} />
          </div>
          <div>
            <label htmlFor="ap-phone" style={labelStyle}>Phone {req}</label>
            <input id="ap-phone" name="phone" type="tel" inputMode="tel" required autoComplete="tel" value={form.phone} onChange={change} placeholder="(718) 000-0000" style={inputStyle} />
          </div>
        </div>

        {/* Date + time */}
        <div style={twoCol}>
          <div>
            <label htmlFor="ap-date" style={labelStyle}>Preferred date {req}</label>
            <input id="ap-date" name="preferredDate" type="date" required min={new Date().toISOString().split('T')[0]} value={form.preferredDate} onChange={change} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="ap-time" style={labelStyle}>Preferred time {req}</label>
            <select id="ap-time" name="preferredTime" value={form.preferredTime} onChange={change} required style={inputStyle}>
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label htmlFor="ap-proc" style={labelStyle}>Reason for visit {req}</label>
          <select id="ap-proc" name="medicalProcedure" value={form.medicalProcedure} onChange={change} required style={inputStyle}>
            <option value="">Select a service…</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="ap-msg" style={labelStyle}>Message or comments</label>
          <textarea id="ap-msg" name="message" rows={4} value={form.message} onChange={change} placeholder="Anything that would help us prepare for your visit…" style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        {/* Notice */}
        <div style={{ background: 'rgba(46,107,67,.08)', border: '1px solid rgba(46,107,67,.2)', borderRadius: 12, padding: '14px 16px' }}>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-soft)' }}>
            <strong style={{ color: 'var(--olive-deep)' }}>Note:</strong> This is a request — our office will contact you to confirm your appointment time. For urgent medical needs, call an office directly:{' '}
            {locations.map((loc, i) => (
              <span key={loc.id}>
                {i > 0 && ' · '}
                {loc.city}{' '}
                <a href={loc.phoneHref} style={{ color: 'var(--olive-deep)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>{loc.phone}</a>
              </span>
            ))}.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(160,82,45,.08)', border: '1px solid rgba(160,82,45,.3)', borderRadius: 12, padding: '14px 16px' }}>
            <p style={{ fontSize: 13.5, color: '#A0522D' }}>{error}</p>
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
          <button
            type="submit"
            disabled={submitting}
            className="rim-cta"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--olive-deep)', color: 'var(--on-olive)', padding: '15px 40px', borderRadius: 999, fontSize: 15.5, fontWeight: 600, opacity: submitting ? 0.75 : 1 }}
          >
            {submitting ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(241,246,241,.5)', borderTopColor: 'var(--on-olive)', borderRadius: '50%', animation: 'rimSpin .7s linear infinite' }} />
                Submitting…
              </>
            ) : (
              <>
                <Calendar size={17} /> Submit appointment request
              </>
            )}
          </button>
        </div>
      </form>

      {/* Contact line */}
      <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--line)', textAlign: 'center' }}>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)' }}>
          Questions? Call{' '}
          {locations.map((loc, i) => (
            <span key={loc.id}>
              {i > 0 && ' or '}
              {loc.city}{' '}
              <a href={loc.phoneHref} style={{ color: 'var(--olive-deep)', fontWeight: 600, textDecoration: 'none' }}>{loc.phone}</a>
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
