// ─────────────────────────────────────────────────────────────
// SEO / structured-data (JSON-LD) helpers.
//
// IMPORTANT: set SITE_URL to your live domain — it must match the domain
// used in public/robots.txt and public/sitemap.xml. Every @id and absolute
// URL below is derived from this ONE constant so entity links never drift
// (avoids the "#id vs /#id" mismatch that breaks entity references).
// ─────────────────────────────────────────────────────────────
import { site, locations, primaryLocation, type Location } from './clinic'
import type { ServiceItem } from './services'
import type { BlogPost } from './blog'

export const SITE_URL = 'https://rockawayinternalmedicine.com'
export const ORG_ID = `${SITE_URL}/#medicalclinic`
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
    openingHoursSpecification: openingHours(primaryLocation),
    areaServed: [...new Set(locations.map((l) => l.city))].map((c) => ({ '@type': 'City', name: c })),
    department: locations.map(locationNode),
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
