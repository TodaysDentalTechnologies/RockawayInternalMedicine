function qs(q) {
  var p = [];
  for (var k in q) {
    var e = q[k];
    if (e.multiValue) { e.multiValue.forEach(function (m) { p.push(k + '=' + m.value); }); }
    else { p.push(k + '=' + e.value); }
  }
  return p.length ? '?' + p.join('&') : '';
}
function redirect(loc) {
  return { statusCode: 301, statusDescription: 'Moved Permanently',
           headers: { location: { value: loc } } };
}
function handler(event) {
  var req = event.request;
  var host = req.headers.host ? req.headers.host.value : '';
  var uri = req.uri;
  var slash = uri.length > 1 && uri.charAt(uri.length - 1) === '/';
  var clean = slash ? uri.slice(0, -1) : uri;

  if (host === 'www.rockawayinternalmedicine.com') {
    return redirect('https://rockawayinternalmedicine.com' + clean + qs(req.querystring));
  }
  if (slash) {
    return redirect('https://rockawayinternalmedicine.com' + clean + qs(req.querystring));
  }
  if (uri === '/') {
    req.uri = '/index.html';
  } else if (uri.substring(uri.lastIndexOf('/') + 1).indexOf('.') === -1) {
    req.uri = uri + '.html';
  }
  return req;
}
