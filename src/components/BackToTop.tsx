import { useScrolled } from '../hooks/useReveal'
import { ArrowUp } from './icons'

export default function BackToTop() {
  const show = useScrolled(600)

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        right: 20,
        bottom: 88,
        zIndex: 40,
        width: 46,
        height: 46,
        borderRadius: '50%',
        background: 'var(--card)',
        border: '1px solid var(--line)',
        color: 'var(--olive-deep)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 14px 30px -14px rgba(43,43,36,.45)',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity .35s, transform .35s',
      }}
    >
      <ArrowUp size={19} />
    </button>
  )
}
