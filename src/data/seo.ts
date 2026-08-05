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
import { GENERATED_META } from './generated-meta'

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
  // A stable @id (derived from the page this trail ends on) lets crawlers merge
  // the prerendered copy and the client-injected copy into ONE node instead of
  // double-counting — same trick the MedicalWebPage/business nodes already use.
  const last = items[items.length - 1]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${SITE_URL}${last?.path ?? ''}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  }
}

// `pageUrl` is the canonical URL of the page the FAQ lives on; it becomes the
// FAQPage @id so the prerendered and client-rendered copies merge (no dupes).
export function faqSchema(faqs: { q: string; a: string }[], pageUrl?: string) {
  // Defensive dedupe: a question must never appear twice inside one FAQPage —
  // Google's validator flags duplicate Question objects as invalid.
  const seen = new Set<string>()
  const unique = faqs.filter((f) => {
    const key = f.q.trim().toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(pageUrl ? { '@id': `${pageUrl}#faq` } : {}),
    mainEntity: unique.map((f) => ({
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

// ── Route meta + prerender manifest ─────────────────────────────
// Single source of truth for BOTH the build-time prerender (scripts/prerender.mjs)
// AND the runtime <Seo> component: every route's title, meta description, OG
// image/type and the exact JSON-LD it ships. Meta spec: titles 50–55 chars
// (hard cap 60), descriptions 145–155 chars (hard cap 160) — enforced by
// scripts/check-meta.mjs; run it after editing anything here.
export interface PrerenderRoute {
  path: string
  title: string
  description: string
  /** og:image — site-relative or absolute. Defaults to the logo. */
  image?: string
  /** og:type. Defaults to "website". */
  type?: 'website' | 'article'
  schema: object[]
}

const HOME = { name: 'Home', path: '/' }
const trail = (...rest: { name: string; path: string }[]) => breadcrumbSchema([HOME, ...rest])

interface Meta {
  title: string
  description: string
}

// Meta resolution order, per route:
//   1. the hand-written map below (crafted copy — always wins)
//   2. ./generated-meta.ts (written by `node scripts/gen-meta.mjs`)
//   3. a plain derived fallback, which is the ONLY tier that can break the
//      length spec — that is exactly how a 97-char blog title shipped. The
//      build now runs scripts/check-meta.mjs before bundling, so anything
//      sitting on tier 3 and out of spec fails the build instead of deploying.
const resolveMeta = (path: string, hand: Meta | undefined, fallback: Meta): Meta =>
  hand ?? GENERATED_META[path] ?? fallback

// Crafted per-service meta (titles 50–55, descriptions 145–155), keyed by slug.
const SERVICE_META: Record<string, { title: string; description: string }> = {
  cardiology: {
    title: 'Cardiology in Queens NY | Rockaway Internal Medicine',
    description:
      'Cardiology care in Jamaica & Cambria Heights, Queens — heart health checks, EKG, blood pressure and cholesterol management. Call 718-732-7744 to book.',
  },
  'diabetes-management': {
    title: 'Diabetes Care in Queens NY | Rockaway Internal Medicine',
    description:
      'Diabetes management in Jamaica & Cambria Heights, Queens — A1C testing, medication and food-first guidance that fits your life. Call 718-732-7744 today.',
  },
  'hypertension-treatment': {
    title: 'Hypertension Treatment | Rockaway Internal Medicine',
    description:
      'Hypertension treatment in Jamaica & Cambria Heights, Queens — steady blood-pressure control with meds tuned to you. Call 718-732-7744 to book a visit.',
  },
  'cholesterol-testing': {
    title: 'Cholesterol Testing & Management in Jamaica, Queens',
    description:
      'Cholesterol testing in Jamaica & Cambria Heights, Queens — full lipid panels and risk-based treatment plans that work. Call 718-732-7744 to book today.',
  },
  'thyroid-treatment': {
    title: 'Thyroid Treatment, Queens | Rockaway Internal Medicine',
    description:
      'Thyroid treatment in Jamaica & Cambria Heights, Queens — testing, dosing and follow-through for hypo- and hyperthyroid. Call 718-732-7744 to book now.',
  },
  'cancer-screening': {
    title: 'Cancer Screening, Queens | Rockaway Internal Medicine',
    description:
      'Cancer screening in Jamaica & Cambria Heights, Queens — guideline-based checks for early detection when it matters most. Call 718-732-7744 to book now.',
  },
  neurology: {
    title: 'Neurology in Queens NY | Rockaway Internal Medicine',
    description:
      'Neurology care in Jamaica & Cambria Heights, Queens — headaches, nerve pain and neurological symptoms assessed and managed. Call 718-732-7744 to book.',
  },
  dermatology: {
    title: 'Dermatology in Queens NY | Rockaway Internal Medicine',
    description:
      'Dermatology in Jamaica & Cambria Heights, Queens — rashes, acne and moles evaluated, with referrals when needed. Call 718-732-7744 to book your visit.',
  },
  immunotherapy: {
    title: 'Immunotherapy in Queens NY | Rockaway Internal Medicine',
    description:
      'Immunotherapy in Jamaica & Cambria Heights, Queens — allergy evaluation and treatment plans built around your triggers. Call 718-732-7744 to book now.',
  },
  'physicals-vaccinations': {
    title: 'Physicals & Vaccinations | Rockaway Internal Medicine',
    description:
      'Physicals & vaccinations in Jamaica & Cambria Heights, Queens — head-to-toe exams plus flu, pneumonia and tetanus shots. Call 718-732-7744 to book now.',
  },
  'pain-management': {
    title: 'Pain Management, Queens | Rockaway Internal Medicine',
    description:
      'Pain management in Jamaica & Cambria Heights, Queens — practical plans for joint pain and migraine that keep you moving. Call 718-732-7744 to book now.',
  },
  'pregnancy-testing': {
    title: 'Pregnancy Testing, Queens | Rockaway Internal Medicine',
    description:
      'Confidential pregnancy testing in Jamaica & Cambria Heights, Queens — fast results and supportive next-step guidance. Call 718-732-7744 to book today.',
  },
}

const LOCATION_META: Record<string, { title: string; description: string }> = {
  rockawayinternalmedicine: {
    title: 'Jamaica, Queens NY Office | Rockaway Internal Medicine',
    description:
      'Rockaway Internal Medicine, Jamaica office — 147-12 Rockaway Blvd, Jamaica, NY 11436. Hours, directions and same-week visits. Call 718-732-7744 today.',
  },
  'rockaway-cambria-heights': {
    title: 'Cambria Heights NY Office | Rockaway Internal Medicine',
    description:
      'Rockaway Internal Medicine, Cambria Heights office — 219-15 Linden Blvd, Cambria Heights, NY 11411. Hours, directions and visits. Call 718-509-4899.',
  },
}

const POST_META: Record<string, { title: string; description: string }> = {
  'how-hypertension-treatment-can-protect-your-heart': {
    title: 'Hypertension Treatment: Protect Your Heart & Health',
    description:
      'How hypertension treatment protects your heart: a 5-point systolic drop cuts cardiovascular risk about 10%. Our Queens NY doctors explain what works.',
  },
  'diabetes-causes-symptoms-types-and-treatment': {
    title: 'Diabetes: Causes, Symptoms, Types & Treatment Guide',
    description:
      'Diabetes explained — causes, warning signs, the difference between types, and treatment options that work, from our Queens internal medicine team.',
  },
}

export function allRoutes(): PrerenderRoute[] {
  const b = site.brand
  const routes: PrerenderRoute[] = [
    {
      path: '/',
      title: 'Rockaway Internal Medicine | Primary Care Jamaica NY',
      description:
        'Adult internal medicine & primary care in Jamaica and Cambria Heights, Queens — same-week sick visits, preventive & chronic care. Call 718-732-7744.',
      schema: [businessSchema(), physicianSchema(), faqSchema(homeFaqs, `${SITE_URL}/`)],
    },
    {
      path: '/about',
      title: 'About Rockaway Internal Medicine — Queens NY Doctors',
      description:
        'About Rockaway Internal Medicine — board-certified adult primary care serving Jamaica and Cambria Heights, Queens NY. Call 718-732-7744 to book a visit.',
      schema: [trail({ name: 'About', path: '/about' })],
    },
    {
      path: '/conditions',
      title: 'Conditions We Treat — Adult Primary Care, Queens NY',
      description:
        'Conditions we treat in Queens, NY — hypertension, diabetes, thyroid, cholesterol, arthritis, migraine and more adult care. Call 718-732-7744 to book.',
      schema: [trail({ name: 'Conditions', path: '/conditions' })],
    },
    {
      path: '/services',
      title: 'Adult Internal Medicine Services in Jamaica, Queens',
      description:
        'Internal medicine services in Jamaica & Cambria Heights, Queens — preventive care, chronic disease management and sick visits. Call 718-732-7744 today.',
      schema: [trail({ name: 'Services', path: '/services' })],
    },
    {
      path: '/insurance',
      title: 'Insurance Plans Accepted | Rockaway Internal Medicine',
      description:
        'Insurance accepted at Rockaway Internal Medicine in Queens, NY — most major medical plans welcome at both offices. Call 718-732-7744 to verify coverage.',
      schema: [trail({ name: 'Insurance', path: '/insurance' })],
    },
    {
      path: '/locations',
      title: 'Two Locations in Jamaica & Cambria Heights, Queens',
      description:
        'Two Queens locations — Jamaica (147-12 Rockaway Blvd) and Cambria Heights (219-15 Linden Blvd). Hours, directions and phone. Call 718-732-7744 to book.',
      schema: [trail({ name: 'Locations', path: '/locations' })],
    },
    {
      path: '/blog',
      title: 'Health Blog — Tips from Rockaway Internal Medicine',
      description:
        'Health blog from Rockaway Internal Medicine — practical guides on diabetes, blood pressure, thyroid and everyday adult health from our Queens team.',
      schema: [trail({ name: 'Blog', path: '/blog' })],
    },
    {
      path: '/contact',
      title: 'Contact & Appointments | Rockaway Internal Medicine',
      description:
        'Contact Rockaway Internal Medicine — request an appointment online or call our Jamaica and Cambria Heights, Queens offices at 718-732-7744 to book today.',
      schema: [trail({ name: 'Contact', path: '/contact' })],
    },
  ]

  for (const s of services) {
    const path = `/services/${s.slug}`
    const meta = resolveMeta(path, SERVICE_META[s.slug], { title: `${s.title} | ${b}`, description: s.body })
    routes.push({
      path,
      title: meta.title,
      description: meta.description,
      image: s.img,
      schema: [
        serviceSchema(s),
        faqSchema(s.faqs, `${SITE_URL}/services/${s.slug}`),
        trail({ name: 'Services', path: '/services' }, { name: s.title, path: `/services/${s.slug}` }),
      ],
    })
  }

  for (const p of posts) {
    const path = `/blog/${p.slug}`
    const meta = resolveMeta(path, POST_META[p.slug], { title: `${p.title} | ${b}`, description: p.excerpt })
    routes.push({
      path,
      title: meta.title,
      description: meta.description,
      image: p.img,
      type: 'article',
      schema: [
        articleSchema(p),
        faqSchema(p.faqs, `${SITE_URL}/blog/${p.slug}`),
        trail({ name: 'Blog', path: '/blog' }, { name: p.title, path: `/blog/${p.slug}` }),
      ],
    })
  }

  for (const loc of locations) {
    const path = `/locations/${loc.id}`
    const meta = resolveMeta(path, LOCATION_META[loc.id], {
      title: `${loc.city} Office | ${b}`,
      description: `${site.brand} ${loc.city} office — ${loc.fullAddress}. Call ${loc.phone}.`,
    })
    routes.push({
      path,
      title: meta.title,
      description: meta.description,
      schema: [trail({ name: 'Locations', path: '/locations' }, { name: loc.city, path })],
    })
  }

  return routes
}

// Runtime lookup used by <Seo>: normalizes trailing slashes so "/x" and "/x/"
// resolve to the same route meta.
const ROUTE_INDEX = new Map(allRoutes().map((r) => [r.path, r]))
export function routeMeta(pathname: string): PrerenderRoute | undefined {
  const path = pathname !== '/' && pathname.endsWith('/') ? pathname.replace(/\/+$/, '') : pathname
  return ROUTE_INDEX.get(path)
}
