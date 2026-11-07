# Deploying

The site is static files in **S3**, served by **CloudFront**, in AWS account
`310971188857`, region `us-east-1`:

| What | ID |
| ---- | -- |
| S3 bucket | `rockawayinternalmedicine-site-310971188857`. Private, read only by CloudFront through Origin Access Control (OAC) |
| CloudFront distribution | `E2EN9X1JYKGDD9` (`d1dooth725uas3.cloudfront.net`), serving `rockawayinternalmedicine.com` and `www.rockawayinternalmedicine.com` |
| CloudFront Function | `rockaway-url-rules` (viewer request). Its code is `infra/cloudfront/url-rules.js` |
| GitHub deploy role | `arn:aws:iam::310971188857:role/rockaway-github-deploy`. Assumed through GitHub OIDC, and trusted only for `refs/heads/main` of `github.com/TodaysDentalTechnologies/RockawayInternalMedicine` |

## 1. Deploy

Every push to `main` deploys. The GitHub Actions workflow
`.github/workflows/deploy.yml` builds the site, uploads `dist/` to the bucket
and invalidates the CloudFront cache. To redeploy without a new commit, run the
**Deploy** workflow from the Actions tab (`workflow_dispatch`). Deploys never
overlap: a second one waits until the first finishes.

The workflow uses no stored AWS keys or secrets. It gets short-lived
credentials by assuming the deploy role through OIDC, and the role trusts
only `main`, so other branches can't deploy.

### The build

`npm run build` is `check-meta` → `astro build` → `postbuild`:

- `scripts/check-meta.mjs` runs **before** the build, so a route whose title or
  description is out of spec fails the build instead of shipping.
- `astro build` writes one static `.html` per route, with that page's title,
  meta description, canonical, OG/Twitter tags and JSON-LD in the `<head>`.
  Pages are flat files (`dist/about.html`, `dist/services/cardiology.html`),
  not `about/index.html`. Hashed JS is in `dist/_astro/`.
- `scripts/postbuild.mjs` writes `dist/sitemap.xml` from the same route
  manifest (`allRoutes()` in `src/data/seo.ts`).

### Upload and caching

The workflow runs three `aws s3 sync --delete` passes, each limited to its own
files, so `--delete` in one pass never removes another pass's files:

| Pass | Files | `Cache-Control` |
| ---- | ----- | --------------- |
| 1 | `dist/_astro/` → `s3://…/_astro/` | `public,max-age=31536000,immutable` |
| 2 | everything else except `*.html` | `public,max-age=3600` |
| 3 | `*.html` only, with `Content-Type: text/html; charset=utf-8` | `no-cache` |

Hashed assets go first, so a new page never points at a file that isn't
uploaded yet. Then the workflow invalidates `/*`.

### Deploying by hand

Use this only if GitHub Actions is down. The deploy role can't be assumed
outside GitHub Actions, so use your own credentials for account `310971188857`
(the `shivashamtoub` profile below). Deploy from a clean, up-to-date `main`:

```bash
git switch main && git pull
npm ci
npm run build

export AWS_PROFILE=shivashamtoub AWS_REGION=us-east-1
BUCKET=rockawayinternalmedicine-site-310971188857

aws s3 sync dist/_astro "s3://$BUCKET/_astro" --delete \
  --cache-control "public,max-age=31536000,immutable"
aws s3 sync dist "s3://$BUCKET" --delete \
  --exclude "_astro/*" --exclude "*.html" --exclude "amplify-custom-rules.json" \
  --cache-control "public,max-age=3600"
aws s3 sync dist "s3://$BUCKET" --delete \
  --exclude "*" --include "*.html" \
  --cache-control "no-cache" --content-type "text/html; charset=utf-8"
aws cloudfront create-invalidation --distribution-id E2EN9X1JYKGDD9 --paths "/*"
```

These are the same commands the workflow runs. If you change one, change the
other.

## 2. URL rules

Canonical URLs are the bare domain with no trailing slash
(`https://rockawayinternalmedicine.com/services/cardiology`). The CloudFront
Function `rockaway-url-rules` enforces this on every request:

| Request | Result |
| ------- | ------ |
| any path on `www.rockawayinternalmedicine.com` | 301 to the same path on the bare domain, with any trailing slash removed |
| `/services/cardiology/` (trailing slash) | 301 to `/services/cardiology` |
| `/` | serves `/index.html` |
| `/services/cardiology` (no dot in the last segment) | serves `/services/cardiology.html` |
| `/favicon.svg`, `/_astro/…` (dot in the last segment) | served as is |

Redirects keep the query string. A path with no matching file in the bucket
makes S3 return 403 (the bucket is private) or 404, and the distribution's
custom error responses for both serve `/index.html` with status 200, so
unknown URLs show the home page.

Because of the `/x` → `/x.html` rule, pages **must** stay flat `.html` files.
Don't change `build.format: 'file'` in `astro.config.mjs` to directory output.

### Changing the rules

`infra/cloudfront/url-rules.js` is the source for the function. Edit it,
commit it, then update, test and publish the function. A push to `main`
doesn't publish it; this is a separate, manual step.

```bash
export AWS_PROFILE=shivashamtoub AWS_REGION=us-east-1
FN=rockaway-url-rules

# 1. Upload the new code to the DEVELOPMENT stage, keeping the runtime and comment.
ETAG=$(aws cloudfront describe-function --name $FN --query ETag --output text)
CONFIG=$(aws cloudfront describe-function --name $FN \
  --query FunctionSummary.FunctionConfig --output json)
aws cloudfront update-function --name $FN --if-match "$ETAG" \
  --function-config "$CONFIG" \
  --function-code fileb://infra/cloudfront/url-rules.js

# 2. Test the DEVELOPMENT stage. Change the uri and host to try other cases.
cat > /tmp/event.json <<'EOF'
{"version":"1.0","context":{"eventType":"viewer-request"},"viewer":{"ip":"203.0.113.1"},
 "request":{"method":"GET","uri":"/services/cardiology/","querystring":{},
 "headers":{"host":{"value":"rockawayinternalmedicine.com"}},"cookies":{}}}
EOF
ETAG=$(aws cloudfront describe-function --name $FN --query ETag --output text)
aws cloudfront test-function --name $FN --if-match "$ETAG" --stage DEVELOPMENT \
  --event-object fileb:///tmp/event.json --query TestResult

# 3. Publish DEVELOPMENT to LIVE. The distribution uses LIVE.
aws cloudfront publish-function --name $FN --if-match "$ETAG"
```

Publishing takes a few minutes to reach every edge location. Then run the
checks in section 3.

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
