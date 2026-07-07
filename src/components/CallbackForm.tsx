import { useState } from 'react'
import { clinic } from '../data/clinic'
import { PhoneCall, Check } from './icons'

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

// Frontend-only "Request a Callback" card (no backend wired — mirrors the
// Center for Primary Care form, themed to Rockaway's olive design system).
export default function CallbackForm() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // No backend — brief pause, then confirm locally.
    window.setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      setForm({ name: '', phone: '', message: '' })
    }, 600)
  }

  return (
    <div
      className="reveal"
      style={{
        transitionDelay: '.08s',
        marginTop: 22,
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 30px 60px -34px rgba(43,43,36,.25)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
      }}
    >
      {/* Intro */}
      <div
        style={{
          padding: 'clamp(24px,3vw,38px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          background: 'linear-gradient(150deg, rgba(200,213,160,.22), rgba(163,177,138,.12))',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 46, height: 46, borderRadius: 14, background: 'rgba(107,122,63,.12)', color: 'var(--olive-deep)' }}>
          <PhoneCall size={22} />
        </span>
        <div>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11.5, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--olive)' }}>Prefer a callback?</span>
          <h3 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontSize: 'clamp(24px,2.4vw,32px)', lineHeight: 1.1, marginTop: 8 }}>Request a Callback</h3>
        </div>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
          Leave your name and number — our front desk will ring you back during office hours, usually the same day.
        </p>
        <a href={clinic.phoneHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: "'DM Mono',monospace", fontSize: 13.5, color: 'var(--olive-deep)', fontWeight: 600, textDecoration: 'none', marginTop: 'auto' }}>
          <PhoneCall size={15} /> Or call {clinic.phone}
        </a>
      </div>

      {/* Form / success */}
      <div style={{ padding: 'clamp(24px,3vw,38px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 58, height: 58, borderRadius: '50%', background: 'rgba(107,122,63,.14)', color: 'var(--olive-deep)', animation: 'rimPop .6s cubic-bezier(.34,1.56,.64,1) both' }}>
              <Check size={28} />
            </span>
            <h4 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontSize: 24 }}>We'll call you back!</h4>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: '34ch' }}>
              Thanks — our team will reach out to you shortly during business hours.
            </p>
            <button onClick={() => setSubmitted(false)} style={{ marginTop: 6, fontSize: 13.5, fontWeight: 600, color: 'var(--olive-deep)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,150px),1fr))', gap: 14 }}>
              <div>
                <label htmlFor="cb-name" style={labelStyle}>
                  Your name <span style={{ color: '#A0522D' }}>*</span>
                </label>
                <input id="cb-name" name="name" type="text" required autoComplete="name" value={form.name} onChange={change} placeholder="Full name" style={inputStyle} />
              </div>
              <div>
                <label htmlFor="cb-phone" style={labelStyle}>
                  Phone <span style={{ color: '#A0522D' }}>*</span>
                </label>
                <input id="cb-phone" name="phone" type="tel" inputMode="tel" required autoComplete="tel" value={form.phone} onChange={change} placeholder="(718) 000-0000" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <label htmlFor="cb-msg" style={labelStyle}>
                Brief message <span style={{ letterSpacing: '.08em', color: 'var(--ink-soft)' }}>(optional)</span>
              </label>
              <textarea id="cb-msg" name="message" rows={2} value={form.message} onChange={change} placeholder="How can we help?" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rim-cta"
              style={{
                marginTop: 18,
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: 'var(--olive-deep)',
                color: 'var(--on-olive)',
                padding: '15px 24px',
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 600,
                opacity: submitting ? 0.75 : 1,
              }}
            >
              {submitting ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(247,245,239,.5)', borderTopColor: 'var(--on-olive)', borderRadius: '50%', animation: 'rimSpin .7s linear infinite' }} />
                  Submitting…
                </>
              ) : (
                <>
                  <PhoneCall size={16} /> Request Callback
                </>
              )}
            </button>
            <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', textAlign: 'center', marginTop: 12 }}>We'll call you back during business hours.</p>
          </form>
        )}
      </div>
    </div>
  )
}
