import Insurance from '../components/Insurance'
import Seo from '../components/Seo'
import { site } from '../data/clinic'
import { breadcrumbSchema } from '../data/seo'

export default function InsurancePage() {
  return (
    <div style={{ paddingTop: 'clamp(28px,5vh,48px)', background: 'var(--dark)' }}>
      <Seo
        title={`Insurance & Payment | ${site.brand}`}
        description="We accept most major plans — Medicare, Medicaid, Aetna, Empire BCBS, Cigna, UnitedHealthcare, Healthfirst, Fidelis, and more. We'll confirm your coverage when you call."
        path="/insurance"
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Insurance', path: '/insurance' }])]}
      />
      <Insurance />
    </div>
  )
}
