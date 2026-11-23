import HomeClient from './HomeClient';
import JsonLd from '@/components/seo/JsonLd';
import { getCatalog, offerFor, productImages, SITE_URL } from '@/lib/catalog';

export default async function Home() {
  const products = await getCatalog();
  const featured = products.slice(0, 8);

  // Prices are marked up server-side so they are readable without JavaScript.
  const listSchema =
    featured.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Featured pieces',
          itemListElement: featured.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Product',
              name: p.name,
              url: `${SITE_URL}/products/${p.id}`,
              sku: p.sku || undefined,
              image: productImages(p),
              brand: { '@type': 'Brand', name: p.brand || 'Amrooz Collection' },
              offers: offerFor(p),
            },
          })),
        }
      : null;

  return (
    <>
      {listSchema && <JsonLd data={listSchema} />}
      <HomeClient initialProducts={products} />
    </>
  );
}
