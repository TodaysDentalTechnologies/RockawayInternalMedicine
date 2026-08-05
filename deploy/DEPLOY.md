# Deploying

The site is hosted on **AWS Amplify Hosting**, app `djn8uddcmh0dt`
(`RockawayInternalMedicine`) in AWS account `310971188857` — the
`shivashamtoub` environment. Amplify builds from the `main` branch of
`github.com/TodaysDentalTechnologies/RockawayInternalMedicine`.

## 1. Deploy

Auto-build is off, so a push does not deploy on its own. Push, then start a job:

```bash
git push origin main
aws amplify start-job --app-id djn8uddcmh0dt --branch-name main \
  --job-type RELEASE --profile shivashamtoub --region us-east-1
```

The Amplify build runs `npm run build`, which is `tsc` → `check-meta` →
`vite build` → `prerender`. `check-meta` runs **before** the bundle so a route
whose title or description is out of spec fails the build instead of shipping.

`scripts/prerender.mjs` writes one static `.html` per route with that page's
title, meta description, canonical, OG/Twitter tags and JSON-LD baked in, plus
`dist/sitemap.xml`.

## 2. Canonical URLs

The build writes `dist/amplify-custom-rules.json` from the same route manifest
as the sitemap, in this order — Amplify takes the first match:

| Source | Target | Type |
| ------ | ------ | ---- |
| `https://www.rockawayinternalmedicine.com/<*>` | `https://rockawayinternalmedicine.com/<*>` | 301 |
| `/about/`, `/services/cardiology/`, … (one per route) | the same path without the slash | 301 |
| `/<*>` | `/index.html` | 404 (rewrite) |

Apply it:

```bash
aws amplify update-app --app-id djn8uddcmh0dt \
  --custom-rules file://dist/amplify-custom-rules.json \
  --profile shivashamtoub --region us-east-1
```

Three Amplify rule-engine constraints shape this, all verified against the
live app — do not "simplify" past them:

- **There is no trailing-slash catch-all.** `/<*>/` is rejected outright:
  *"The wildcard pattern in custom rules expression is invalid when followed by
  a `/`"*. Hence one 301 per route, generated rather than hand-maintained.
- **Routes are flat `.html` files, not `<route>/index.html`.** A folder
  artifact is served only at `/about/` — Amplify 301s `/about` → `/about/` and
  no rule can override it. With `about.html` on disk, `/about` serves at 200
  with no redirect. Do not change `scripts/prerender.mjs` back to directory
  output.
- **Apply the rules only after the matching build is live.** Against folder
  artifacts, Amplify's implicit `/x` → `/x/` plus these `/x/` → `/x` rules is
  an infinite redirect loop.

Custom rules also do not fire for a path that resolves to an existing
artifact, which is why the SPA fallback never shadows a prerendered page.

## 3. Verify

```bash
curl -sI https://www.rockawayinternalmedicine.com/                      # 301 -> bare domain
curl -sI https://www.rockawayinternalmedicine.com/services/cardiology/  # 301 -> bare, no slash
curl -sI https://rockawayinternalmedicine.com/services/cardiology/      # 301 -> /services/cardiology
curl -sI https://rockawayinternalmedicine.com/services/cardiology       # 200, no redirect
curl -sI https://rockawayinternalmedicine.com/nonsense-page             # 200 (app shell)
curl -s  https://rockawayinternalmedicine.com/services/cardiology | grep -c 'name="description"'  # 1
curl -s  https://rockawayinternalmedicine.com/services/cardiology | grep -c 'ld+json'             # 3
```

Then in Search Console: submit `sitemap.xml` and Request Indexing on any URLs
previously reported with errors.

## 4. Meta titles and descriptions

Titles are 50–55 chars, descriptions 145–155, enforced by
`scripts/check-meta.mjs`. Hand-written copy lives in the `SERVICE_META` /
`LOCATION_META` / `POST_META` maps in `src/data/seo.ts`. Anything not in those
maps falls back to `src/data/generated-meta.ts`, which
`node scripts/gen-meta.mjs` writes by generating compliant meta with Claude for
every route currently out of spec:

```bash
node scripts/gen-meta.mjs        # rewrites generated-meta.ts for failing routes
node scripts/check-meta.mjs      # confirm everything passes
```

Review the generated copy before committing — it is a first draft, not a
rubber stamp.
