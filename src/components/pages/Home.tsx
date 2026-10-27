import Hero from '../Hero'
import About from '../About'
import Conditions, { HOME_CONDITIONS_INTRO } from '../Conditions'
import Services from '../Services'
import Insurance from '../Insurance'
import Faq from '../Faq'
import Contact from '../Contact'
import WaveDivider from '../WaveDivider'

// The full single-scroll landing (unchanged from the original one-page site).
// The header/footer nav links route to the dedicated pages; this home page
// still shows every section in order.
export default function Home() {
  return (
    <>
      <Hero />
      <WaveDivider from="var(--bg)" to="var(--bg2)" />
      <About />
      <Conditions intro={HOME_CONDITIONS_INTRO} />
      <Services />
      <WaveDivider from="var(--bg2)" to="var(--dark)" />
      <Insurance />
      <WaveDivider from="var(--dark)" to="var(--bg)" />
      <Faq />
      <Contact />
    </>
  )
}
