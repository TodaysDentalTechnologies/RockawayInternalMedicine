import type { Faq } from './services'

// Home-page FAQ. These are rendered as a visible accordion on the home page AND
// emitted as FAQPage structured data — Google requires the marked-up Q&A to be
// visible on the same page, so keep the two in sync.
export const homeFaqs: Faq[] = [
  {
    q: 'Are you accepting new patients?',
    a: 'Yes — we welcome new adult patients at both our Jamaica and Cambria Heights offices. You can request an appointment online or call either office directly.',
  },
  {
    q: 'Which insurance plans do you accept?',
    a: 'We accept most major insurance plans. Visit our Insurance page or call us and we’ll confirm that your specific plan is covered before your visit.',
  },
  {
    q: 'Do you offer same-week appointments?',
    a: 'Often, yes. We hold room in the schedule for sick visits and time-sensitive concerns — call the office and we’ll do our best to see you quickly.',
  },
  {
    q: 'Where are your offices located?',
    a: 'We have two Queens locations: 147-12 Rockaway Blvd, Jamaica, NY 11436, and 219-15 Linden Blvd, Cambria Heights, NY 11411.',
  },
  {
    q: 'What should I bring to my first visit?',
    a: 'Please bring a photo ID, your insurance card, a list of your current medications, and any recent test results or referrals.',
  },
]
