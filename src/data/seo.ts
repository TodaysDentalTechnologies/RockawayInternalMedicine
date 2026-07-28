// ─────────────────────────────────────────────────────────────
// SEO / structured-data (JSON-LD) helpers.
//
// IMPORTANT: set SITE_URL to your live domain — it must match the domain
// used in public/robots.txt and public/sitemap.xml. Every @id and absolute
// URL below is derived from this ONE constant so entity links never drift
// (avoids the "#id vs /#id" mismatch that breaks entity references).
// ─────────────────────────────────────────────────────────────
import { site, locations, primaryLocation, doctor, rating, type Location } from './clinic'
import { services, type ServiceItem } from './services'
import { posts, type BlogPost } from './blog'
import { homeFaqs } from './faq'

export const SITE_URL = 'https://rockawayinternalmedicine.com'
export const ORG_ID = `${SITE_URL}/#medicalclinic`
export const PHYSICIAN_ID = `${SITE_URL}/#physician`
const LOGO = `${SITE_URL}/images/logo.png`

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const hhmm = (h: number) =>
  `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`

const openingHours = (loc: Location) =>
  loc.hours
    .map((h, i) =>
      h
        ? {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: `https://schema.org/${DAY[i]}`,
            opens: hhmm(h.open),
            closes: hhmm(h.close),
          }
        : null,
    )
    .filter(Boolean)

const geoCoordinates = (loc: Location) => ({
  '@type': 'GeoCoordinates',
  latitude: loc.lat,
  longitude: loc.lng,
})

const aggregateRating = () => ({
  '@type': 'AggregateRating',
  ratingValue: rating.value,
  reviewCount: rating.count,
  bestRating: 5,
  worstRating: 1,
})

const areaServed = () => [
  ...[...new Set(locations.map((l) => l.city))].map((c) => ({ '@type': 'City', name: c })),
  { '@type': 'AdministrativeArea', name: 'Queens, New York' },
]

const postalAddress = (loc: Location) => ({
  '@type': 'PostalAddress',
  streetAddress: loc.address,
  addressLocality: loc.city,
  addressRegion: loc.stateAbbr,
  postalCode: loc.zip,
  addressCountry: 'US',
})

const locationNode = (loc: Location) => ({
  '@type': 'MedicalClinic',
  '@id': `${SITE_URL}/locations/${loc.id}#clinic`,
  name: `${loc.name} — ${loc.city}`,
  url: `${SITE_URL}/locations/${loc.id}`,
  telephone: loc.phoneHref.replace('tel:', ''),
  address: postalAddress(loc),
  geo: geoCoordinates(loc),
  openingHoursSpecification: openingHours(loc),
  parentOrganization: { '@id': ORG_ID },
})

// Sitewide business entity — mirrored statically in index.html (same @id → dedupes).
export function businessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': ORG_ID,
    name: site.brand,
    url: SITE_URL,
    logo: LOGO,
    image: LOGO,
    telephone: primaryLocation.phoneHref.replace('tel:', ''),
    medicalSpecialty: ['InternalMedicine', 'PrimaryCare'],
    address: postalAddress(primaryLocation),
    geo: geoCoordinates(primaryLocation),
    openingHoursSpecification: openingHours(primaryLocation),
    areaServed: areaServed(),
    aggregateRating: aggregateRating(),
    employee: { '@id': PHYSICIAN_ID },
    department: locations.map(locationNode),
  }
}

