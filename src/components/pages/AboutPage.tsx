import About from '../About'
import AboutDetail, { AboutHeading } from '../AboutDetail'

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 'clamp(28px,5vh,48px)', background: 'var(--bg2)' }}>
      <AboutHeading />
      <About />
      <AboutDetail />
    </div>
  )
}
