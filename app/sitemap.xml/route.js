const SITE = 'https://amroozcollection.com';
const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.amroozcollection.com/api';

// Public, indexable pages. Cart, checkout, account and admin are excluded on purpose.
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/products', priority: '0.9', changefreq: 'daily' },
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/faq', priority: '0.5', changefreq: 'monthly' },
  { path: '/returns', priority: '0.5', changefreq: 'monthly' },
  { path: '/shipping', priority: '0.5', changefreq: 'monthly' },
  { path: '/size-guide', priority: '0.5', changefreq: 'monthly' },
  { path: '/stores', priority: '0.4', changefreq: 'monthly' },
  { path: '/sustainability', priority: '0.3', changefreq: 'yearly' },
  { path: '/careers', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.2', changefreq: 'yearly' },
  { path: '/terms', priority: '0.2', changefreq: 'yearly' },
];

const escapeXml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function loadProducts() {
  try {
    const res = await fetch(`${API}/products`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.data ?? [];
  } catch {
    return [];
  }
}

export const revalidate = 3600;

export async function GET() {
  const products = await loadProducts();
  const entries = [
    ...STATIC_PAGES.map((p) => ({ loc: `${SITE}${p.path === '/' ? '' : p.path}` || SITE, ...p })),
    ...products
      .filter((p) => p?.id != null && p.isActive !== false)
      .map((p) => ({
        loc: `${SITE}/products/${p.id}`,
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
        priority: '0.8',
        changefreq: 'weekly',
      })),
  ];

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map(
        (e) =>
          `  <url>\n    <loc>${escapeXml(e.loc || SITE)}</loc>\n` +
          (e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : '') +
          `    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
      )
      .join('\n') +
    '\n</urlset>\n';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
