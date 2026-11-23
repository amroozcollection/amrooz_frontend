const SITE = 'https://amroozcollection.com';

// Served at /robots.txt. A route handler (not app/robots.js) so the
// Content-Signal line can be declared alongside the normal rules.
export function GET() {
  const body = [
    'User-agent: *',
    'Content-Signal: search=yes, ai-input=yes, ai-train=no',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /account',
    'Disallow: /cart',
    'Disallow: /checkout',
    'Disallow: /track',
    '',
    `Sitemap: ${SITE}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
