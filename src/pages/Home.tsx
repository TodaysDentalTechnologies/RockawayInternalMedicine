import Hero from '../components/Hero'
import About from '../components/About'
import Conditions from '../components/Conditions'
import Services from '../components/Services'
import Insurance from '../components/Insurance'
import Contact from '../components/Contact'
import WaveDivider from '../components/WaveDivider'
import Seo from '../components/Seo'
import { businessSchema, physicianSchema } from '../data/seo'

// The full single-scroll landing (unchanged from the original one-page site).
// The header/footer nav links route to the dedicated pages; this home page
// still shows every section in order.
export default function Home() {
  return (
    <>
      <Seo
        title="Rockaway Internal Medicine | Adult Primary Care in Jamaica & Cambria Heights, NY"
        description="Adult internal medicine & primary care in Jamaica and Cambria Heights, Queens — preventive care, chronic disease management, and same-week sick visits. New patients welcome."
        path="/"
        schema={[businessSchema(), physicianSchema()]}
      />
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
