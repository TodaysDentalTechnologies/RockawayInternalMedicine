import Conditions from '../components/Conditions'
import Seo from '../components/Seo'
import { site } from '../data/clinic'
import { breadcrumbSchema } from '../data/seo'

export default function ConditionsPage() {
  return (
    <div style={{ paddingTop: 'clamp(28px,5vh,48px)', background: 'var(--bg)' }}>
      <Seo
        title={`Conditions We Treat | ${site.brand}`}
        description="From high blood pressure and diabetes to thyroid, cholesterol, and everyday illness — the conditions our internal medicine team manages under one roof."
        path="/conditions"
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Conditions', path: '/conditions' }])]}
      />
      <Conditions />
    </div>
  )
}
