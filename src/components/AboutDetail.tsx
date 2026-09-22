interface Point {
  n: string
  title: string
  body: string
}

const WHY_US: Point[] = [
  {
    n: '01',
    title: 'Integrated Patient Records',
    body: 'We manage your wellness under a single, unified electronic health record system. Whether you are consulting for specialized neurology, cardiovascular assessments, or metabolic care, our cross-functional teams see the exact same clinical history.',
  },
  {
    n: '02',
    title: 'Comprehensive Internal Medicine',
    body: 'Our practice bridges the gap between general checkups and complex diagnostics. We treat the whole person, mapping long-term diagnostic trends to prevent illnesses before they advance.',
  },
  {
    n: '03',
    title: 'Unhurried, Focused Consultations',
    body: 'We deliberately cap daily provider patient loads. This design yields meaningful face-to-face evaluation time with your doctor during every single clinical visit.',
  },
]

const COMMITMENTS: Point[] = [
  {
    n: '01',
    title: 'Advanced Diagnostic Excellence',
    body: 'We leverage high-resolution medical diagnostics to uncover underlying clinical issues early. Our practitioners specialize in complex chronic disease management, managing intersecting systemic medical conditions with absolute precision.',
  },
  {
    n: '02',
    title: 'Proactive Preventive Healthcare',
    body: 'True health is built between medical events. We focus heavily on preventive healthcare services, offering dedicated lifestyle coaching, routine immunizations, comprehensive metabolic panels, and proactive cancer screenings to keep you thriving.',
  },
  {
    n: '03',
    title: 'Seamless Continuity of Care',
    body: 'From your yearly wellness evaluation to long-term specialty tracking, your clinical milestones are fiercely protected by a cohesive group of providers. You will never have to re-explain your symptoms to multiple uncoordinated care groups again.',
  },
]

const SECTION_HEADING = {
  fontFamily: "'Fraunces',serif",
  fontWeight: 400,
  fontSize: 'clamp(28px,3.6vw,44px)',
  lineHeight: 1.06,
  letterSpacing: '-.01em',
} as const

const BODY_TEXT = {
  fontSize: 'clamp(15px,1.5vw,17px)',
  lineHeight: 1.72,
  color: 'var(--ink-soft)',
} as const

function PointList({ points }: { points: Point[] }) {
  return (
    <div>
      {points.map((p, i) => (
        <div
          key={p.n}
          style={{
            display: 'flex',
            gap: 18,
            padding: '20px 0',
            borderTop: '1px solid var(--line)',
            borderBottom: i === points.length - 1 ? '1px solid var(--line)' : undefined,
          }}
        >
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12.5, color: 'var(--olive)', paddingTop: 4 }}>{p.n}</span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h3 style={{ fontSize: 17, fontWeight: 600 }}>{p.title}</h3>
            <span style={{ ...BODY_TEXT, fontSize: 15.5 }}>{p.body}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

function Figure({ src, alt, delay = 0 }: { src: string; alt: string; delay?: number }) {
  return (
    <div
      className="reveal"
      style={{
        transitionDelay: `${delay}s`,
        aspectRatio: '1 / 1',
        borderRadius: 26,
        overflow: 'hidden',
        border: '1px solid var(--line)',
        background: 'linear-gradient(150deg, rgba(134,168,148,.3), rgba(179,209,187,.22))',
      }}
    >
      <img
        src={src}
        alt={alt}
        width={1100}
        height={1100}
        loading="lazy"
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  )
}

// The doc-supplied About content. It sits above the original About block on
// /about; the home page keeps that original block on its own.
// The page title for /about. Rendered above the original About block so the
// page opens with its heading.
export function AboutHeading() {
  return (
    <section style={{ background: 'var(--bg2)', padding: 'clamp(56px,7vw,92px) 0 0' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        <div className="reveal" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
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
            About us
            <span style={{ width: 22, height: 1.5, background: 'var(--olive)' }} />
          </span>
          <h1
            style={{
              fontFamily: "'Fraunces',serif",
              fontWeight: 400,
              fontSize: 'clamp(38px,5.6vw,66px)',
              lineHeight: 1.03,
              letterSpacing: '-.015em',
              marginTop: 18,
            }}
          >
            About Rockaway Internal Medicine
          </h1>
        </div>
      </div>
    </section>
  )
}

export default function AboutDetail() {
  return (
    <section style={{ background: 'var(--bg2)', padding: 'clamp(72px,9vw,120px) 0 clamp(64px,9vw,110px)' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 clamp(18px,4vw,48px)' }}>
        <div className="reveal" style={{ maxWidth: 840, margin: '0 auto' }}>
          <h2 style={{ ...SECTION_HEADING }}>Our Mission: Healthcare Grounded in Personal Connection</h2>
          <p style={{ ...BODY_TEXT, marginTop: 18 }}>
            At Rockaway Internal Medicine, we believe that exceptional healthcare begins with a deep clinical relationship. Our adult primary care clinic was founded to eliminate rushed, template-driven appointments. Instead, we provide an environment where board-certified physicians take the time to map out your complete health journey, coordinate multi-specialty evaluations, and deliver medicine centered entirely around you.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))',
            gap: 'clamp(32px,5vw,64px)',
            alignItems: 'center',
            marginTop: 'clamp(52px,7vw,90px)',
          }}
        >
          <Figure src="/images/about-records.webp" alt="Stethoscope and heart on a bright clinic desk, representing one shared patient record" />
          <div className="reveal" style={{ transitionDelay: '.1s' }}>
            <h2 style={{ ...SECTION_HEADING }}>Why Choose Our Medical Practice?</h2>
            <div style={{ marginTop: 22 }}>
              <PointList points={WHY_US} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))',
            gap: 'clamp(32px,5vw,64px)',
            alignItems: 'center',
            marginTop: 'clamp(52px,7vw,90px)',
          }}
        >
          <div className="reveal">
            <h2 style={{ ...SECTION_HEADING }}>Our Core Clinical Commitments</h2>
            <div style={{ marginTop: 22 }}>
              <PointList points={COMMITMENTS} />
            </div>
          </div>
          <Figure
            src="/images/about-commitments.webp"
            alt="Clinician in gloves reviewing a patient chart beside a stethoscope in a clinic"
            delay={0.1}
          />
        </div>
      </div>
    </section>
  )
}
