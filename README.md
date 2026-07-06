# Rockaway Internal Medicine

Marketing website for **Rockaway Internal Medicine** — adult internal medicine &
primary care in Jamaica, Queens, NY.

Built with **Vite + React + TypeScript**. Olive-green design system, motion-rich
sections, and interactive elements (open/closed status, service finder,
insurance checker, appointment form).

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:5173)
npm run build   # type-check + production build into dist/
npm run preview # preview the production build locally
```

## Project structure

```
src/
  data/clinic.ts         Clinic details, hours (single source of truth)
  hooks/                 useReveal (scroll animations), useClinicStatus (open/closed)
  components/
    Header.tsx           Sticky nav + mobile menu
    Hero.tsx             Headline, CTAs, floating blobs
    About.tsx            Practice philosophy
    Conditions.tsx       Expandable condition cards
    Services.tsx         Service grid + interactive "service finder"
    Insurance.tsx        Tap-to-mark insurance plan chips
    Contact.tsx          Appointment form (confetti on submit) + map
    Footer.tsx           NAP info, links, hours
    BackToTop.tsx        Floating back-to-top button
    ChatWidget.tsx       Floating quick-contact widget
    icons.tsx            Inline SVG icon set
```

## Editing content

- **Clinic name, address, phone, hours** — all live in `src/data/clinic.ts`.
- **Photos** — components use an `ImageSlot` placeholder. Pass a real `src`
  (and `alt`) to swap in photos in `Hero.tsx` / `About.tsx`.
- **Colors** — the olive palette is defined as CSS variables in `:root` in
  `src/index.css`.
