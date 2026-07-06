import SectionHeading from './SectionHeading'
import ImageSlot from './ImageSlot'

const PRINCIPLES = [
  {
    n: '01',
    title: 'Continuity',
    body: 'The same team, visit after visit. Your history stays known — not re-asked.',
  },
  {
    n: '02',
    title: 'Prevention first',
    body: 'Screenings, vaccines, and honest risk conversations before problems start.',
  },
  {
    n: '03',
    title: 'Plain language',
    body: 'Care plans you actually understand — and can actually follow.',
  },
]

export default function About() {
  return (
    <section id="about" style={{ background: 'var(--bg2)', padding: 'clamp(72px,9vw,124px) 0' }}>
      <div
        style={{
          maxWidth: 1220,
          margin: '0 auto',
          padding: '0 clamp(18px,4vw,48px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,440px),1fr))',
          gap: 'clamp(44px,6vw,80px)',
          alignItems: 'center',
        }}
      >
        <div className="reveal">
          <SectionHeading eyebrow="About the practice">
            Old-school attention, <em style={{ fontStyle: 'italic', color: 'var(--olive)' }}>modern medicine.</em>
          </SectionHeading>
          <p style={{ fontSize: 16.5, lineHeight: 1.68, color: 'var(--ink-soft)', marginTop: 22 }}>
            We're an internal medicine practice in the heart of Jamaica, Queens — the kind of office where the front desk
            knows your voice and your doctor remembers what you said last visit.
          </p>
          <p style={{ fontSize: 16.5, lineHeight: 1.68, color: 'var(--ink-soft)', marginTop: 14 }}>
            Our philosophy is simple: prevent what's preventable, manage what's chronic before it becomes acute, and
            explain everything in plain language. No conveyor-belt medicine.
          </p>
          <div style={{ marginTop: 34 }}>
            {PRINCIPLES.map((p, i) => (
              <div
                key={p.n}
                style={{
                  display: 'flex',
                  gap: 18,
                  padding: '18px 0',
                  borderTop: '1px solid var(--line)',
                  borderBottom: i === PRINCIPLES.length - 1 ? '1px solid var(--line)' : undefined,
                }}
              >
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12.5, color: 'var(--olive)', paddingTop: 3 }}>
                  {p.n}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 16.5, fontWeight: 600 }}>{p.title}</span>
                  <span style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-soft)' }}>{p.body}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal" style={{ transitionDelay: '.15s', position: 'relative', padding: '0 0 40px 18px' }}>
          <div
            style={{
              borderRadius: 26,
              overflow: 'hidden',
              border: '1px solid var(--line)',
              aspectRatio: '4/4.4',
              background: 'linear-gradient(150deg, rgba(163,177,138,.3), rgba(200,213,160,.22))',
            }}
          >
            <ImageSlot
              src="/images/shiva-shamtoub-do.webp"
              alt="Physician at Rockaway Internal Medicine in Jamaica, Queens"
              label="Drop a photo — waiting room or care team"
            />
          </div>
          <figure
            style={{
              margin: 0,
              position: 'absolute',
              left: 0,
              bottom: 0,
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 20,
              padding: '20px 24px',
              maxWidth: 320,
              boxShadow: '0 26px 52px -26px rgba(43,43,36,.35)',
            }}
          >
            <blockquote style={{ margin: 0, fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: 19, lineHeight: 1.35 }}>
              "We treat people, not lab values."
            </blockquote>
            <figcaption style={{ marginTop: 10, fontFamily: "'DM Mono',monospace", fontSize: 10.5, letterSpacing: '.2em', color: 'var(--olive)' }}>
              — OUR CARE PHILOSOPHY
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