// Sitewide physician entity — mirrored statically in index.html (same @id → dedupes).
export function physicianSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': PHYSICIAN_ID,
    name: doctor.name,
    honorificSuffix: doctor.credential,
    description: `${doctor.boardCertification}. Adult primary care in Jamaica and Cambria Heights, Queens, NY.`,
    image: `${SITE_URL}${doctor.image}`,
    url: SITE_URL,
    telephone: primaryLocation.phoneHref.replace('tel:', ''),
    address: postalAddress(primaryLocation),
    medicalSpecialty: ['InternalMedicine', 'PrimaryCare'],
    identifier: { '@type': 'PropertyValue', propertyID: 'NPI', value: doctor.npi },
    alumniOf: { '@type': 'CollegeOrUniversity', name: doctor.education },
    knowsLanguage: doctor.languages,
    sameAs: [...doctor.sameAs],
    worksFor: { '@id': ORG_ID },
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  }
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function serviceSchema(s: ServiceItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${SITE_URL}/services/${s.slug}#webpage`,
    url: `${SITE_URL}/services/${s.slug}`,
    name: `${s.title} | ${site.brand}`,
    description: s.body,
    about: { '@type': 'MedicalProcedure', name: s.title, description: s.body },
    provider: { '@id': ORG_ID },
    isPartOf: { '@id': ORG_ID },
  }
}

export function articleSchema(p: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}/blog/${p.slug}#article`,
    headline: p.title,
    description: p.excerpt,
    image: `${SITE_URL}${p.img}`,
    datePublished: p.date,
    dateModified: p.date,
    author: { '@type': 'Organization', name: site.brand, '@id': ORG_ID },
    publisher: {
      '@type': 'Organization',
      name: site.brand,
      logo: { '@type': 'ImageObject', url: LOGO },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${p.slug}` },
  }
}

// ── Prerender manifest ──────────────────────────────────────────
// Single source of truth for the build-time prerender (scripts/prerender.mjs):
// every route with the exact JSON-LD it should ship in its static HTML. Uses the
// same schema builders the pages use, so the prerendered and client-rendered
// structured data can never drift.
export interface PrerenderRoute {
  path: string
  title: string
  schema: object[]
}

const HOME = { name: 'Home', path: '/' }
const trail = (...rest: { name: string; path: string }[]) => breadcrumbSchema([HOME, ...rest])

export function allRoutes(): PrerenderRoute[] {
  const b = site.brand
  const routes: PrerenderRoute[] = [
    {
      path: '/',
      title: `${b} | Adult Primary Care in Jamaica & Cambria Heights, NY`,
      schema: [businessSchema(), physicianSchema(), faqSchema(homeFaqs)],
    },
    { path: '/about', title: `About | ${b}`, schema: [trail({ name: 'About', path: '/about' })] },
    { path: '/conditions', title: `Conditions We Treat | ${b}`, schema: [trail({ name: 'Conditions', path: '/conditions' })] },
    { path: '/services', title: `Services | ${b}`, schema: [trail({ name: 'Services', path: '/services' })] },
    { path: '/insurance', title: `Insurance Accepted | ${b}`, schema: [trail({ name: 'Insurance', path: '/insurance' })] },
    { path: '/locations', title: `Our Locations | ${b}`, schema: [trail({ name: 'Locations', path: '/locations' })] },
    { path: '/blog', title: `Health Blog | ${b}`, schema: [trail({ name: 'Blog', path: '/blog' })] },
    { path: '/contact', title: `Contact | ${b}`, schema: [trail({ name: 'Contact', path: '/contact' })] },
  ]

  for (const s of services) {
    routes.push({
      path: `/services/${s.slug}`,
      title: `${s.title} | ${b}`,
      schema: [
        serviceSchema(s),
        faqSchema(s.faqs),
        trail({ name: 'Services', path: '/services' }, { name: s.title, path: `/services/${s.slug}` }),
      ],
    })
  }

  for (const p of posts) {
    routes.push({
      path: `/blog/${p.slug}`,
      title: `${p.title} | ${b}`,
      schema: [
        articleSchema(p),
        faqSchema(p.faqs),
        trail({ name: 'Blog', path: '/blog' }, { name: p.title, path: `/blog/${p.slug}` }),
      ],
    })
  }

  for (const loc of locations) {
    routes.push({
      path: `/locations/${loc.id}`,
      title: `${loc.city} Office | ${b}`,
      schema: [trail({ name: 'Locations', path: '/locations' }, { name: loc.city, path: `/locations/${loc.id}` })],
    })
  }

  return routes
}
