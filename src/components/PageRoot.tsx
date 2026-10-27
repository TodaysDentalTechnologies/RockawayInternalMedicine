import { StrictMode } from 'react'
import Layout from './Layout'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import ConditionsPage from './pages/ConditionsPage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import InsurancePage from './pages/InsurancePage'
import ContactPage from './pages/ContactPage'
import LocationsPage from './pages/LocationsPage'
import LocationDetailPage from './pages/LocationDetailPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'

export type PageName =
  | 'home'
  | 'about'
  | 'conditions'
  | 'services'
  | 'service'
  | 'insurance'
  | 'locations'
  | 'location'
  | 'blog'
  | 'post'
  | 'contact'

// The one React island on every page (rendered client:only by src/pages/*.astro):
// shared chrome from <Layout> around the page component. Detail pages get their
// URL segment as `slug`.
export default function PageRoot({ page, slug = '' }: { page: PageName; slug?: string }) {
  return (
    <StrictMode>
      <Layout>
        {page === 'home' && <Home />}
        {page === 'about' && <AboutPage />}
        {page === 'conditions' && <ConditionsPage />}
        {page === 'services' && <ServicesPage />}
        {page === 'service' && <ServiceDetailPage slug={slug} />}
        {page === 'insurance' && <InsurancePage />}
        {page === 'locations' && <LocationsPage />}
        {page === 'location' && <LocationDetailPage slug={slug} />}
        {page === 'blog' && <BlogPage />}
        {page === 'post' && <BlogPostPage slug={slug} />}
        {page === 'contact' && <ContactPage />}
      </Layout>
    </StrictMode>
  )
}
