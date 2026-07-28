import About from '../components/About'
import Seo from '../components/Seo'
import { site } from '../data/clinic'
import { breadcrumbSchema } from '../data/seo'

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 'clamp(28px,5vh,48px)', background: 'var(--bg2)' }}>
      <Seo
        title={`About Us | ${site.brand}`}
        description="Meet the team behind Rockaway Internal Medicine — board-certified adult primary care in Jamaica and Cambria Heights, Queens, built on unhurried, relationship-first visits."
        path="/about"
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])]}
      />
      <About />
    </div>
  )
}
