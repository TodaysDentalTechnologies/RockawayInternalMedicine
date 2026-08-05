# Deploying to S3 + CloudFront

The site is a static build served from an S3 bucket behind CloudFront (aliases
`rockawayinternalmedicine.com` and `www.rockawayinternalmedicine.com`). S3 has
no rewrite engine, so URL rules that would normally live in `.htaccess` are
split between a CloudFront Function and CloudFront's error-response config.

Replace `BUCKET` and `DIST_ID` below with your bucket name and distribution ID.

## 1. Build

```bash
npm run build
```

This runs Vite and then `scripts/prerender.mjs`, which writes one `index.html`
per route with that page's title, meta description, canonical, OG/Twitter tags
and JSON-LD baked in, plus a generated `dist/sitemap.xml`.

## 2. Upload with correct cache headers

Because every route is prerendered, **every** `.html` file must stay uncached —
not just the root one.

```bash
# Content-hashed bundles — safe to cache forever.
aws s3 sync dist/ s3://BUCKET/ --delete \
  --exclude "*.html" --exclude "*.txt" --exclude "*.xml" \
  --exclude "images/*" \
  --cache-control "public, max-age=31536000, immutable"

# Images keep stable names, so cache for a month rather than a year.
aws s3 sync dist/images/ s3://BUCKET/images/ --delete \
  --cache-control "public, max-age=2592000"

# Every prerendered page — never cached at the edge.
aws s3 sync dist/ s3://BUCKET/ \
  --exclude "*" --include "*.html" \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html; charset=utf-8"

# robots.txt / sitemap.xml / llms.txt — short TTL so SEO edits land quickly.
aws s3 cp dist/robots.txt s3://BUCKET/robots.txt --cache-control "public, max-age=3600"
aws s3 cp dist/sitemap.xml s3://BUCKET/sitemap.xml --cache-control "public, max-age=3600"
aws s3 cp dist/llms.txt s3://BUCKET/llms.txt --cache-control "public, max-age=3600"
```

## 3. Invalidate the edge cache

```bash
aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"
```

Run this on every deploy.

## 4. Fallback for unknown URLs (one-time)

CloudFront → your distribution → **Error pages** → create two entries:

| HTTP error code | Customize response | Response page path | HTTP response code |
| --------------- | ------------------ | ------------------ | ------------------ |
| 403 Forbidden   | Yes                | `/index.html`      | 200                |
| 404 Not Found   | Yes                | `/index.html`      | 200                |

## 5. Canonical-URL redirects (one-time)

`deploy/cloudfront-function.js` 301s `www.` to the bare domain, strips trailing
slashes, and maps clean URLs to their prerendered `index.html` objects.

1. CloudFront → **Functions** → Create function, runtime `cloudfront-js-2.0`
2. Paste the contents of `deploy/cloudfront-function.js`
3. Use the **Test** tab before publishing:
   - Host `www.rockawayinternalmedicine.com`, URI `/services/cardiology/` →
     301 to `https://rockawayinternalmedicine.com/services/cardiology`
   - Host `rockawayinternalmedicine.com`, URI `/services/cardiology/` →
     301 to `/services/cardiology`
   - Host `rockawayinternalmedicine.com`, URI `/services/cardiology` →
     pass-through, URI rewritten to `/services/cardiology/index.html`
4. Save → **Publish**
5. Distribution → Behaviors → default behavior → **Function associations** →
   Viewer request → select the function
6. Confirm both aliases (bare + www) are on this same distribution.

## 6. Compression (one-time)

Distribution → Behaviors → default behavior → **Compress objects
automatically: Yes** (gzip/brotli).

## 7. Verify

```bash
curl -sI https://www.rockawayinternalmedicine.com/                      # 301 -> bare domain
curl -sI https://www.rockawayinternalmedicine.com/services/cardiology/  # 301 -> bare, no slash (one hop)
curl -sI https://rockawayinternalmedicine.com/services/cardiology/      # 301 -> /services/cardiology
curl -sI https://rockawayinternalmedicine.com/services/cardiology       # 200
curl -sI https://rockawayinternalmedicine.com/nonsense-page             # 200 (app shell)
curl -s  https://rockawayinternalmedicine.com/ | grep -c 'name="description"'   # 1
curl -s  https://rockawayinternalmedicine.com/services/cardiology | grep -c ld+json  # 3
```

Then in Search Console: submit `sitemap.xml`, and Request Indexing on any URLs
previously reported with errors.
