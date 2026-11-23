import HomeClient from './HomeClient';
import JsonLd from '@/components/seo/JsonLd';
import { getCatalog, offerFor, productImages, SITE_URL } from '@/lib/catalog';

// Render per request (data itself is cached for 5 minutes) so a slow API during
// `next build` can never bake an empty price list into the page.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getCatalog();
  const featured = products.slice(0, 8);

  // Prices are marked up server-side so they are readable without JavaScript.
  // Top-level Product nodes (each with an Offer: price + currency) so prices are
  // readable without JavaScript, plus an ItemList that ties them together.
  const productNodes = featured.map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/products/${p.id}#product`,
    name: p.name,
    url: `${SITE_URL}/products/${p.id}`,
    sku: p.sku || undefined,
    image: productImages(p),
    brand: { '@type': 'Brand', name: p.brand || 'Amrooz Collection' },
    offers: offerFor(p),
  }));
  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Featured pieces',
    url: `${SITE_URL}/pricing`,
    itemListElement: featured.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/products/${p.id}`,
    })),
  };

  return (
    <>
      {featured.length > 0 && <JsonLd data={[...productNodes, listSchema]} />}
      <HomeClient initialProducts={products} />
    </>
  );
}
