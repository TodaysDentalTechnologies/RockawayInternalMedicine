import Hero from '../components/Hero'
import About from '../components/About'
import Conditions from '../components/Conditions'
import Services from '../components/Services'
import Insurance from '../components/Insurance'
import Contact from '../components/Contact'
import WaveDivider from '../components/WaveDivider'

// The full single-scroll landing (unchanged from the original one-page site).
// The header/footer nav links route to the dedicated pages; this home page
// still shows every section in order.
export default function Home() {
  return (
    <>
      <Hero />
      <WaveDivider from="var(--bg)" to="var(--bg2)" />
      <About />
      <Conditions />
      <Services />
      <WaveDivider from="var(--bg2)" to="var(--dark)" />
      <Insurance />
      <WaveDivider from="var(--dark)" to="var(--bg)" />
      <Contact />
    </>
  )
}
