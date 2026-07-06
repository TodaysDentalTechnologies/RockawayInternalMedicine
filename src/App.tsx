import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Conditions from './components/Conditions'
import Services from './components/Services'
import Insurance from './components/Insurance'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ChatWidget from './components/ChatWidget'
import WaveDivider from './components/WaveDivider'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <WaveDivider from="var(--bg)" to="var(--bg2)" />
        <About />
        <Conditions />
        <Services />
        <WaveDivider from="var(--bg2)" to="var(--dark)" />
        <Insurance />
        <WaveDivider from="var(--dark)" to="var(--bg)" />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <ChatWidget />
    </>
  )
}
