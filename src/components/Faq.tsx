import { useState } from 'react'
import { homeFaqs } from '../data/faq'
import { Chevron } from './icons'

// Home-page FAQ accordion. The same Q&A is emitted as FAQPage JSON-LD from
// Home.tsx, so the marked-up content is visible on the page it's served from.
export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" style={{ background: 'var(--bg)', padding: 'clamp(64px,8vw,110px) 0' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        <div className="reveal" style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto clamp(32px,4vw,48px)' }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12.5, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--olive)' }}>
            FAQs
          </span>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 'clamp(30px,4.5vw,48px)', lineHeight: 1.05, letterSpacing: '-.01em', marginTop: 16 }}>
            Frequently asked <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>questions.</em>
          </h2>
          <p style={{ fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.65, color: 'var(--ink-soft)', marginTop: 18 }}>
            Quick answers about visits, insurance, and our two Queens offices.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {homeFaqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div
                key={f.q}
                className="rim-card reveal"
                style={{ transitionDelay: `${(i % 6) * 0.03}s`, background: 'var(--card)', border: `1px solid ${isOpen ? 'var(--olive)' : 'var(--line)'}`, borderRadius: 18, overflow: 'hidden' }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, textAlign: 'left', padding: 'clamp(18px,2vw,24px)' }}
                >
                  <span style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(17px,2vw,21px)', lineHeight: 1.25 }}>{f.q}</span>
                  <Chevron size={17} style={{ flex: 'none', color: 'var(--ink-soft)', transition: 'transform .35s', transform: isOpen ? 'rotate(180deg)' : 'none' }} />
                </button>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows .4s cubic-bezier(.22,.61,.36,1)',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)', padding: '0 clamp(18px,2vw,24px) clamp(18px,2vw,24px)' }}>
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
