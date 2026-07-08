import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { locations, site } from '../data/clinic'
import { API_CONFIG } from '../config/api'
import { Send, Close, Chat } from './icons'

const linkStyle: React.CSSProperties = { color: 'var(--olive-deep)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }
const mapsUrl = (address: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

// Rotating hint text shown in the input placeholder.
const PLACEHOLDERS = [
  'What are your services and office hours?',
  'I need to schedule an appointment',
  'What insurance do you accept?',
  'Where are you located?',
  'Do you accept new patients?',
]

interface Msg {
  id: string
  role: 'user' | 'bot'
  content: ReactNode
}

// Lists every office's number so no single location is favoured.
const PhoneLink = () => (
  <>
    {locations.map((loc, i) => (
      <span key={loc.id}>
        {i > 0 && ' or '}
        <a href={loc.phoneHref} style={linkStyle}>{loc.phone}</a> ({loc.city})
      </span>
    ))}
  </>
)

// Offline fallback "front desk" assistant: routes free text to a canned
// answer when the AI agent WebSocket is unreachable or times out.
function answer(text: string): ReactNode {
  const t = text.toLowerCase()
  const has = (re: RegExp) => re.test(t)

  if (has(/emergency|911|urgent|chest pain|can'?t breathe|bleeding/))
    return <>If this is a medical emergency, please call <strong>911</strong> right away. For urgent but non-emergency questions, call our office at <PhoneLink />.</>

  if (has(/hour|open|clos|today|when.*(open|close)|what time/))
    return <>Both offices are open <strong>Mon–Fri 9:00 AM–5:00 PM</strong> and <strong>Saturday 9:00 AM–1:00 PM</strong>. Closed Sunday. Call <PhoneLink /> anytime and we'll pick up during office hours.</>

  if (has(/insur|plan|cover|medicare|medicaid|aetna|cigna|united|blue|bcbs|emblem|fidelis|healthfirst|metroplus|copay|pay/))
    return <>We accept most major plans — Medicare, Medicaid, Aetna, Empire BCBS, Cigna, UnitedHealthcare, Healthfirst, Fidelis, EmblemHealth, MetroPlus and more. We'll confirm your specific coverage when you call <PhoneLink />.</>

  if (has(/appoint|book|schedul|visit|reserve|slot|see (a|the) doctor|come in/))
    return <>Happy to help you book. Use the appointment request form on this page, or call the front desk at <PhoneLink /> — we usually have same-week openings.</>

  if (has(/where|locat|address|direction|map|find you|parking|near/))
    return (
      <>
        We have <strong>two Queens offices</strong>:{' '}
        {locations.map((loc, i) => (
          <span key={loc.id}>
            {i > 0 && '; '}
            <strong>{loc.fullAddress}</strong> (<a href={mapsUrl(loc.fullAddress)} target="_blank" rel="noopener noreferrer" style={linkStyle}>directions</a>)
          </span>
        ))}
        .
      </>
    )

  if (has(/new patient|accept.*patient|taking.*patient|first (visit|time)/))
    return <>Yes — we're welcoming new patients, and most first visits are scheduled within the week. Call <PhoneLink /> or use the request form to get started.</>

  if (has(/human|person|talk|speak|call|phone|front desk|reception|someone/))
    return <>Of course — call <PhoneLink /> and a real person will pick up during office hours.</>

  if (has(/^\s*(hi|hello|hey|yo|good (morning|afternoon|evening))\b/))
    return <>Hi there! I can help with appointments, hours, insurance, directions, or getting you to the front desk. What do you need?</>

  if (has(/thank|thanks|thx|appreciate/))
    return <>You're welcome! Anything else I can help with? You can always reach the front desk at <PhoneLink />.</>

  return <>I can help with <strong>appointments</strong>, <strong>office hours</strong>, <strong>insurance</strong>, <strong>directions</strong>, or connecting you with the front desk. You can also call us at <PhoneLink />.</>
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [typing, setTyping] = useState(false)
  const [ph, setPh] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  const listRef = useRef<HTMLDivElement>(null)
  const overlayInputRef = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])

  // AI agent WebSocket (TodaysDentalInsightsAiAgentsS1). Messages typed before
  // the socket opens are queued and flushed on connect; if the socket fails or
  // a reply never arrives, the queued text is answered by the canned fallback.
  const wsRef = useRef<WebSocket | null>(null)
  const pendingQueue = useRef<string[]>([])
  const fallbackTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t))
      if (fallbackTimer.current) window.clearTimeout(fallbackTimer.current)
      wsRef.current?.close()
    },
    [],
  )

  const addBotMsg = (content: ReactNode) => {
    if (fallbackTimer.current) {
      window.clearTimeout(fallbackTimer.current)
      fallbackTimer.current = null
    }
    setMsgs((m) => m.concat([{ id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, role: 'bot', content }]))
    setTyping(false)
  }

  // Answer anything still waiting with the canned fallback (socket dead/slow).
  const answerFallback = (text?: string) => {
    const queued = pendingQueue.current
    pendingQueue.current = []
    const toAnswer = text != null ? [text] : queued
    toAnswer.forEach((t) => addBotMsg(answer(t)))
  }

  const armFallbackTimer = (text: string) => {
    if (fallbackTimer.current) window.clearTimeout(fallbackTimer.current)
    fallbackTimer.current = window.setTimeout(() => {
      fallbackTimer.current = null
      answerFallback(text)
    }, 25000)
  }

  const connectWs = () => {
    const existing = wsRef.current
    if (existing && (existing.readyState === WebSocket.OPEN || existing.readyState === WebSocket.CONNECTING)) return existing

    try {
      const ws = new WebSocket(API_CONFIG.WEBSOCKET_API)

      ws.onopen = () => {
        pendingQueue.current.forEach((text) => ws.send(JSON.stringify({ action: 'message', message: text })))
        pendingQueue.current = []
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          switch (data.type) {
            // AI agent streaming protocol
            case 'thinking':
            case 'chunk':
            case 'agent_typing':
              setTyping(true)
              break
            case 'complete':
              addBotMsg(data.content || '')
              break
            // Human agent handoff events
            case 'handoff_queued':
              addBotMsg(data.content || 'Connecting you with a team member. Please hold on…')
              break
            case 'handoff_started':
              addBotMsg(data.content || "You're now connected with a team member.")
              break
            case 'agent_message':
              addBotMsg(data.content || '')
              break
            case 'handoff_ended':
              addBotMsg(data.content || "You're now back with our AI assistant. How can I help you?")
              break
            case 'error':
              addBotMsg(data.content || data.message || 'Sorry, something went wrong. Please try again.')
              break
            default: {
              // Legacy single-shot response fallback
              const text = data.message || data.text || data.content
              if (text) addBotMsg(text)
            }
          }
        } catch {
          console.error('[Chat] Failed to parse message')
        }
      }

      ws.onclose = () => {
        wsRef.current = null
        if (pendingQueue.current.length > 0) answerFallback()
      }

      ws.onerror = (error) => {
        console.error('[Chat] WebSocket error:', error)
      }

      wsRef.current = ws
      return ws
    } catch (error) {
      console.error('[Chat] Failed to create WebSocket:', error)
      answerFallback()
      return null
    }
  }

  // Rotate the placeholder suggestion.
  useEffect(() => {
    const id = window.setInterval(() => setPh((p) => (p + 1) % PLACEHOLDERS.length), 3500)
    return () => window.clearInterval(id)
  }, [])

  // Keep the bar out of the hero — only reveal it once scrolled into the page,
  // so it never covers the hero CTA / trust row.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Auto-scroll the message list.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs, typing, open])

  // Focus the overlay input when it opens; lock body scroll. Also eagerly
  // connect the AI agent socket so the first message doesn't wait on it.
  useEffect(() => {
    if (open) {
      connectWs()
      const id = window.setTimeout(() => overlayInputRef.current?.focus(), 280)
      timers.current.push(id)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const send = (raw: string) => {
    const text = raw.trim()
    if (!text) return
    const uid = `u-${Date.now()}`
    setMsgs((m) => m.concat([{ id: uid, role: 'user', content: text }]))
    setInput('')
    setOpen(true)
    setTyping(true)

    const ws = wsRef.current
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: 'message', message: text }))
    } else {
      pendingQueue.current.push(text)
      connectWs()
    }
    armFallbackTimer(text)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const barSendStyle: React.CSSProperties = {
    width: 38,
    height: 38,
    flex: 'none',
    borderRadius: '50%',
    background: input.trim() ? 'var(--card)' : 'rgba(241,246,241,.55)',
    color: input.trim() ? 'var(--olive-deep)' : 'rgba(28,74,44,.5)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,.12)',
    transition: 'background .2s, color .2s, transform .2s',
  }

  return (
    <>
      {/* ── Compact centered bottom bar (hidden over the hero) ──── */}
      {!open && scrolled && (
        <div className="rim-chat-bar" style={{ position: 'fixed', bottom: 'calc(16px + env(safe-area-inset-bottom))', zIndex: 70 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--olive-deep)',
              border: '1px solid rgba(241,246,241,.14)',
              borderRadius: 20,
              padding: '12px 14px',
              boxShadow: '0 24px 50px -18px rgba(43,43,36,.6)',
              animation: 'rimRise .5s cubic-bezier(.22,.61,.36,1) both',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'var(--on-olive)', fontSize: 12.5, fontWeight: 600, lineHeight: 1.2, marginBottom: 7 }}>
                Hi! I'm the front desk <span style={{ fontWeight: 400, color: 'rgba(241,246,241,.62)' }}>— ask me anything</span>
              </p>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                onFocus={connectWs}
                placeholder={PLACEHOLDERS[ph]}
                aria-label="Ask the front desk"
                className="rim-chat-input"
                style={{ width: '100%', background: 'var(--card)', border: 0, borderRadius: 999, padding: '10px 16px', fontSize: 13, color: 'var(--ink)', outline: 'none' }}
              />
            </div>
            <button onClick={() => send(input)} disabled={!input.trim()} style={barSendStyle} aria-label="Send message">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Hero launcher — small chat icon bottom-right, shown only while the
          centered bar is hidden (i.e. before scrolling into the page). */}
      {!open && !scrolled && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ask the front desk"
          className="rim-cta"
          style={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            zIndex: 70,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--olive-deep)',
            color: 'var(--on-olive)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 44px -16px rgba(43,43,36,.5)',
            animation: 'rimRise .4s cubic-bezier(.22,.61,.36,1) both',
          }}
        >
          <Chat size={24} />
        </button>
      )}

      {/* keep page content clear of the fixed bar */}
      {!open && scrolled && <div style={{ height: 92, background: 'var(--dark2)' }} />}

      {/* ── Full-screen overlay ─────────────────────────────────── */}
      {open && (
        <div id="rim-chat-overlay" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column' }}>
          {/* backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,18,.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', animation: 'rimRise .3s ease both' }}
          />

          {/* content */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', animation: 'rimRise .35s cubic-bezier(.22,.61,.36,1) both' }}>
            {/* header */}
            <header style={{ background: 'var(--olive-deep)', borderBottom: '1px solid rgba(241,246,241,.14)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: 'var(--card)', color: 'var(--olive-deep)', fontFamily: "'Fraunces',serif", fontSize: 17, flex: 'none' }}>{site.logoLetter}</span>
                <h2 style={{ color: 'var(--on-olive)', fontFamily: "'Fraunces',serif", fontSize: 19, letterSpacing: '.01em' }}>Front Desk Chat</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                style={{ width: 36, height: 36, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(241,246,241,.85)', transition: 'background .2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,.18)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Close size={20} strokeWidth={2} />
              </button>
            </header>

            {/* messages */}
            <div ref={listRef} aria-live="polite" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
              <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px clamp(16px,4vw,28px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* welcome bubble */}
                {msgs.length === 0 && !typing && (
                  <div style={{ alignSelf: 'flex-start', maxWidth: '82%' }}>
                    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '18px 18px 18px 6px', padding: '12px 16px', fontSize: 14, lineHeight: 1.55 }}>
                      Hi, welcome to {site.brand}! How can I help you today?
                    </div>
                  </div>
                )}

                {msgs.map((m) => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div
                      style={
                        m.role === 'user'
                          ? { maxWidth: '82%', background: 'var(--olive-deep)', color: 'var(--on-olive)', borderRadius: '18px 18px 6px 18px', padding: '12px 16px', fontSize: 14, lineHeight: 1.5 }
                          : { maxWidth: '82%', background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '18px 18px 18px 6px', padding: '12px 16px', fontSize: 14, lineHeight: 1.55, whiteSpace: 'pre-wrap' as const }
                      }
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div style={{ alignSelf: 'flex-start' }}>
                    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '18px 18px 18px 6px', padding: '14px 16px', display: 'flex', gap: 5 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--olive)', animation: 'rimDots 1.1s ease-in-out infinite' }} />
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--olive)', animation: 'rimDots 1.1s ease-in-out .15s infinite' }} />
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--olive)', animation: 'rimDots 1.1s ease-in-out .3s infinite' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* input bar */}
            <div style={{ background: 'var(--card)', borderTop: '1px solid var(--line)', flex: 'none' }}>
              <div style={{ maxWidth: 860, margin: '0 auto', padding: '12px clamp(16px,4vw,28px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  ref={overlayInputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder={PLACEHOLDERS[ph]}
                  aria-label="Type a message"
                  className="rim-chat-input"
                  style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 999, padding: '13px 18px', fontSize: 14, color: 'var(--ink)', outline: 'none' }}
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim()}
                  aria-label="Send message"
                  style={{
                    width: 44,
                    height: 44,
                    flex: 'none',
                    borderRadius: '50%',
                    background: input.trim() ? 'var(--olive-deep)' : 'var(--line)',
                    color: input.trim() ? 'var(--on-olive)' : 'var(--ink-soft)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background .2s, color .2s, transform .2s',
                  }}
                  onMouseEnter={(e) => { if (input.trim()) e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                >
                  <Send size={17} />
                </button>
              </div>
              <p style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(16px,4vw,28px) 10px', fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '.1em', color: 'var(--ink-soft)', textAlign: 'center' }}>
                FOR EMERGENCIES, CALL 911
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
