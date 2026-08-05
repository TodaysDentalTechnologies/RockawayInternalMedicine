// CloudFront Function — viewer request. Runtime: cloudfront-js-2.0
//
// S3 cannot rewrite or redirect, so the URL rules that would normally live in
// .htaccess run here instead, at the edge, before the cache is consulted.
//
// Handles:
//   1. 301s from www.rockawayinternalmedicine.com to rockawayinternalmedicine.com
//      (non-www is canonical — matches the site's <link rel="canonical"> tags)
//   2. Trailing-slash stripping, so each page has one canonical URL
//
// Both rules resolve in a single hop: a request for
// https://www.rockawayinternalmedicine.com/services/cardiology/ 301s directly to
// https://rockawayinternalmedicine.com/services/cardiology.
//
// The SPA fallback is NOT here — that is a CloudFront custom error response.
// See deploy/DEPLOY.md.

var CANONICAL_HOST = 'rockawayinternalmedicine.com';

function queryString(request) {
  var qs = request.querystring;
  var parts = [];
  for (var key in qs) {
    if (qs[key].multiValue) {
      for (var i = 0; i < qs[key].multiValue.length; i++) {
        parts.push(key + '=' + qs[key].multiValue[i].value);
      }
    } else if (qs[key].value === '') {
      parts.push(key);
    } else {
      parts.push(key + '=' + qs[key].value);
    }
  }
  return parts.length ? '?' + parts.join('&') : '';
}

function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;
  var uri = request.uri;
  var target = uri;

  // Strip trailing slashes, but never turn "/" into "".
  if (target.length > 1) {
    while (target.length > 1 && target.charAt(target.length - 1) === '/') {
      target = target.substring(0, target.length - 1);
    }
  }

  // Wrong host → absolute redirect to the canonical host (also applies the
  // slash-stripped path, so both fixes land in one 301 — no redirect chains).
  if (host !== CANONICAL_HOST) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: 'https://' + CANONICAL_HOST + target + queryString(request) },
      },
    };
  }

  // Right host, wrong path form → relative redirect.
  if (target !== uri) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: target + queryString(request) },
      },
    };
  }

  // Each route is prerendered to <route>/index.html. The visitor-facing URL
  // stays /services/cardiology, so map it to the object key internally. Anything
  // with a file extension (/assets/*.js, /images/*.webp, /robots.txt) is a real
  // object and passes through untouched.
  var lastSegment = target.substring(target.lastIndexOf('/') + 1);
  if (lastSegment.indexOf('.') === -1) {
    request.uri = target === '/' ? '/index.html' : target + '/index.html';
  }

  return request;
}
