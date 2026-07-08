import { useEffect, useRef, useState } from 'react'
import { locations } from '../data/clinic'
import { Phone, Chevron } from './icons'

interface Props {
  /** Visible label on the trigger (ignored when `iconOnly`). */
  label?: string
  /** Render just the phone icon (e.g. the mobile header button). */
  iconOnly?: boolean
  /** Which edge the dropdown aligns to. */
  align?: 'left' | 'right'
  triggerStyle?: React.CSSProperties
  triggerClassName?: string
  iconColor?: string
  iconSize?: number
}

// A "Call" action that opens a dropdown listing EVERY location's phone number,
// so no single office is favoured. Use wherever a plain tel: link would
// otherwise hardcode one location.
export default function CallMenu({
  label = 'Call',
  iconOnly = false,
  align = 'left',
  triggerStyle,
  triggerClassName,
  iconColor = 'var(--olive)',
  iconSize = 15,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={triggerClassName}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={iconOnly ? 'Call us' : undefined}
        style={triggerStyle}
      >
        <Phone size={iconSize} style={{ color: iconColor }} />
        {!iconOnly && label}
        {!iconOnly && (
          <Chevron size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} />
        )}
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            ...(align === 'right' ? { right: 0 } : { left: 0 }),
            minWidth: 268,
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 16,
            boxShadow: '0 24px 50px -24px rgba(43,43,36,.45)',
            padding: 8,
            zIndex: 80,
            animation: 'rimRise .22s cubic-bezier(.22,.61,.36,1) both',
          }}
        >
          <span style={{ display: 'block', padding: '6px 12px 8px', fontFamily: "'DM Mono',monospace", fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
            Call which office?
          </span>
          {locations.map((loc) => (
            <a
              key={loc.id}
              href={loc.phoneHref}
              role="menuitem"
              onClick={() => setOpen(false)}
              style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '11px 14px', borderRadius: 10, textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, lineHeight: 1, color: 'var(--ink)' }}>{loc.phone}</span>
              <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3 }}>{loc.city} · {loc.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
