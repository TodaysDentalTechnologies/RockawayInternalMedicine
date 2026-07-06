import type { ReactNode } from 'react'

interface Props {
  eyebrow: string
  children: ReactNode
  maxWidth?: string | number
  /** Applied to the <h2> itself (uses the heading's own font for `ch` units). */
  headingMaxWidth?: string | number
  delay?: number
}

export default function SectionHeading({ eyebrow, children, maxWidth, headingMaxWidth, delay = 0 }: Props) {
  return (
    <div className="reveal" style={{ transitionDelay: `${delay}s`, maxWidth }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: "'DM Mono',monospace",
          fontSize: 12.5,
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          color: 'var(--olive)',
        }}
      >
        <span style={{ width: 26, height: 1.5, background: 'var(--olive)' }} />
        {eyebrow}
      </span>
      <h2
        style={{
          fontFamily: "'Instrument Serif',serif",
          fontWeight: 400,
          fontSize: 'clamp(34px,4.4vw,54px)',
          lineHeight: 1.04,
          letterSpacing: '-.01em',
          marginTop: 18,
          maxWidth: headingMaxWidth,
        }}
      >
        {children}
      </h2>
    </div>
  )
}
