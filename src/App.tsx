import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/pages/Home'
import AboutPage from './components/pages/AboutPage'
import ConditionsPage from './components/pages/ConditionsPage'
import ServicesPage from './components/pages/ServicesPage'
import ServiceDetailPage from './components/pages/ServiceDetailPage'
import InsurancePage from './components/pages/InsurancePage'
import ContactPage from './components/pages/ContactPage'
import LocationsPage from './components/pages/LocationsPage'
import LocationDetailPage from './components/pages/LocationDetailPage'
import BlogPage from './components/pages/BlogPage'
import BlogPostPage from './components/pages/BlogPostPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/conditions" element={<ConditionsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/insurance" element={<InsurancePage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/locations/:id" element={<LocationDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
