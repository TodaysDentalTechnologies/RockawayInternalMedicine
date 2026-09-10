import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BackToTop from './BackToTop'
import ChatWidget from './ChatWidget'
import { useReveal } from '../hooks/useReveal'

// AI front-desk chatbot (ChatWidget → the Flowance assistant, see config/api.ts).
// Switched off on 2026-09-09; back on 2026-09-11 now that it talks to the new
// assistant. Flip to false to hide the chat bar / launcher / overlay everywhere.
const CHAT_ENABLED = true

// Shared chrome for every page: header, footer, floating widgets. The routed
// page renders into <Outlet />. Re-runs reveal animations and scrolls to the
// top on every navigation.
export default function Layout() {
  const { pathname } = useLocation()
  useReveal(pathname)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      {CHAT_ENABLED && <ChatWidget />}
    </>
  )
}
