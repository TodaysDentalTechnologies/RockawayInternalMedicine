import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import BackToTop from './BackToTop'
import ChatWidget from './ChatWidget'
import { useReveal } from '../hooks/useReveal'

// AI front-desk chatbot (ChatWidget → the Flowance assistant, see config/api.ts).
// Switched off on 2026-09-09; back on 2026-09-11 now that it talks to the new
// assistant. Flip to false to hide the chat bar / launcher / overlay everywhere.
const CHAT_ENABLED = true

// Shared chrome for every page: header, footer, floating widgets. The page
// renders into <main>. Every URL is its own full page load, so the reveal
// animations run once on mount.
export default function Layout({ children }: { children: ReactNode }) {
  useReveal()

  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
      <BackToTop />
      {CHAT_ENABLED && <ChatWidget />}
    </>
  )
}
