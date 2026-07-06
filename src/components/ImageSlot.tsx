interface Props {
  label: string
  src?: string
  alt?: string
}

// Drop a real photo in later by passing `src` + `alt`. Until then it renders a
// tasteful olive placeholder so the layout reads correctly.
export default function ImageSlot({ label, src, alt }: Props) {
  if (src) {
    return <img src={src} alt={alt ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 24,
        textAlign: 'center',
        color: 'var(--olive-deep)',
      }}
    >
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, letterSpacing: '.08em', maxWidth: '26ch', opacity: 0.8 }}>
        {label}
      </span>
    </div>
  )
}
