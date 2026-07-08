import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, Chevron, Check } from './icons'

type Props = {
  id?: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  placeholder?: string
  /** Shared input style from the parent form, so it matches every other field. */
  inputStyle: React.CSSProperties
  required?: boolean
}

/**
 * Searchable combobox for the "Reason for visit" field.
 *
 * Purely additive: it reads `value` and reports selections through `onChange`,
 * exactly like the native <select> it replaces. Submission, form state, and
 * validation are unchanged — a visually-hidden `required` proxy input keeps the
 * browser's native "please fill out this field" behavior intact.
 */
export default function ServiceSearchSelect({
  id,
  value,
  options,
  onChange,
  placeholder = 'Search or select a service…',
  inputStyle,
  required,
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // While the dropdown is closed, or the user hasn't typed anything new, show
  // the full list. Otherwise filter by a case-insensitive substring match.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || query === value) return options
    return options.filter((o) => o.toLowerCase().includes(q))
  }, [query, value, options])

  // Close when clicking outside.
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  // Keep the highlighted option scrolled into view.
  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.children[active] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const choose = (opt: string) => {
    onChange(opt)
    setQuery('')
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      setActive((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && filtered[active]) {
        e.preventDefault()
        choose(filtered[active])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  // Text shown in the box: what the user is typing, else the current selection.
  const displayValue = open ? query : value

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <span
          aria-hidden="true"
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)', display: 'inline-flex', pointerEvents: 'none' }}
        >
          <Search size={17} />
        </span>
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          value={displayValue}
          placeholder={value ? value : placeholder}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
            if (!open) setOpen(true)
          }}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          onClick={() => setOpen(true)}
          onKeyDown={onKeyDown}
          style={{ ...inputStyle, paddingLeft: 40, paddingRight: 40 }}
        />
        <span
          aria-hidden="true"
          onMouseDown={(e) => {
            // Toggle without stealing focus from the input.
            e.preventDefault()
            setOpen((v) => !v)
          }}
          style={{ position: 'absolute', right: 12, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform .2s ease', color: 'var(--ink-soft)', display: 'inline-flex', cursor: 'pointer' }}
        >
          <Chevron size={18} />
        </span>

        {/* Focusable-but-invisible proxy so native `required` validation still
            fires on the form exactly as it did with the old <select>. */}
        <input
          tabIndex={-1}
          aria-hidden="true"
          required={required}
          value={value}
          onChange={() => {}}
          style={{ position: 'absolute', left: 20, bottom: 0, width: 1, height: 1, opacity: 0, border: 0, padding: 0, pointerEvents: 'none' }}
        />
      </div>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          style={{
            position: 'absolute',
            zIndex: 20,
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            margin: 0,
            padding: 6,
            listStyle: 'none',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            boxShadow: '0 24px 48px -22px rgba(43,43,36,.4)',
            maxHeight: 264,
            overflowY: 'auto',
          }}
        >
          {filtered.length === 0 ? (
            <li style={{ padding: '12px 14px', fontSize: 14, color: 'var(--ink-soft)' }}>
              No services match “{query.trim()}”
            </li>
          ) : (
            filtered.map((opt, i) => {
              const selected = opt === value
              const isActive = i === active
              return (
                <li
                  key={opt}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    choose(opt)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '11px 13px',
                    borderRadius: 10,
                    fontSize: 14.5,
                    cursor: 'pointer',
                    background: isActive ? 'rgba(46,107,67,.1)' : 'transparent',
                    color: selected ? 'var(--olive-deep)' : 'var(--ink)',
                    fontWeight: selected ? 600 : 400,
                  }}
                >
                  {opt}
                  {selected && <Check size={16} style={{ color: 'var(--olive)', flex: 'none' }} />}
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}
