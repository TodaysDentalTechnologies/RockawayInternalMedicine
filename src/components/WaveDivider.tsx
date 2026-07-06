interface Props {
  from: string
  to: string
  flip?: boolean
}

// Organic wave separator between sections.
export default function WaveDivider({ from, to, flip }: Props) {
  return (
    <div aria-hidden="true" style={{ background: from, lineHeight: 0, transform: flip ? 'scaleY(-1)' : undefined }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 'clamp(44px,6vw,80px)' }}>
        <path
          d="M0,40 C180,72 360,8 640,28 C920,48 1140,10 1440,44 L1440,80 L0,80 Z"
          style={{ fill: to }}
        />
      </svg>
    </div>
  )
}
