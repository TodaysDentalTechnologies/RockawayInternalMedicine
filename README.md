# Rockaway Internal Medicine

Marketing website for **Rockaway Internal Medicine** — adult internal medicine &
primary care in Jamaica, Queens, NY.

Built with **Astro + React + TypeScript**, the same structure as the clinic
websites. Olive-green design system, motion-rich sections, and interactive
elements (open/closed status, service finder, insurance checker, appointment
form).

## Getting started

Requires Node 22.12 or newer (see `.nvmrc`).

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:4321)
npm run build   # check meta, build every page into dist/, write sitemap + Amplify rules
npm run preview # preview the production build locally
npx astro check # type-check .astro and .tsx files
```

## How pages are built

Astro builds one static HTML file per URL, flat rather than in folders
(`dist/about.html`, `dist/services/cardiology.html`), because Amplify redirects
`/about` to `/about/` when a folder index exists (see `deploy/DEPLOY.md`).

- `src/pages/*.astro` — one file per URL. Detail pages (`services/[slug]`,
  `blog/[slug]`, `locations/[slug]`) list their URLs in `getStaticPaths` from
  the same data the page components use.
- `src/layouts/Layout.astro` — the `<head>` of every page: title, meta
  description, canonical, Open Graph, Twitter and JSON-LD, filled from the
  route manifest in `src/data/seo.ts`, plus icons, fonts, gtag and the global CSS.
- `src/components/PageRoot.tsx` — the one React island on each page
  (`client:only="react"`): `Layout.tsx` (header, footer, chat widget,
  back-to-top) around the page component.

Every URL is a full page load, so navigation uses plain links and
`window.location`. There is no client-side router.

After `astro build`, `scripts/postbuild.mjs` writes `dist/sitemap.xml` and
`dist/amplify-custom-rules.json` from the same route manifest. Before the build,
`scripts/check-meta.mjs` fails it if any title or description is out of spec.

## Project structure

```
src/
  pages/                 One .astro file per URL
  layouts/Layout.astro   <head> for every page
  data/clinic.ts         Clinic details, hours (single source of truth)
  data/seo.ts            Route manifest: titles, descriptions, structured data
  hooks/                 useReveal (scroll animations), useClinicStatus (open/closed)
  components/
    PageRoot.tsx         The React island: Layout + the page component
    Layout.tsx           Header, footer and floating widgets around each page
    pages/               Page components (Home, AboutPage, ServiceDetailPage, …)
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
- **Page titles and meta descriptions** — `src/data/seo.ts`; run
  `npm run check-meta` after editing. See `deploy/DEPLOY.md` for `gen-meta`.
- **Photos** — components use an `ImageSlot` placeholder. Pass a real `src`
  (and `alt`) to swap in photos in `Hero.tsx` / `About.tsx`.
- **Colors** — the olive palette is defined as CSS variables in `:root` in
  `src/index.css`.
