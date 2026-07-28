import Contact from '../components/Contact'
import Seo from '../components/Seo'
import { site } from '../data/clinic'
import { breadcrumbSchema } from '../data/seo'

export default function ContactPage() {
  return (
    <div style={{ paddingTop: 'clamp(28px,5vh,48px)', background: 'var(--bg)' }}>
      <Seo
        title={`Contact & Appointments | ${site.brand}`}
        description="Request an appointment online or call our Jamaica or Cambria Heights office directly. New patients welcome, with same-week visits available."
        path="/contact"
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])]}
      />
      <Contact />
    </div>
  )
}
