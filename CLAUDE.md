# Astro migration

## Rules (apply to every step)

1. Don't change any visible text, images, alt text, page titles, meta descriptions, structured data, or files in `src/data/`.
2. Don't change backend-related code: `src/config/api.ts`, `src/utils/turnstile.ts`, the code that submits forms or calls APIs, or the `deploy/` folder. The only exception is Step 6: if a form or API file uses the router to move to another page, change only that navigation line and list it in your summary.
3. Keep every page URL exactly as it is now, including whether it ends with a slash.
4. Keep the existing CSS and design. Don't add Bootstrap or any other package from the reference that this site doesn't need.
5. Never run `npm run gen-meta`. It rewrites the meta descriptions.
6. Don't convert React components into `.astro` files. Components stay React; only the pages and the layout are Astro (see "Page approach").
7. Work one step at a time. At the end of each step: summarize what changed, list every file touched, say how you checked it, then stop and wait for my approval. When I approve, commit with the message `Migration step N: <step title>`.
8. If a step seems to require breaking a rule, or the plan doesn't fit what you find in the code, stop and ask instead of improvising.

## Decisions from Step 0

- Page islands use `client:only="react"`: the body renders in the browser, as it did under Vite.
- No `404.astro`: unknown URLs keep falling through to Amplify's `/<*> -> /index.html (404-200)` rule, which serves Home.
- `sitemap.xml` and `amplify-custom-rules.json` keep being generated after `astro build` by a small post-build script taken from `scripts/prerender.mjs`.
- `.nvmrc` is `22` (Astro 7 needs Node 22.12 or newer).
