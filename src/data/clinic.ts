// ─────────────────────────────────────────────────────────────
// Site + locations
//
// This is ONE umbrella brand (`site`) with MULTIPLE physical locations.
// Every location is self-contained (address, phone, hours, timezone).
// The header "Locations" dropdown, the Contact page and the footer all
// render from `locations`.
//
// Backward-compatibility: `clinic` and `hours` still export the PRIMARY
// location (see `site.primaryLocationId`), so existing components that
// import { clinic } / { clinic, hours } keep working unchanged.
// ─────────────────────────────────────────────────────────────

export type OpenHours = { open: number; close: number } | null

export interface Location {
  id: string
  name: string
  shortName: string
  tagline: string
  address: string
  city: string
  state: string
  stateAbbr: string
  zip: string
  fullAddress: string
  phone: string
  phoneHref: string
  timezone: string
  // Coordinates for the GeoCoordinates schema (and future map features).
  lat: number
  lng: number
  // Weekly hours in this location's timezone. index 0 = Sun … 6 = Sat.
  // null = closed that day.
  hours: OpenHours[]
  hoursDisplay: { label: string; value: string }[]
}

// Standard weekday hours, reused by both offices. Give a location its own
// array below if its hours differ.
const STANDARD_HOURS: OpenHours[] = [
  null, // Sun
  { open: 9, close: 17 }, // Mon
  { open: 9, close: 17 }, // Tue
  { open: 9, close: 17 }, // Wed
  { open: 9, close: 17 }, // Thu
  { open: 9, close: 17 }, // Fri
  { open: 9, close: 13 }, // Sat
]

const STANDARD_HOURS_DISPLAY = [
  { label: 'Monday – Friday', value: '9:00 AM – 5:00 PM' },
  { label: 'Saturday', value: '9:00 AM – 1:00 PM' },
  { label: 'Sunday', value: 'Closed' },
]

export const locations: Location[] = [
  {
    id: 'rockawayinternalmedicine',
    name: 'Rockaway Internal Medicine',
    shortName: 'Rockaway',
    tagline: 'Internal Medicine',
    address: '147-12 Rockaway Blvd',
    city: 'Jamaica',
    state: 'New York',
    stateAbbr: 'NY',
    zip: '11436',
    fullAddress: '147-12 Rockaway Blvd, Jamaica, NY 11436',
    phone: '718-732-7744',
    phoneHref: 'tel:+17187327744',
    timezone: 'America/New_York',
    lat: 40.6731159,
    lng: -73.7903648,
    hours: STANDARD_HOURS,
    hoursDisplay: STANDARD_HOURS_DISPLAY,
  },
  {
    id: 'rockaway-cambria-heights',
    name: 'Rockaway Internal Medicine',
    shortName: 'Rockaway',
    tagline: 'Internal Medicine',
    address: '219-15 Linden Blvd',
    city: 'Cambria Heights',
    state: 'New York',
    stateAbbr: 'NY',
    zip: '11411',
    fullAddress: '219-15 Linden Blvd, Cambria Heights, NY 11411',
    phone: '718-509-4899',
    phoneHref: 'tel:+17185094899',
    timezone: 'America/New_York',
    lat: 40.6954713,
    lng: -73.7403113,
    // NOTE: assumed same hours as the Jamaica office — confirm the Cambria
    // Heights office's real hours and adjust here if they differ.
    hours: STANDARD_HOURS,
    hoursDisplay: STANDARD_HOURS_DISPLAY,
  },
]

// ── Umbrella brand shown in the header/footer logo ──────────────
// CHANGE ME: the parent brand name that sits above both offices.
export const site = {
  brand: 'Rockaway Internal Medicine',
  shortName: 'Rockaway',
  tagline: 'Internal Medicine',
  logoLetter: 'R',
  primaryLocationId: 'rockawayinternalmedicine',
} as const

// ── Physician (drives the sitewide Physician schema) ────────────
// Verified against the NPI registry (npiregistry.cms.hhs.gov, NPI 1366586646).
export const doctor = {
  name: 'Dr. Shiva Shamtoub',
  credential: 'DO',
  npi: '1366586646',
  boardCertification: 'Board Certified in Internal Medicine',
  education: 'New York Institute of Technology College of Osteopathic Medicine',
  residency: 'Staten Island University Hospital',
  languages: ['English', 'Persian'],
  image: '/images/dr-shamtoub.webp',
  sameAs: [
    'https://www.zocdoc.com/doctor/shiva-shamtoub-do-62123',
    'https://health.usnews.com/doctors/shiva-shamtoub-771520',
    'https://www.doximity.com/pub/shiva-shamtoub-do',
    'https://npiregistry.cms.hhs.gov/provider-view/1366586646',
  ],
} as const

// Aggregate patient rating used in structured data. Source: Dr. Shamtoub's
// Zocdoc profile (4.31 stars, 791 reviews as of July 2026). UPDATE these two
// numbers periodically so the markup keeps matching the live rating — and
// mirror any change in the static JSON-LD block in index.html.
export const rating = {
  value: 4.31,
  count: 791,
} as const

export function getLocation(id: string | undefined): Location | undefined {
  return locations.find((l) => l.id === id)
}

// The location that stands in for the shared/site-wide content (homepage
// copy, chat widget, header phone pill, etc.).
export const primaryLocation: Location =
  getLocation(site.primaryLocationId) ?? locations[0]

// Google Maps helpers.
export const mapsSearchUrl = (loc: Location): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.fullAddress)}`
export const mapsEmbedUrl = (loc: Location): string =>
  `https://maps.google.com/maps?q=${encodeURIComponent(loc.fullAddress)}&z=16&output=embed`

// ── Backward-compatible singletons (primary location) ───────────
// Existing components import { clinic } / { clinic, hours } from here.
export const clinic = primaryLocation
export const hours = primaryLocation.hours
export const hoursDisplay = primaryLocation.hoursDisplay
