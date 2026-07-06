export const clinic = {
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
} as const

// Weekly hours in the clinic timezone. day index: 0 = Sunday ... 6 = Saturday
// null means closed that day.
export const hours: Array<{ open: number; close: number } | null> = [
  null, // Sun
  { open: 9, close: 17 }, // Mon
  { open: 9, close: 17 }, // Tue
  { open: 9, close: 17 }, // Wed
  { open: 9, close: 17 }, // Thu
  { open: 9, close: 17 }, // Fri
  { open: 9, close: 13 }, // Sat
]

export const hoursDisplay = [
  { label: 'Monday – Friday', value: '9:00 AM – 5:00 PM' },
  { label: 'Saturday', value: '9:00 AM – 1:00 PM' },
  { label: 'Sunday', value: 'Closed' },
]
