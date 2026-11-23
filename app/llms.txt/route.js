import { getCatalog, formatRs, SITE_URL } from '@/lib/catalog';

export const dynamic = 'force-dynamic'; // product list is cached 5 min inside getCatalog()

// Served at /llms.txt — a short, Markdown summary of the site for AI agents.
export async function GET() {
  const products = await getCatalog();

  const lines = [
    '# Amrooz Collection',
    '',
    '> Pakistani online clothing brand selling premium women’s clothing: stylish dresses, unstitched suits, ready-to-wear outfits and elegant ethnic wear. Delivery within Pakistan; payment by card, mobile wallet or cash on delivery. Prices are in Pakistani rupees (PKR).',
    '',
    '## Shop',
    '',
    `- [Pricing](${SITE_URL}/pricing): every product with its current price in PKR`,
    `- [All products](${SITE_URL}/products): the full catalogue`,
    ...products
      .slice(0, 20)
      .map((p) => `- [${p.name}](${SITE_URL}/products/${p.id}): ${formatRs(p.price)}`),
    '',
    '## Help',
    '',
    `- [Contact](${SITE_URL}/contact): phone 0315 4047963, support@amroozcollection.com, Mon–Sat 9:00 AM–6:00 PM PKT`,
    `- [FAQ](${SITE_URL}/faq): shipping, returns, payments and order tracking`,
    `- [Shipping](${SITE_URL}/shipping): delivery times and costs`,
    `- [Returns](${SITE_URL}/returns): return and exchange policy`,
    `- [Size guide](${SITE_URL}/size-guide)`,
    `- [Track an order](${SITE_URL}/track)`,
    '',
    '## About',
    '',
    `- [Our story](${SITE_URL}/about)`,
    `- [Sustainability](${SITE_URL}/sustainability)`,
    '',
    '## Optional',
    '',
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    `- [Markdown version of the home page](${SITE_URL}/md): also served for any page when requested with "Accept: text/markdown"`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
