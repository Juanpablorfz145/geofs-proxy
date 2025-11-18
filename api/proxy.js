export const config = {
  runtime: 'edge'
};

const TARGET = 'https://www.geo-fs.com';

export default async function handler(req) {
  const url = new URL(req.url);
  url.hostname = 'www.geo-fs.com';
  url.protocol = 'https:';

  const response = await fetch(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.arrayBuffer() : undefined,
    redirect: 'manual'
  });

  const newHeaders = new Headers(response.headers);
  const location = newHeaders.get('Location');
  if (location && location.startsWith(TARGET)) {
    newHeaders.set('Location', location.replace(TARGET, `https://${req.headers.get('host')}`));
  }

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders
  });
}
