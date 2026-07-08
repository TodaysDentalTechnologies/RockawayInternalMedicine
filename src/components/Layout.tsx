import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BackToTop from './BackToTop'
import ChatWidget from './ChatWidget'
import { useReveal } from '../hooks/useReveal'

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
      <ChatWidget />
    </>
  )
}
