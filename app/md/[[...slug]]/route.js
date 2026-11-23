import { getCatalog, getCatalogProduct, formatRs, productImages, SITE_URL } from '@/lib/catalog';
import { htmlToPlainText } from '@/lib/richText';

// Markdown versions of key pages. Reached directly at /md/... and, via a
// rewrite in next.config.js, for ordinary page URLs requested with
// "Accept: text/markdown".

const STATIC = {
  contact: `# Contact Amrooz Collection

- Phone / WhatsApp: 0315 4047963
- Customer support: support@amroozcollection.com
- Business inquiries: info@amroozcollection.com
- Hours: Monday–Saturday, 9:00 AM–6:00 PM PKT (Sunday closed)

Page: ${SITE_URL}/contact
`,
};

const md = (body, status = 200) =>
  new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      Vary: 'Accept',
      Link: `<${SITE_URL}/llms.txt>; rel="describedby"; type="text/plain"`,
    },
  });

const productLine = (p) => `- [${p.name}](${SITE_URL}/products/${p.id}) — ${formatRs(p.price)}${p.compareAtPrice ? ` (was ${formatRs(p.compareAtPrice)})` : ''}`;

export async function GET(_req, { params }) {
  const { slug = [] } = await params;
  const [section, id] = slug;

  if (!section) {
    const products = await getCatalog();
    return md(
      [
        '# Amrooz Collection',
        '',
        'Pakistani online clothing brand: premium women’s clothing, dresses, unstitched suits and ethnic wear. Delivery across Pakistan. Prices in PKR.',
        '',
        '## Featured products',
        '',
        ...products.slice(0, 8).map(productLine),
        '',
        `[All products](${SITE_URL}/products) · [Contact](${SITE_URL}/contact) · [FAQ](${SITE_URL}/faq) · [Returns](${SITE_URL}/returns)`,
        '',
      ].join('\n'),
    );
  }

  if (section === 'products' && !id) {
    const products = await getCatalog();
    return md(['# All products', '', ...products.map(productLine), ''].join('\n'));
  }

  if (section === 'products' && id) {
    const p = await getCatalogProduct(id);
    if (!p) return md('# Not found\n', 404);
    const description = htmlToPlainText(p.description) || htmlToPlainText(p.shortDescription) || '';
    return md(
      [
        `# ${p.name}`,
        '',
        `- Price: ${formatRs(p.price)}${p.compareAtPrice ? ` (was ${formatRs(p.compareAtPrice)})` : ''}`,
        `- Availability: ${p.stock > 0 ? 'In stock' : 'Out of stock'}`,
        p.sku ? `- SKU: ${p.sku}` : null,
        p.brand ? `- Brand: ${p.brand}` : null,
        p.categoryName ? `- Category: ${p.categoryName}` : null,
        p.sizes?.length ? `- Sizes: ${p.sizes.join(', ')}` : null,
        p.colors?.length ? `- Colours: ${p.colors.join(', ')}` : null,
        '',
        description,
        '',
        ...productImages(p).slice(0, 4).map((u, i) => `![${p.name} ${i + 1}](${u})`),
        '',
        `Page: ${SITE_URL}/products/${p.id}`,
        '',
      ]
        .filter((l) => l !== null)
        .join('\n'),
    );
  }

  if (STATIC[section] && !id) return md(STATIC[section]);

  return md('# Not found\n', 404);
}
